---
title: Thought Ledger - Credentials Authentication
version: 1.0.0
scope: thoughts
last_updated: 2026-05-25
owner: database-team
tags: [thoughts, authentication, backend, trpc, custom-hashing]
chunk_id: thought-credentials-authentication
---

# Thought Ledger - Credentials Authentication

## Covers
- Implementation details of real credential-based authentication
- Cryptographical password hashing using pbkdf2Sync in Node.js
- Redirection guards and localStorage active session context sync
- tRPC route contracts addition

## Excludes
- Specific layout details of forms
- Future OAuth OAuth2 provider integration details

---

## 🔒 Hashing Design & Decisions

### Secure PBKDF2 Password Hashing
We selected Node.js's native `crypto` module, specifically `pbkdf2Sync` using SHA-512 and a random 16-byte salt, for hashing credentials passwords. 
This choice has two core advantages:
1. **Zero External Dependencies**: Avoids bulky binary dependencies (e.g. native C++ compilation issues for packages like `bcrypt`) which frequently fail to compile across OS platforms.
2. **Standard Cryptographic Security**: PBKDF2 is fully recognized, safe, and easily portable to alternative backend runtimes.

We format stored password hashes as `salt:hash` inside the database's `passwordHash` column. This makes verification simple and entirely self-contained within each query record.
<!-- chunk-end -->

---

## 🕹️ Client Context Synchronization

### localStorage & Header Integration
The existing Next.js frontend has a global tRPC setup in `apps/web/trpc/create-client.ts` that maps an `x-user-id` header to requests. 
We integrated our auth system directly into this pipeline:
- **Registration & Sign-In**: Return the user's authentic `id` (UUID) upon successful `signUp` and `signIn` mutations.
- **Identity Storage**: Store the returned user ID inside `localStorage` (via key `x-user-id`), matching the header key.
- **Session Redirection**: On the dashboard, fetch user details using the newly created `auth.me` endpoint. If unauthorized or query fails, remove `x-user-id` and redirect the visitor to `/login`.
<!-- chunk-end -->

---

## 🛠️ Solved Blockers

### React Query v5 / tRPC onError Callback Deprecation
While adding `trpc.auth.me.useQuery` in the Dashboard component, we initially used the standard `onError` query option. The TypeScript compiler threw an overload signature violation because React Query v5 has deprecated direct `onError` event handler callbacks inside options.

**Workaround**: We resolved this issue by extracting the `isError` boolean state from the `useQuery` return hook, and using a clean, native `React.useEffect` to trigger the redirection and error alert toast. The monorepo now builds perfectly without type compilation warnings.
<!-- chunk-end -->

---

## 🏁 Handover & Next Actions

### Next Steps for Future Agents
1. **OAuth Expansion**: The `authRouter` supports google OAuth credentials checking. Wire up the Google button callbacks once standard client secret keys are configured in `.env`.
2. **Session Security Upgrade**: In Phase 4, transition the client identity from `localStorage` storage to secure, HTTP-only JWT cookies inside `context.ts` middleware.
<!-- chunk-end -->
