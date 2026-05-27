import express from "express";
import cookieParser from "cookie-parser";
import { logger } from "@repo/logger";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import multer from "multer";

import * as trpcExpress from "@trpc/server/adapters/express";
import { generateOpenApiDocument, createOpenApiExpressMiddleware } from "trpc-to-openapi";
import { apiReference } from "@scalar/express-api-reference";

import { serverRouter, createContext } from "@repo/trpc/server";

import { env } from "./env";
import {
  globalLimiter,
  signInLimiter,
  signUpLimiter,
  publicSubmitLimiter,
  uploadLimiter,
  analyticsRebuildLimiter,
} from "./middleware/rate-limits";
import { requireSession, type AuthedRequest } from "./middleware/session";
import { originGuard } from "./middleware/csrf";

export const app = express();

// Trust the first proxy hop so req.ip and X-Forwarded-For are honored when
// behind a reverse proxy. Required for accurate rate-limit keying.
app.set("trust proxy", 1);
app.disable("x-powered-by");

const openApiDocument = generateOpenApiDocument(serverRouter, {
  title: "Skully Forms API",
  version: "1.0.0",
  baseUrl: env.BASE_URL.concat("/api"),
});

// ─── Security Headers ──────────────────────────────────────────────────────────
// Helmet sets sensible defaults: CSP, X-Content-Type-Options, Referrer-Policy,
// HSTS (only when served over HTTPS), etc. The Scalar docs need a permissive
// CSP, so we relax it on the docs path only.
app.use(
  helmet({
    contentSecurityPolicy: env.IS_PROD ? undefined : false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

// ─── CORS ──────────────────────────────────────────────────────────────────────
// Localhost stays allowed unconditionally (per project direction).
// ALLOWED_ORIGINS env adds any production origins on top of that.
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const isLocalhost =
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:") ||
        origin === "http://localhost:3000" ||
        origin === "http://127.0.0.1:3000";
      if (isLocalhost) return callback(null, true);

      if (env.ALLOWED_ORIGINS.includes(origin)) return callback(null, true);

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

// ─── Core middleware ───────────────────────────────────────────────────────────
app.use(cookieParser());

// Body limits — 1 MB everywhere except the public submit endpoint (256 KB).
app.use((req, res, next) => {
  const isPublicSubmit = /^\/(?:trpc|api)\/.*submit/i.test(req.originalUrl || req.url);
  const limit = isPublicSubmit ? "256kb" : "1mb";
  express.json({ limit })(req, res, (err) => {
    if (err) return next(err);
    express.urlencoded({ limit, extended: true })(req, res, next);
  });
});

// Request logging (anonymized IP).
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";
    const anonymizedIp =
      typeof ip === "string"
        ? ip.includes(".")
          ? ip.split(".").slice(0, 3).join(".") + ".0"
          : ip.split(":").slice(0, 3).join(":") + "::"
        : "unknown";

    logger.info(
      `${req.method} ${req.originalUrl || req.url} ${res.statusCode} - ${duration}ms [IP: ${anonymizedIp}]`,
    );
  });
  next();
});

// ─── Uploads ───────────────────────────────────────────────────────────────────
const uploadsDir = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded files. Images and short videos render inline; everything
// else is forced to download via `Content-Disposition: attachment` so the
// browser never renders attacker-controlled HTML/SVG/text inline. The MIME
// allow-list already restricts upload types but the attachment header is
// belt-and-suspenders against a future list slip.
const INLINE_SAFE_EXTS = new Set([
  "jpg", "jpeg", "png", "gif", "webp",
  "mp4", "webm", "mov",
]);

app.use(
  "/uploads",
  express.static(uploadsDir, {
    fallthrough: true,
    setHeaders: (res, filePath) => {
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.setHeader("Cache-Control", "private, max-age=3600");
      const ext = path.extname(filePath).slice(1).toLowerCase();
      if (!INLINE_SAFE_EXTS.has(ext)) {
        res.setHeader("Content-Disposition", "attachment");
      }
    },
  }),
);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const fileUuid = crypto.randomUUID();
    // Strip everything except the extension to neutralize traversal / weird names.
    const ext = path.extname(file.originalname).replace(/[^a-zA-Z0-9.]/g, "").slice(0, 16);
    cb(null, `${fileUuid}${ext}`);
  },
});

