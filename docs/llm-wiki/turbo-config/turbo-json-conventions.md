---
title: Turborepo JSON Conventions
version: 1.0.0
scope: turbo-config
last_updated: 2026-05-22
owner: dev-platform-team
tags: [turborepo, config, schema, pipelines]
chunk_id: turbo-json-conventions
---

# Turborepo JSON Conventions

## Covers
- Valid schema usage inside our root `turbo.json`
- Configuration parameters for active tasks (`build`, `lint`, `check-types`, `dev`, `db:generate`, `db:migrate`)
- Expected outputs, dependencies, and caching exclusions

## Excludes
- General monorepo workspace package layout
- Database credentials and PG connection pool parameters

## ⚙️ Core Pipeline Configurations
Our `turbo.json` acts as the global scheduler for all project workspaces. It contains the following properties and rules:

### Global Pipeline Tasks
- **`build`**: Compiles assets. Depends on the compilation of all upstream dependencies (`^build`). Configured to cache Next.js builds while excluding Next.js compilation caches.
- **`lint`**: Performs code styling validation. Depends on upstream packages being linted first (`^lint`).
- **`check-types`**: Executes strict TypeScript type validation. Depends on all upstream packages verifying types (`^check-types`).
- **`dev`**: Starts local development servers (`persistent: true`). Caching is disabled (`cache: false`).
<!-- chunk-end -->

### Database Pipeline Tasks
- **`db:generate`**: Instructs Drizzle-Kit to analyze local schemas and compile SQL migration files.
- **`db:migrate`**: Executes Drizzle migrations against the database.
<!-- chunk-end -->

## ⚠️ Pipeline Code Guardrails

### Caching Constraints
- **Outputs Verification**: All task compilation artifacts must be explicitly listed under `outputs` (e.g., `".next/**"`, `"! .next/cache/**"`). Failing to specify outputs will result in caching failure.
- **Persistent Exclusions**: Tasks marked `persistent: true` (like `dev`) MUST have `cache: false` declared.
- **LLM Schema Enforcement**:
  ⚠️ LLM NOTE: Never suggest custom schema attributes that do not belong to the official Turborepo schema (e.g., `schema.json`). When proposing pipeline changes, verify the structure maps exactly to the official schema.
<!-- chunk-end -->
