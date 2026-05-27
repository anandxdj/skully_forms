import crypto from "node:crypto";
import { db, eq, and, isNull, gt } from "@repo/database";
import { sessionsTable, type SelectSession } from "@repo/database/schema";

// ─── Constants ────────────────────────────────────────────────────────────────
const SESSION_TOKEN_BYTES = 32; // 256-bit opaque token
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export const SESSION_COOKIE_NAME = "sf_sid";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function hashToken(rawToken: string): string {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

export interface CreateSessionOptions {
  userId: string;
  userAgent?: string | null;
  ip?: string | null;
}

export interface IssuedSession {
  rawToken: string;
  session: SelectSession;
  expiresAt: Date;
}

/**
 * Create a session: generate a random opaque token, persist its sha256, return
 * the raw token to be set as a cookie. The raw token never goes to the DB.
 */
export async function createSession(opts: CreateSessionOptions): Promise<IssuedSession> {
  const rawToken = crypto.randomBytes(SESSION_TOKEN_BYTES).toString("base64url");
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  const deviceInfo = [opts.userAgent ?? "", opts.ip ?? ""].filter(Boolean).join(" | ") || null;

  const [row] = await db
    .insert(sessionsTable)
    .values({
      userId: opts.userId,
      token: tokenHash,
      expiresAt,
      deviceInfo,
    })
    .returning();

  if (!row) throw new Error("Failed to persist session.");
  return { rawToken, session: row, expiresAt };
}

/**
 * Resolve a raw cookie token to an active session row.
 * Returns null if the token is unknown, expired, or revoked.
 */
export async function resolveSession(rawToken: string): Promise<SelectSession | null> {
  if (!rawToken) return null;
  const tokenHash = hashToken(rawToken);

  const [row] = await db
    .select()
    .from(sessionsTable)
    .where(
      and(
        eq(sessionsTable.token, tokenHash),
        isNull(sessionsTable.revokedAt),
        gt(sessionsTable.expiresAt, new Date()),
      ),
    )
    .limit(1);

  return row ?? null;
}

/**
 * Revoke a session by raw token. Idempotent — succeeds even if the token is
 * already revoked or absent.
 */
export async function revokeSession(rawToken: string): Promise<void> {
  if (!rawToken) return;
  const tokenHash = hashToken(rawToken);
  await db
    .update(sessionsTable)
    .set({ revokedAt: new Date() })
    .where(and(eq(sessionsTable.token, tokenHash), isNull(sessionsTable.revokedAt)));
}

/** Revoke every active session for a user. */
export async function revokeAllSessions(userId: string): Promise<void> {
  await db
    .update(sessionsTable)
    .set({ revokedAt: new Date() })
    .where(and(eq(sessionsTable.userId, userId), isNull(sessionsTable.revokedAt)));
}

export { SESSION_TTL_MS };