const ALLOWED_MIMES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIMES.has(file.mimetype)) return cb(null, true);
    cb(new Error("File type not allowed."));
  },
});

// ─── Public routes ─────────────────────────────────────────────────────────────
app.get("/", (_req, res) => {
  return res.json({ message: "Skully Forms is up and running..." });
});

app.get("/health", (_req, res) => {
  return res.json({ message: "Skully Forms server is healthy", healthy: true });
});

// OpenAPI document + Scalar docs. Off by default in prod (toggleable via env).
if (env.EXPOSE_DOCS) {
  logger.debug(`openapi.json: ${env.BASE_URL}/openapi.json`);
  app.get("/openapi.json", (_req, res) => res.json(openApiDocument));
  logger.debug(`docs: ${env.BASE_URL}/docs`);
  app.use("/docs", apiReference({ url: "/openapi.json" }));
}

// ─── Rate-limited tRPC + OpenAPI procedure paths ───────────────────────────────
// Apply targeted limiters BEFORE the global limiter so the strict caps run first.
const signInPaths = ["/trpc/auth.signIn", "/api/authentication/signin"];
const signUpPaths = ["/trpc/auth.signUp", "/api/authentication/signup"];
const submitPaths = ["/trpc/submissions.submitForm", "/api/public/forms"]; // OpenAPI: /api/public/forms/:slug/submit
const rebuildPaths = [
  "/trpc/submissions.rebuildFormAnalytics",
  // OpenAPI rebuild path lives under /api/submissions/:id/analytics/rebuild; the
  // generic prefix below would over-match, so we register a more specific RegExp
  // when mounting.
];

app.use(signInPaths, signInLimiter);
app.use(signUpPaths, signUpLimiter);
app.use(submitPaths, publicSubmitLimiter);
app.use(rebuildPaths, analyticsRebuildLimiter);
app.use(/\/api\/submissions\/[^/]+\/analytics\/rebuild$/, analyticsRebuildLimiter);

// CSRF guard. Refuses cross-site mutations on both API surfaces. Combined
// with SameSite=Strict session cookies this closes the cross-site mutation
// gap. Mounted AFTER rate-limit caps so a flood of malicious cross-origin
// hits still trips the limiter, but BEFORE the catch-all global limit so
// CSRF returns 403 before counting against the legit user's quota.
app.use("/trpc", originGuard);
app.use("/api", originGuard);

// Catch-all rate limit on the two API surfaces. Protects everything that
// doesn't have a tighter route-specific cap above.
app.use("/trpc", globalLimiter);
app.use("/api", globalLimiter);

// ─── Upload endpoint (now session-protected + rate-limited) ────────────────────
app.post("/api/upload", uploadLimiter, requireSession, (req: AuthedRequest, res) => {
  const uploadSingle = upload.single("file");

  uploadSingle(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No file was uploaded." });
    }

    const mimeType = req.file.mimetype;
    const fileSize = req.file.size;

    if (mimeType.startsWith("image/") && fileSize > 10 * 1024 * 1024) {
      try {
        fs.unlinkSync(req.file.path);
      } catch {
        logger.error(`Failed to delete oversized image: ${req.file.path}`);
      }
      return res.status(400).json({ success: false, error: "Image files must be under 10MB." });
    }

    if (mimeType.startsWith("video/") && fileSize > 50 * 1024 * 1024) {
      try {
        fs.unlinkSync(req.file.path);
      } catch {
        logger.error(`Failed to delete oversized video: ${req.file.path}`);
      }
      return res.status(400).json({ success: false, error: "Video files must be under 50MB." });
    }

    const fileUrl = `${env.BASE_URL}/uploads/${req.file.filename}`;

    return res.json({
      success: true,
      data: {
        url: fileUrl,
        name: req.file.originalname,
        size: req.file.size,
        type: req.file.mimetype,
      },
    });
  });
});

// ─── Mount tRPC + OpenAPI ──────────────────────────────────────────────────────
app.use(
  "/api",
  createOpenApiExpressMiddleware({
    router: serverRouter,
    createContext,
  }),
);

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: serverRouter,
    createContext,
  }),
);

export default app;
