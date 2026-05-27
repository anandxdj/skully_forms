import type { Request, Response } from "express";
import { resolveSession, SESSION_COOKIE_NAME } from "@repo/services/auth";

export interface ContextUser {
  id: string;
}

const IS_DEV = (process.env.NODE_ENV as string) !== "prod";

function readCookie(req: Request, name: string): string | undefined {
  // cookie-parser middleware (mounted in apps/api/src/server.ts) populates req.cookies.
  const cookies = (req as unknown as { cookies?: Record<string, string> }).cookies;
  return cookies?.[name];
}

export async function createContext({
  req,
  res,
}: {
  req: Request;
  res: Response;
}) {
  let user: ContextUser | null = null;

  // 1. Primary: opaque session cookie verified against `sessions` table.
  const rawToken = readCookie(req, SESSION_COOKIE_NAME);
  if (rawToken) {
    const session = await resolveSession(rawToken);
    if (session) {
      user = { id: session.userId };
    }
  }

  // 2. Dev-only fallback: x-user-id header. Hard-disabled in prod so the legacy
  // spoof vector cannot leak into a deployed environment.
  if (!user && IS_DEV) {
    const userId = req.headers["x-user-id"];
    if (typeof userId === "string" && userId.length > 0) {
      user = { id: userId };
    }
  }

  return { user, req, res };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
