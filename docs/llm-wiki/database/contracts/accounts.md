---
title: Database Contract - Accounts Table
version: 1.0.0
scope: database
last_updated: 2026-05-24
owner: dev-platform-team
tags: [drizzle, schema, accounts, oauth, model]
chunk_id: db-contract-accounts
---

# Database Contract - Accounts Table

## Covers
- Drizzle schema columns for the `accounts` table.
- Indexing and constraints for multi-provider OAuth connections.
- Inferred TypeScript data shapes (`SelectAccount`, `InsertAccount`).

## Excludes
- Specific OAuth callback server configurations (e.g. passport or axios calls).
- Main user profile table specifications.

## 👤 Accounts Schema Blueprint
The `accounts` table records individual third-party provider accounts linked to a single core user profile. It is defined in `packages/database/models/account.ts`.

### Columns & Specifications
- **`id`** (`uuid`): Primary key. Automatically generates a random UUID using `defaultRandom()`.
- **`userId`** (`uuid`, references `users(id)`, cascade delete): Links the OAuth identity to a primary user profile. If the user profile is deleted, all provider linkages are purged.
- **`provider`** (`varchar(50)`): The name of the third-party OAuth provider (e.g. "google", "github").
- **`providerAccountId`** (`varchar(255)`): Unique identity ID returned directly from the provider.
- **`createdAt`** (`timestamp`): Default is `now()`. Chronological creation marker.
- **`updatedAt`** (`timestamp`): Automatically updates to current timestamp on any row update.
<!-- chunk-end -->

## 🧩 TypeScript Contracts
Drizzle provides static types inferred from the schema to represent select and insert records:
- **`SelectAccount`**: Shape of a record returned by a query (`typeof accountsTable.$inferSelect`).
- **`InsertAccount`**: Shape of a record required for insertion (`typeof accountsTable.$inferInsert`).
<!-- chunk-end -->

## ⚠️ Accounts Table Guardrails
- **Provider Uniqueness**: A compound unique index `accounts_provider_provider_account_id_idx` ensures that a single provider account ID can only ever be mapped to a single user in our system.
- **Relational Integrity**: Deleting a user cascade deletes all related entries in this table automatically.
<!-- chunk-end -->
