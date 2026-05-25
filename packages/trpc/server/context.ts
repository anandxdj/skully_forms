import type { Request, Response } from "express";

export interface ContextUser {
  id: string;
}

export async function createContext({
  req,
  res,
}: {
  req: Request;
  res: Response;
}) {
  // Dev-mode identity: read x-user-id header.
  // This will be replaced with JWT cookie extraction in Phase 4 (auth).
  const userId = req.headers["x-user-id"];
  const user: ContextUser | null =
    typeof userId === "string" && userId.length > 0 ? { id: userId } : null;

  return { user, req, res };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
