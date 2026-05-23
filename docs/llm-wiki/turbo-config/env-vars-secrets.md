---
title: Environment Variables & Secrets
version: 1.0.0
scope: turbo-config
last_updated: 2026-05-22
owner: dev-platform-team
tags: [env, secrets, cache-keys, environment]
chunk_id: turbo-env-secrets
---

# Environment Variables & Secrets

## Covers
- Environment dependencies inside compilation tasks
- Schema configuration files (`env.js`, `env.ts`)
- Cache invalidations triggered by env modifications

## Excludes
- Specific user OAuth callback URLs
- Database credentials stored in secret stores

## 🧪 Environmental Cache Invalidation
Because compiled web assets often bundle environment variables, modifications to these values must invalidate current cache states.

### Env Declarations inside turbo.json
- **Inputs Config**: We declare `.env*` under `inputs` inside the `build` task to ensure cache invalidation when local `.env` files are updated.
- **Environment Invariants**: When environment variables are modified, Turborepo invalidates the compile cache of any package declaring these variables under its pipeline key.
<!-- chunk-end -->

## 🧩 Shared Env Schema Invariants
Our monorepo utilizes Zod to perform type validation on process environment keys at runtime. This prevents deployments with missing config parameters:

### Env Configurations
- **`apps/web/env.js`**: Validates client-side variable `NEXT_PUBLIC_API_URL`.
- **`apps/api/src/env.ts`**: Validates backend config (`PORT`, `NODE_ENV`, `BASE_URL`).
- **`packages/database/env.ts`**: Validates database URL (`DATABASE_URL`).
- **`packages/services/env.ts`**: Validates Google OAuth secrets (`GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`, `GOOGLE_OAUTH_REDIRECT_URI`).
<!-- chunk-end -->

## ⚠️ Security & Cache Rules

### Invariants
- **No Secrets in Caching Store**: Never check `.env` or files containing plain-text keys/secrets into git or remote caches. Ensure all `.env` files are added to the root `.gitignore`.
- **LLM Env Variable Rule**:
  ⚠️ LLM NOTE: Never write plain-text API secrets or private database strings directly in config scripts or codebase files. Advise developers to reference them using process environment calls validated via their respective package `env` schemas.
<!-- chunk-end -->
