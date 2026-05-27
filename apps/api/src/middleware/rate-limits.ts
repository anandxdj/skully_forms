import rateLimit, { type Options } from "express-rate-limit";

const IS_PROD = (process.env.NODE_ENV as string) === "prod";

function build(opts: Partial<Options>) {
  return rateLimit({
    standardHeaders: "draft-7",
    legacyHeaders: false,
    // The default memory store is fine for single-process dev. For multi-instance
    // production, set REDIS_URL and swap in a Redis store (left as a follow-up).
    skip: () => !IS_PROD && process.env.DISABLE_RATE_LIMIT === "true",
    handler: (_req, res) => {
      res.status(429).json({
        success: false,
        error: { code: "RATE_LIMITED", message: "Too many requests. Please try again shortly." },
      });
    },
    ...opts,
  });
}

// Global guardrail across every /trpc + /api hit. Generous in dev, tighter in prod.
export const globalLimiter = build({
  windowMs: 60 * 1000,
  limit: IS_PROD ? 300 : 2000,
});

// 5/min/IP and 20/hour caps on signin are deliberately layered so a slow burn
// and a fast burst are both stopped.
export const signInLimiter = build({
  windowMs: 60 * 1000,
  limit: 5,
});

export const signUpLimiter = build({
  windowMs: 60 * 60 * 1000,
  limit: 5,
});

export const publicSubmitLimiter = build({
  windowMs: 60 * 1000,
  limit: 30,
});

export const uploadLimiter = build({
  windowMs: 60 * 1000,
  limit: 10,
});

export const analyticsRebuildLimiter = build({
  windowMs: 60 * 1000,
  limit: 3,
});
