---
title: Thought Ledger - Backend Hardening (CSRF, File Whitelist, Sessions, Shutdown)
version: 1.0.0
scope: thoughts
last_updated: 2026-05-27
owner: backend-team
tags: [thoughts, security, csrf, ssrf, sessions, shutdown, file-upload]
chunk_id: thought-backend-hardening
---

# Thought Ledger - Backend Hardening

## Covers

Vulnerability audit + fixes across the API gateway, services, and DB.

| Tag | Fix | Severity |
|---|---|---|
| C1 | Origin-based CSRF guard + `SameSite=Strict` session cookie | 🔴 |
| C2 | File-answer URL whitelist — only `BASE_URL/uploads/<uuid>(.<ext>)` accepted | 🔴 |
| C3 | `Content-Disposition: attachment` on non-inline-safe `/uploads` extensions | 🔴 |
| I1 | `signOut` revokes ALL user sessions, not only the current device | 🟡 |
| I2 | `assertSafeUrlAtFireTime` helper returns pinned IP for webhook dispatcher | 🟡 |
| I3 | `sessions_cleanup_idx` + `purgeExpiredSessions()` + daily cron | 🟡 |
| I4 | Shutdown polls `server.getConnections()` until drain, then `pool.end()` | 🟡 |

Deferred: Redis-backed rate-limit store (I5), test suite (T1), Google OAuth callback (T2), `console.error → logger` (T3).

## Excludes

- Frontend changes. Builder/canvas-panel got an unrelated `fieldType` prop added externally during the run; not part of this work.
- The `apps/api/tsconfig.json` `module/moduleResolution` mismatch — user is aware (`M` in initial status).

---

## Design Rationale & Trade-offs

### CSRF: origin guard + strict cookie, not double-submit token

`SameSite=Lax` cookies on a session-cookie API are still vulnerable to cross-site top-level navigation POSTs and to some sub-domain attack scenarios. Three options:

