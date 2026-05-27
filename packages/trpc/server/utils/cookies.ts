import type { Response } from "express";
import { SESSION_COOKIE_NAME, SESSION_TTL_MS } from "@repo/services/auth";

const IS_PROD = (process.env.NODE_ENV as string) === "prod";
const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN || undefined;

/**
 * Set the session cookie on the response.
 * - `httpOnly`: not readable from JS — defeats XSS-based token theft.
 * - `sameSite=lax`: blocks cross-site POSTs while still allowing top-level navs.
 * - `secure`: only on production; localhost dev needs http for the existing flow.
 */
export function setSessionCookie(res: Response, rawToken: string, expiresAt: Date): void {
  res.cookie(SESSION_COOKIE_NAME, rawToken, {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: "lax",
    expires: expiresAt,
    maxAge: SESSION_TTL_MS,
    path: "/",
    domain: COOKIE_DOMAIN,
  });
}

export function clearSessionCookie(res: Response): void {
  res.clearCookie(SESSION_COOKIE_NAME, {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: "lax",
    path: "/",
    domain: COOKIE_DOMAIN,
  });
}

export { SESSION_COOKIE_NAME };
