import type { Request, Response, NextFunction } from "express";
import { env } from "../env";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

function isLocalhostOrigin(origin: string): boolean {
  return (
    origin.startsWith("http://localhost:") ||
    origin === "http://localhost" ||
    origin.startsWith("http://127.0.0.1:") ||
    origin === "http://127.0.0.1"
  );
}

/**
 * Stateless CSRF guard. Refuses state-mutating requests whose `Origin`
 * (or `Referer`, as a fallback) is not on the allow-list. Combined with the
 * HttpOnly + SameSite=Strict session cookie, this closes the cross-site
 * mutation gap that helmet alone does not cover.
 *
 * Safe methods (GET/HEAD/OPTIONS) bypass. So do same-origin fetches that
 * announce themselves via `Sec-Fetch-Site: same-origin` / `none`.
 */
export function originGuard(req: Request, res: Response, next: NextFunction) {
  if (SAFE_METHODS.has(req.method)) return next();

  let origin: string | null = null;
  const rawOrigin = req.headers.origin;
  if (typeof rawOrigin === "string" && rawOrigin.length > 0) {
    origin = rawOrigin;
  } else if (typeof req.headers.referer === "string") {
    try {
      origin = new URL(req.headers.referer).origin;
    } catch {
      origin = null;
    }
  }

  const fetchSite = req.headers["sec-fetch-site"];
  if (!origin && (fetchSite === "same-origin" || fetchSite === "none")) {
    return next();
  }

  if (origin) {
    if (isLocalhostOrigin(origin)) return next();
    if (env.ALLOWED_ORIGINS.includes(origin)) return next();
  }

  return res.status(403).json({
    success: false,
    error: { code: "CSRF_BLOCKED", message: "Cross-site request rejected." },
  });
}
