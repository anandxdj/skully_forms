---
title: Database Connection Setup
version: 1.0.0
scope: database
last_updated: 2026-05-22
owner: database-team
tags: [drizzle, connection, postgres, client]
chunk_id: db-connection-setup
---

# Database Connection Setup

## Covers
- Connection setup of the database client using `node-postgres` and Drizzle ORM
- Connection pool rules and exports
- Environment validations in `@repo/database`

## Excludes
- Specific table schemas or data schemas
- Drizzle-Kit migrations commands

## 🔌 Connection Client Configuration
Our database layer is isolated inside the `@repo/database` package. It uses the `node-postgres` driver combined with Drizzle ORM to execute type-safe queries.

### Client Initialization
The client is instantiated in `packages/database/index.ts`:
```typescript
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "./env";

export const db = drizzle(env.DATABASE_URL);
export * from "drizzle-orm";
export default db;
```
- **Connection URL**: Dynamically loaded from the process environment via `env.DATABASE_URL`.
- **Global Export**: The database client is exported globally as `db` for consumption by the shared tRPC packages.
<!-- chunk-end -->

## ⚠️ Database Connection Guardrails

### Guidelines
- **Pool Management**: node-postgres operates a connection pool under the hood. Avoid instantiating the `db` client multiple times across threads, as this will exhaust the pool limits on the PostgreSQL server.
- **Connection Checks**: Under development conditions, verify connection states by starting the local PostgreSQL service in Docker.
- **LLM Caching Rules**:
  ⚠️ LLM NOTE: Always import `db` from `@repo/database` instead of re-instantiating the Drizzle client locally in server files. This prevents connection leaks.
<!-- chunk-end -->
