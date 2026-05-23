---
title: Database Migration Rules
version: 1.0.0
scope: database
last_updated: 2026-05-22
owner: database-team
tags: [drizzle-kit, migrations, push, schema]
chunk_id: db-migration-rules
---

# Database Migration Rules

## Covers
- Lifecycle of database schema updates using Drizzle-Kit
- Command scopes for compiling migrations and pushing schemas
- Seeding procedures and local validation

## Excludes
- Specific table column shapes (see `database/contracts/`)
- Connection pool sizing configurations

## ⚙️ Schema Update Commands
Drizzle-Kit manages all persistent database migrations. Execute tasks inside the `@repo/database` package or via Turborepo.

### Drizzle-Kit Workflows
- **Generate Migrations**: Compiles local TS model changes into SQL scripts.
  ```bash
  pnpm --filter=@repo/database db:generate
  ```
  Generates migration files under `packages/database/drizzle/`.
- **Apply Migrations**: Runs compiled SQL migration files against the target database.
  ```bash
  pnpm --filter=@repo/database db:migrate
  ```
- **Local Dev Push**: In local development environment conditions, pushes schema changes directly without generating SQL files:
  ```bash
  pnpm exec drizzle-kit push
  ```
<!-- chunk-end -->

## ⚠️ Schema Migration Guardrails

### Execution Guidelines
- **Git Safety**: Always review generated SQL migration files inside the `packages/database/drizzle/` directory before committing them to source control.
- **Breaking Schema Pushes**: Pushing schema changes that alter column types or add required constraints without default values will prompt warnings or fail if existing database records contain incompatible data.
- **LLM Migration Invariants**:
  ⚠️ LLM NOTE: Do not suggest dropping database tables or columns unless explicitly requested by the developer. Direct the user to execute `drizzle-kit push` for quick dev cycles and `db:generate` + `db:migrate` for staging and production pipelines.
<!-- chunk-end -->
