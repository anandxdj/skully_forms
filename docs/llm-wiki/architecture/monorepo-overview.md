---
title: Monorepo Overview
version: 1.0.0
scope: system-architecture
last_updated: 2026-05-22
owner: dev-platform-team
tags: [architecture, turborepo, monorepo, workspaces]
chunk_id: arch-monorepo-overview
---

# Monorepo Overview

## Covers
- Overall structure of the Turborepo workspace
- Boundaries between applications (`apps/`) and shared packages (`packages/`)
- Responsibility and coding conventions for each module

## Excludes
- Specific Drizzle database table definitions
- Specific tRPC route endpoints
- Tailwind CSS v4 styling rules

## 📂 Codebase Directory Layout
This repository is configured as a Turborepo monorepo managed by `pnpm`. The project is strictly divided into deployed applications (`apps/`) and reusable library modules (`packages/`).

### App Workspace Details
- **`apps/web`**: Next.js 16.1 App Router front-end application utilizing Tailwind CSS v4. Consumes shared `@repo/trpc` client hooks.
- **`apps/api`**: Back-end Node.js application (Express/Fastify compiled via `tsup`) hosting the core tRPC router and context.
<!-- chunk-end -->

### Package Workspace Details
- **`packages/database`**: Persistent database layer powered by Drizzle ORM and PostgreSQL connection clients. Contains schemas and migrations.
- **`packages/trpc`**: The shared type definitions and communication contracts between the client and backend.
- **`packages/services`**: Shared backend services such as OAuth integration, external clients, and business logic.
- **`packages/logger`**: Unified pino-based server logging.
- **`packages/eslint-config`**: Standardized code formatting lint rules.
- **`packages/typescript-config`**: Shared tsconfig definitions.
<!-- chunk-end -->

## ⚠️ Architectural Invariants
When modifying code or creating new files, you must respect these structural boundaries:

### Structural Rules
- **Package Dependency Flow**: Packages must NEVER depend on applications. Applications (`apps/`) depend on packages (`packages/`).
- **Shared Code Promotion**: If a module or utility is used in both `apps/web` and `apps/api`, it must be promoted to a shared package in `packages/` (e.g. in `packages/services`).
- **No Direct DB Access**: The front-end Next.js application should query persistent data strictly via the `@repo/trpc` router. Direct database imports from `@repo/database` inside client components are prohibited.
<!-- chunk-end -->
