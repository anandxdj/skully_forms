---
title: Database Contract - Sessions Table
version: 1.0.0
scope: database
last_updated: 2026-05-24
owner: dev-platform-team
tags: [drizzle, schema, sessions, refresh-token, model]
chunk_id: db-contract-sessions
---

# Database Contract - Sessions Table

## Covers
- Drizzle schema columns for the `sessions` table.
- Indexing and constraints for stateful refresh token tracking.
- Inferred TypeScript data shapes (`SelectSession`, `InsertSession`).

## Excludes
- JWT signing key details and access token expiration.
- Client-side cookie management code.

## 👤 Sessions Schema Blueprint
The `sessions` table tracks active JWT refresh tokens, enabling stateful refresh token rotation and allowing multiple device sign-ins with independent revocation. It is defined in `packages/database/models/session.ts`.

### Columns & Specifications
- **`id`** (`uuid`): Primary key. Automatically generates a random UUID using `defaultRandom()`.
- **`userId`** (`uuid`, references `users(id)`, cascade delete): Relates the active session to a primary user profile. If the user profile is deleted, all active sessions are destroyed.
- **`token`** (`varchar(512)`): Hashed refresh token identifier (unique).
- **`expiresAt`** (`timestamp`): Expiration timestamp of the refresh token.
- **`deviceInfo`** (`text`, nullable): Metadata holding the uploader device browser, platform, and approximate IP information.
- **`revokedAt`** (`timestamp`, nullable): Soft session revocation timestamp. If non-null, the session is invalidated/revoked without hard-deleting the database record.
- **`createdAt`** (`timestamp`): Default is `now()`. Chronological creation marker.
<!-- chunk-end -->

## 🧩 TypeScript Contracts
Drizzle provides static types inferred from the schema to represent select and insert records:
- **`SelectSession`**: Shape of a record returned by a query (`typeof sessionsTable.$inferSelect`).
- **`InsertSession`**: Shape of a record required for insertion (`typeof sessionsTable.$inferInsert`).
<!-- chunk-end -->

## ⚠️ Sessions Table Guardrails
- **Token Uniqueness**: Each session token must be unique, index-backed (`sessions_token_idx`) to ensure blazing-fast lookups during validation check queries.
- **Cascade Purge**: The database cascading deletes all sessions for a user if their account is permanently deleted.
<!-- chunk-end -->
