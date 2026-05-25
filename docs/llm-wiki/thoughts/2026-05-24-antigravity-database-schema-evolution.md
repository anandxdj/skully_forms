---
title: Thoughts - Database Schema Evolution for Authentication and Advanced Features
version: 1.0.0
scope: thoughts
last_updated: 2026-05-24
owner: dev-platform-team
tags: [antigravity, thought-log, database, schema, authentication, drizzle, postgres]
chunk_id: thought-database-schema-evolution
---

# Thoughts - Database Schema Evolution for Authentication and Advanced Features

## Covers
- Rationale behind schema design for credentials, OAuth connections, sessions, assets, and advanced forms/submissions columns.
- Learnings, architecture trade-offs, and design principles applied.
- Verification and build success results.

## Excludes
- Specific front-end page state designs.
- Web Socket auth configurations.

## A. Design Decisions & Rationale

### Local Credentials vs. OAuth-Only Design
We updated the `usersTable` to include credential fields (`passwordHash`, `verificationToken`, `resetPasswordToken`, `resetPasswordExpires`). Making these fields **nullable** is a critical design trade-off. This supports both standard email-password signups and passwordless, pure social OAuth profiles (such as Google OAuth) without forcing empty placeholders or artificial values in password columns.

### Decoupled Session Tracking Table
We opted to create a separate `sessionsTable` to track active, hashed refresh tokens rather than storing a single `refreshToken` string directly on the `User` model (as seen in `open_poll`). 
- **Benefits**:
  1. Multiple device sign-ins (e.g. tablet, mobile, desktop) can run simultaneously without overriding and invalidating each other's refresh tokens.
  2. Enables a granular session management dashboard where users can view device metadata (`deviceInfo`) and revoke individual logins.
  3. Supports stateful, secure token rotation and invalidation upon explicit logout.

### Cataloging Uploaded Media via Assets
Files uploaded in `skully_forms` (avatars, theme backdrops, and respondent answers) were originally flat files saved on Express without a database footprint.
- **Why this changed**: Cataloging them in the `assetsTable` binds them to their parent form (`formId`) and answer payload (`submissionId`) with database cascades. This ensures that deleting a form or submission automatically cascade-purges its associated assets, avoiding orphaned files and preventing server storage bloat.

### Compound Constraints and Fast Lookups
We established strict indexes on search vectors:
- A compound unique index `(provider, providerAccountId)` on `accounts` to prevent linking a single social account to multiple profiles.
- Indexing on `sessions.token` for O(1) session resolution during tRPC request context auth validation.
- Nullable `userId` with `SET NULL` on `assets` to ensure respondent files remain intact for analytic counts even if a respondent permanently deletes their user account.

---

## B. Execution & Verification

### Successful Migrations
We ran Drizzle Kit to successfully generate and push SQL migrations:
- **Generated**: `0002_glamorous_tana_nile.sql`
- **Applied**: Pushed to the local PostgreSQL instance without any column conflicts.

### Flawless Build Verification
We verified our changes across the entire monorepo:
1. `pnpm run check-types` passed successfully.
2. `pnpm run build` completed perfectly with Turborepo with **zero errors**.
<!-- chunk-end -->
