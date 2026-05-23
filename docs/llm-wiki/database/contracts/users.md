---
title: Database Contract - Users Table
version: 1.0.0
scope: database
last_updated: 2026-05-22
owner: database-team
tags: [drizzle, schema, users, model]
chunk_id: db-contract-users
---

# Database Contract - Users Table

## Covers
- Drizzle schema columns for the `users` table
- Primary keys, indices, and unique email constraints
- Inferred TypeScript data shapes (`SelectUser`, `InsertUser`)

## Excludes
- General database connection parameters
- Relational mapping of unrelated tables (e.g. sessions, posts)

## 👤 Users Schema Blueprint
The `users` table tracks accounts and OAuth profiles. It is defined in `packages/database/models/user.ts`.

### Columns & Specifications
- **`id`** (`uuid`): Primary key. Automatically generates a random UUID using `defaultRandom()`.
- **`fullName`** (`varchar(80)`): Required field. Maps to `full_name` in PostgreSQL.
- **`email`** (`varchar(255)`): Required, must be unique. Maps to `email` in PostgreSQL.
- **`emailVerified`** (`boolean`): Default is `false`. Tracks email verification state.
- **`profileImageUrl`** (`text`): Optional. Stores user profile picture web URL.
- **`createdAt`** (`timestamp`): Default is `now()`. Chronological creation marker.
- **`updatedAt`** (`timestamp`): Automatically updates to current timestamp on any row update.
<!-- chunk-end -->

## 🧩 TypeScript Contracts
Drizzle provides static types inferred from the schema to represent select and insert records:

### TypeScript Interfaces
- **`SelectUser`**: The shape of a record returned by a query (e.g., `typeof usersTable.$inferSelect`).
- **`InsertUser`**: The shape of a record required for insertion (e.g., `typeof usersTable.$inferInsert`). Note that `id`, `emailVerified`, `createdAt`, and `updatedAt` are optional during inserts due to defaults.
<!-- chunk-end -->

## ⚠️ Users Table Guardrails

### Schema Constraints
- **Email Uniqueness**: Database insertions will throw an error if the email already exists. Always validate email existence or execute upserts to avoid crashes.
- **User Constraints**:
  ⚠️ LLM NOTE: Never suggest custom columns on the `users` table without modifying the schema definition in `packages/database/models/user.ts`. Never construct insertion statements omitting `fullName` or `email`, as they are required and will trigger SQL violations.
<!-- chunk-end -->
