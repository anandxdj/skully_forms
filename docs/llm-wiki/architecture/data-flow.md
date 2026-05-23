---
title: System Data Flow Lifecycle
version: 1.0.0
scope: system-architecture
last_updated: 2026-05-22
owner: dev-platform-team
tags: [architecture, data-flow, trpc, request-lifecycle]
chunk_id: arch-data-flow
---

# System Data Flow Lifecycle

## Covers
- Lifecycle of client-initiated requests to backend services
- Inter-package communications (tRPC context, router resolution, Drizzle queries)
- Type safety propagation across layers

## Excludes
- Specific Drizzle database migrations commands
- Layout schemas inside apps/web/app

## 🔄 Client-to-Database Flow Lifecycle
The system provides end-to-end TypeScript safety. When a client performs a query, it flows through these four boundaries:

```
[apps/web (Next.js Client)] 
           │ (Type-safe RPC Call)
           ▼
[packages/trpc (Shared Router)] ──► Inputs verified with Zod schemas
           │ (Calls Service / Database Client)
           ▼
[packages/database (Drizzle ORM)] ──► Translates to pg-SQL query
           │ (Resolves Pool Query)
           ▼
[PostgreSQL Database (Dev/Prod)]
```
<!-- chunk-end -->

## 🧩 Boundary Step Details

### Next.js Client Layer
The client makes a request using `@repo/trpc/client` hooks (e.g. `api.health.getHealth.useQuery()`). Typescript checks that inputs match the validation schema.

### tRPC Router Layer
The request hits `apps/api` (the Fastify/Express server).
- **Context Creation**: `context.ts` creates the session context (user information, authorization headers).
- **Validation**: Zod parses the input parameters. If parsing fails, returns a `400 BAD REQUEST` error before execution.
- **Route Execution**: The matched router (e.g. `/packages/trpc/server/routes/health`) runs the business logic, query, or service.
<!-- chunk-end -->

### Database Persistence Layer
The router executes a Drizzle ORM statement (e.g., `db.select().from(usersTable)`). Drizzle compiles it to an optimized SQL string, executes it via the PostgreSQL connection client pool, maps results back to typed Javascript records, and returns them to the tRPC handler.
<!-- chunk-end -->
