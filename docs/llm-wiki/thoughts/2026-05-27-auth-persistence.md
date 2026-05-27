---
scope: auth
date: 2026-05-27
topic: frontend auth persistence
---

## Scope
Added client-side auth session persistence so users stay logged in across page refreshes.

## What was built
- `apps/web/providers/auth.tsx` — `AuthProvider` wraps the app; calls `trpc.auth.me` once on mount (5m stale time) to hydrate user state; exposes `user`, `isLoading`, `logout` via `AuthContext`.
- `apps/web/hooks/use-require-auth.ts` — calls `useAuth()`, redirects to `/login` via `router.replace` when `!isLoading && !user`.
- `GlobalProviders` updated to wrap children with `AuthProvider` (inside tRPC provider).
- Dashboard: removed duplicate `trpc.auth.me.useQuery`, removed `localStorage` remnants, wired `logout` to real `signOut` mutation.
- Builder and Responses views: added `useRequireAuth()` call at top.
- Login page: redirects to `/dashboard` if already authenticated (`useAuth` + `useEffect`).

## Design rationale
Backend already uses httpOnly session cookies — the only way to know auth state client-side is to call `auth.me`. TanStack Query deduplicates the request so only one network call fires regardless of how many components call `useAuth`.

`router.replace` (not `push`) prevents the protected page from appearing in browser history.

## Blockers / workarounds
- Dashboard had its own `trpc.auth.me.useQuery` with `isError` redirect and `localStorage.removeItem` — removed in favor of centralized `AuthProvider`. The `userLoading` references in JSX were replaced with `isLoading` (forms query loading).
- Login page already had `useEffect` import — reused it for the already-authed redirect.

## Active state / handover
Auth persistence complete. Next: consider showing a skeleton/loading state in protected pages while `auth.isLoading` is true (currently `useRequireAuth` just redirects when done loading — no flash guard).
