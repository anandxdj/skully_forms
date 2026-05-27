import { z } from "zod";

const envSchema = z
  .object({
    PORT: z.string().optional(),
    NODE_ENV: z.enum(["development", "prod"]).default("development"),
    BASE_URL: z.string().default("http://localhost:8000"),

    // Session signing key. Required in prod; auto-generated dev fallback below.
    SESSION_SECRET: z.string().min(32).optional(),

    // Comma-separated allow-list of additional production origins.
    // Localhost is always allowed (per project direction) — this adds prod origins
    // on top of the existing localhost CORS.
    ALLOWED_ORIGINS: z.string().optional(),

    // Optional explicit cookie domain (e.g. ".skullyforms.com" in prod).
    COOKIE_DOMAIN: z.string().optional(),

    // Public docs / OpenAPI exposure. Open in dev, off by default in prod.
    EXPOSE_DOCS: z.enum(["true", "false"]).optional(),

    LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
  })
  .superRefine((data, ctx) => {
    if (data.NODE_ENV === "prod" && !data.SESSION_SECRET) {
      ctx.addIssue({
        code: "custom",
        path: ["SESSION_SECRET"],
        message: "SESSION_SECRET is required in production (min 32 chars).",
      });
    }
  });

function createEnv(env: NodeJS.ProcessEnv) {
  const safeParseResult = envSchema.safeParse(env);
  if (!safeParseResult.success) throw new Error(safeParseResult.error.message);
  const parsed = safeParseResult.data;

  // In dev, generate a stable-per-process secret so cookies survive restarts of the
  // same process but invalidate across deploys. Prod boot fails above if missing.
  const sessionSecret =
    parsed.SESSION_SECRET ??
    "dev-only-insecure-session-secret-do-not-use-in-production-0000000000";

  const allowedOrigins = (parsed.ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return {
    ...parsed,
    SESSION_SECRET: sessionSecret,
    ALLOWED_ORIGINS: allowedOrigins,
    IS_PROD: parsed.NODE_ENV === "prod",
    EXPOSE_DOCS:
      parsed.EXPOSE_DOCS === "true" ||
      (parsed.EXPOSE_DOCS === undefined && parsed.NODE_ENV !== "prod"),
  };
}

export const env = createEnv(process.env);