1. Double-submit token (`X-CSRF-Token` header + non-HttpOnly cookie) — requires client plumbing on every mutating request.
2. `SameSite=Strict` cookie — bulletproof for the cookie carrier path, but breaks top-level-nav login persistence (clicking an external link to your app means the cookie isn't sent on the first navigation).
3. Stateless Origin/Referer guard — refuse mutations whose `Origin` isn't in the allow-list. No client work. Pairs naturally with `Sec-Fetch-Site` to recognise same-origin fetches.

Picked option 3 + option 2 together. The Origin guard is the load-bearing defense; `SameSite=Strict` is belt-and-suspenders. The product is an SPA login flow where strict cookie behavior is fine — there's no "click a link in email and stay logged in" requirement. The dialog post-publish copies the link, it doesn't require an authenticated landing.

Implementation lives in `apps/api/src/middleware/csrf.ts → originGuard`. Mounted on `/trpc` and `/api` AFTER the route-specific rate limits (so a flood still trips the limiter) but BEFORE the catch-all global limiter (so 403 doesn't count against legit users' quota).

### File-answer URL whitelist

The original `/^https?:\/\//.test(file.url)` accepted ANY URL. A bad actor could submit a form with `file.url = "https://evil.com/exfil?token=…"` and have that URL flow into the form owner's analytics export later. Now the URL must:

- Start with `${BASE_URL}/uploads/`.
- Resolve to a pathname matching `/^\/uploads\/[0-9a-f-]{36}(?:\.[a-zA-Z0-9]{1,16})?$/` (UUID v4 + extension up to 16 chars).
- Not contain `..` traversal.

Anything else → `400 BAD_REQUEST`. This matches the multer filename pipeline in `apps/api/src/server.ts` exactly.

Edge cases:
- `BASE_URL` is read from `process.env.BASE_URL` with a localhost fallback — `services` package shouldn't directly import `apps/api/src/env.ts`, so env access is direct.
- The extension regex is permissive (anything alphanumeric ≤16 chars) so legitimate extensions (`.jpeg`, `.webm`, `.mov`) all pass.

### Content-Disposition forced download

Old code claimed `Content-Disposition: attachment` in a comment but never wrote the header. New code: render images/videos inline (intended), but force `Content-Disposition: attachment` for every other extension. Belt-and-suspenders against:

- Future MIME allow-list slip introducing `image/svg+xml` (XSS in browsers).
- Stored HTML/JS payloads embedded inside an otherwise valid image.
- Browser sniffing past `nosniff` in old user agents.

### `signOut` revokes all devices

Prior behavior killed only the cookie's session row. If an attacker had cloned the cookie from one device, signing out on another device wouldn't kill the attacker's session. New behavior: resolve the current session, then call `revokeAllSessions(userId)`. Safer default. UX cost: signing out on phone also signs out laptop. Acceptable; can add a separate "sign out this device" verb later.

### DNS rebinding helper

`assertSafeUrl` resolves DNS at save-time. Between save and the eventual webhook fire, DNS can change. The new `assertSafeUrlAtFireTime` re-validates immediately before the request AND returns the resolved IP as `pinnedIp`. The dispatcher (when built) should use a custom http.Agent `lookup` hook that returns the pinned IP, so the actual socket connect can't be redirected by a third DNS resolve. Today's value is the helper; the dispatcher wiring comes when webhook delivery code is written.

### Session cleanup

Two pieces:
1. Composite index `(expires_at, revoked_at)` → cleanup query goes O(log n) instead of O(n).
2. `purgeExpiredSessions(revokedRetentionDays = 7)` deletes (a) all expired rows and (b) revoked rows older than the retention window. Kept retention so an auditor can see "this was revoked at X".
3. `apps/api/src/jobs/session-cleanup.ts` runs first 60s after boot then every 24h via `setInterval`. Timers `unref()` so they never block process exit. Cron registered on boot in `apps/api/src/index.ts`. Stopped on shutdown.

Picked `setInterval` over `node-cron` to avoid a new dependency. If the team later wants cron expressions (e.g. "purge at 03:00 UTC"), swap to `node-cron`.

### Shutdown drain

Original code called `server.close(cb) + pool.end()`. Per Node docs, `server.close()` does NOT immediately resolve — it waits for all existing connections to close. But existing keep-alive connections may hang indefinitely. Added:

1. `server.closeIdleConnections()` to kick keep-alives.
2. Poll loop on `server.getConnections()` until count = 0.
3. Then `pool.end()`.

15s force-exit ceiling preserved.

---

## Files Changed

| File | Change |
|---|---|
| `apps/api/src/middleware/csrf.ts` | NEW — `originGuard` stateless CSRF middleware. |
| `apps/api/src/server.ts` | Mount `originGuard` on `/trpc` + `/api`. Force `Content-Disposition: attachment` on non-inline-safe `/uploads` extensions. |
| `packages/trpc/server/utils/cookies.ts` | `sameSite: "lax"` → `"strict"` on both set/clear. |
| `packages/services/form/index.ts` | FILE answer validation now requires `BASE_URL/uploads/<uuid>` with extension/traversal hygiene. |
| `packages/trpc/server/routes/auth/route.ts` | `signOut` resolves session then `revokeAllSessions(userId)`. Imports updated. |
| `packages/services/security/url-guard.ts` | NEW `assertSafeUrlAtFireTime` returning pinned IP + parsed URL. |
| `packages/database/models/session.ts` | NEW composite index `sessions_cleanup_idx` on `(expiresAt, revokedAt)`. |
| `packages/services/auth/sessions.ts` | NEW `purgeExpiredSessions(retentionDays)` using `or` / `lt` / `sql` from drizzle-orm. |
| `apps/api/src/jobs/session-cleanup.ts` | NEW — daily `setInterval` purge with `unref()` timers + cancellable. |
| `apps/api/src/index.ts` | Schedule cron on boot, stop on shutdown. Drain poll via `server.getConnections()` + `closeIdleConnections()`. |
| `packages/database/drizzle/0008_tranquil_silver_surfer.sql` | Generated: `CREATE INDEX sessions_cleanup_idx ON sessions (expires_at, revoked_at)`. |

---

## Blockers & Workarounds

### `apps/api` TS check fails (pre-existing)

`tsconfig.json` has `moduleResolution: Node16` paired with `module: CommonJS`. TS 5+ requires `module: Node16` when `moduleResolution: Node16`. User has this file uncommitted (`M` in initial status); they're aware. Did not touch.

Type-checked via `pnpm --filter=web exec tsc --noEmit` instead, which pulls all my changes through the workspace links. Clean modulo two pre-existing unrelated errors (`landing/index.tsx` strict-null, `app/explore` missing component).

### Drizzle migration regen captured only the new index

Clean migration. Non-destructive.

### Webhook dispatcher not yet written

`assertSafeUrlAtFireTime` lands now so any future dispatcher has a safe path. Today there's no fetch call to wire it into.

---

## Active State & Handover

### What works now

- Cross-site POST/PATCH/DELETE attempts return `403 CSRF_BLOCKED`.
- Cross-site GET still works (e.g. embedded `<img>` from `/uploads`).
- File-answer URLs only accept files served by our own uploads endpoint.
- Non-image/video files in `/uploads` force download instead of inline render.
- Sign-out on any device revokes ALL of the user's sessions.
- Expired session rows are purged daily on a 24h interval starting 1 minute after boot.
- Shutdown waits for in-flight HTTP requests before closing the DB pool.

### Verification commands

```bash
pnpm --filter=@repo/database db:migrate    # apply 0008
pnpm dev                                   # boot

# CSRF
curl -X POST http://localhost:8000/trpc/auth.signOut \
  -H "Origin: https://attacker.example" -i
# → 403 CSRF_BLOCKED

# Content-Disposition
curl -I http://localhost:8000/uploads/<uuid>.txt
# → Content-Disposition: attachment

curl -I http://localhost:8000/uploads/<uuid>.png
# → no Content-Disposition (inline render)

# File whitelist (via tRPC) — try submitting a form with file.url = "https://evil.com/x.png"
# → 400 BAD_REQUEST "must reference an uploaded file from this server"

# signOut all devices — sign in twice (two browsers), signOut from A, auth.me on B → UNAUTHORIZED

# Session cleanup — wait 60s after boot, check logs for "[session-cleanup] purged N session row(s)"
```

### Pending follow-ups

1. **Redis rate-limit store (I5).** Required for multi-instance deploys. Add `REDIS_URL` env, swap `express-rate-limit` store to `rate-limit-redis`.
2. **Wire `assertSafeUrlAtFireTime` into webhook dispatcher** when that code is written.
3. **Test suite (T1).** Zero coverage today. Recommend Vitest + supertest + a drizzle test container.
4. **Google OAuth callback (T2).** Client wired in `getAuthenticationMethods()`; no callback route exists. Either implement or drop the advertised provider.
5. **Logger sanitization (T3).** Replace `console.error("[auth.signUp] failed", err)` with `logger.error(...)` and ensure email/PII isn't echoed.
6. **Server-side publish-empty-label gate.** Front-end gates this; backend should mirror in `formService.updateForm` when `published: true`.
7. **Resolve `apps/api/tsconfig.json` `module`/`moduleResolution` mismatch** (separate task; user is editing this file).

---
<!-- chunk-end -->
