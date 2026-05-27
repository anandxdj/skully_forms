import crypto from "node:crypto";
import { promisify } from "node:util";

// Async scrypt — keeps the event loop free during hashing.
const scrypt = promisify<string | Buffer, Buffer, number, crypto.ScryptOptions, Buffer>(
  crypto.scrypt as never,
);

// ─── Tunable cost parameters ─────────────────────────────────────────────────
// Defaults follow OWASP 2024 guidance for scrypt: N>=2^15, r=8, p=1, ~64MB.
// Validated under load for ~70ms / op on a modern server core.
const SCRYPT_N = 1 << 15;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const KEY_LEN = 64;
const SALT_LEN = 16;
const MAX_MEM = 128 * SCRYPT_N * SCRYPT_R * 2; // headroom for scrypt's internal alloc

const SCRYPT_PREFIX = "scrypt$";

/**
 * Hash a password with scrypt. Returns a versioned, self-describing string.
 * Format: `scrypt$<N>$<r>$<p>$<saltHex>$<keyHex>`.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(SALT_LEN);
  const key = await scrypt(password.normalize("NFKC"), salt, KEY_LEN, {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P,
    maxmem: MAX_MEM,
  });
  return `${SCRYPT_PREFIX}${SCRYPT_N}$${SCRYPT_R}$${SCRYPT_P}$${salt.toString("hex")}$${key.toString(
    "hex",
  )}`;
}

/**
 * Verify a password against a stored hash. Supports the modern scrypt format
 * AND the legacy `salt:hash` PBKDF2 format produced by earlier code, so existing
 * users can sign in once and be rehashed on the fly (see `needsRehash`).
 */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  if (!stored) return false;
  const normalized = password.normalize("NFKC");

  if (stored.startsWith(SCRYPT_PREFIX)) {
    const parts = stored.slice(SCRYPT_PREFIX.length).split("$");
    if (parts.length !== 5) return false;
    const [nStr, rStr, pStr, saltHex, keyHex] = parts as [string, string, string, string, string];
    const N = Number(nStr);
    const r = Number(rStr);
    const p = Number(pStr);
    if (!Number.isFinite(N) || !Number.isFinite(r) || !Number.isFinite(p)) return false;

    const salt = Buffer.from(saltHex, "hex");
    const expected = Buffer.from(keyHex, "hex");
    if (salt.length === 0 || expected.length === 0) return false;

    const actual = await scrypt(normalized, salt, expected.length, {
      N,
      r,
      p,
      maxmem: Math.max(MAX_MEM, 128 * N * r * 2),
    });
    return crypto.timingSafeEqual(actual, expected);
  }

  // Legacy PBKDF2-SHA512 format used by earlier versions: `<saltHex>:<keyHex>`,
  // 1,000 iterations, 64-byte key. Kept only so existing users can sign in
  // once and be rehashed on the fly.
  if (stored.includes(":") && !stored.includes("$")) {
    const parts = stored.split(":");
    if (parts.length !== 2) return false;
    const [saltHex, keyHex] = parts as [string, string];
    if (!saltHex || !keyHex) return false;
    const expected = Buffer.from(keyHex, "hex");
    const actual = crypto.pbkdf2Sync(normalized, saltHex, 1000, 64, "sha512");
    if (actual.length !== expected.length) return false;
    return crypto.timingSafeEqual(actual, expected);
  }

  return false;
}

/**
 * Returns true when the stored hash uses an older / weaker scheme than the
 * current default and should be rehashed on next successful login.
 */
export function needsRehash(stored: string): boolean {
  if (!stored) return true;
  if (!stored.startsWith(SCRYPT_PREFIX)) return true; // legacy PBKDF2
  const parts = stored.slice(SCRYPT_PREFIX.length).split("$");
  if (parts.length !== 5) return true;
  const [nStr, rStr, pStr] = parts as [string, string, string, string, string];
  return Number(nStr) < SCRYPT_N || Number(rStr) < SCRYPT_R || Number(pStr) < SCRYPT_P;
}
