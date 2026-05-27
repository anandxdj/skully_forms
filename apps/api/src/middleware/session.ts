import type { Request, Response, NextFunction } from "express";
import { resolveSession, SESSION_COOKIE_NAME } from "@repo/services/auth";

const IS_DEV = (process.env.NODE_ENV as string) !== "prod";

export interface AuthedRequest extends Request {
  userId?: string;
}

/**
 * Express middleware: 401s unless the request carries a valid session cookie.
 * Used for non-tRPC endpoints (e.g. /api/upload) that need the same identity
 * guarantee as protected tRPC procedures.
 *
 * In dev only, accepts `x-user-id` as a fallback so existing local tooling
 * keeps working without a session. This path is hard-disabled in prod.
 */
export async function requireSession(
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const rawToken = req.cookies?.[SESSION_COOKIE_NAME];
  if (rawToken) {
    const session = await resolveSession(rawToken);
    if (session) {
      req.userId = session.userId;
      return next();
    }
  }

  if (IS_DEV) {
    const headerUserId = req.headers["x-user-id"];
    if (typeof headerUserId === "string" && headerUserId.length > 0) {
      req.userId = headerUserId;
      return next();
    }
  }

  res.status(401).json({ success: false, error: "Authentication required." });
}
