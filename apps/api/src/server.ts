import express from "express";
import cookieParser from "cookie-parser";
import { logger } from "@repo/logger";
import cors from "cors";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import multer from "multer";

import * as trpcExpress from "@trpc/server/adapters/express";
import { generateOpenApiDocument, createOpenApiExpressMiddleware } from "trpc-to-openapi";
import { apiReference } from "@scalar/express-api-reference";

import { serverRouter, createContext } from "@repo/trpc/server";

import { env } from "./env";

export const app = express();

const openApiDocument = generateOpenApiDocument(serverRouter, {
  title: "Skully Forms API",
  version: "1.0.0",
  baseUrl: env.BASE_URL.concat("/api"),
});

// Configure CORS
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or postman)
      if (!origin) return callback(null, true);
      
      const allowedOrigins = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
      ];
      
      if (allowedOrigins.includes(origin) || origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

// ─── Middleware Enhancements ───────────────────────────────────────────────

// 1. Cookie Parser for Future Auth
app.use(cookieParser());

// 2. Express Body Limiters
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ limit: "1mb", extended: true }));

// 3. Winston Request Logging Middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";
    // Anonymize IP: keep only first three octets of IPv4 or basic prefix of IPv6
    const anonymizedIp = typeof ip === "string"
      ? ip.includes(".")
        ? ip.split(".").slice(0, 3).join(".") + ".0"
        : ip.split(":").slice(0, 3).join(":") + "::"
      : "unknown";
    
    logger.info(
      `${req.method} ${req.originalUrl || req.url} ${res.statusCode} - ${duration}ms [IP: ${anonymizedIp}]`
    );
  });
  next();
});

// 4. Ensure Static uploads folder exists and serve it
const uploadsDir = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use("/uploads", express.static(uploadsDir));

// 5. Setup Multer for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const fileUuid = crypto.randomUUID();
    const sanitizedOriginalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    cb(null, `${fileUuid}-${sanitizedOriginalName}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB overall max file size in multer
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image and video files are allowed."));
    }
  },
});

// ─── HTTP Route Handlers ───────────────────────────────────────────────────

app.get("/", (req, res) => {
  return res.json({ message: "Skully Forms is up and running..." });
});

app.get("/health", (req, res) => {
  return res.json({ message: "Skully Forms server is healthy", healthy: true });
});

logger.debug(`openapi.json: ${env.BASE_URL}/openapi.json`);
app.get("/openapi.json", (req, res) => {
  return res.json(openApiDocument);
});

logger.debug(`docs: ${env.BASE_URL}/docs`);
app.use("/docs", apiReference({ url: "/openapi.json" }));

// 6. Multer Upload Route Handlers
app.post("/api/upload", (req, res) => {
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

    // Validate size limits
    if (mimeType.startsWith("image/") && fileSize > 10 * 1024 * 1024) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (err) {
        logger.error(`Failed to delete oversized image: ${req.file.path}`);
      }
      return res.status(400).json({ success: false, error: "Image files must be under 10MB." });
    }

    if (mimeType.startsWith("video/") && fileSize > 50 * 1024 * 1024) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (err) {
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
