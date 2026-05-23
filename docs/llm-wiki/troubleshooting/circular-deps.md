---
title: Troubleshooting - Circular Dependencies
version: 1.0.0
scope: troubleshooting
last_updated: 2026-05-22
owner: dev-platform-team
tags: [typescript, imports, bundling, compilation]
chunk_id: troubleshoot-circular-deps
---

# Troubleshooting - Circular Dependencies

## Covers
- Identifying circular dependencies in TypeScript packages
- Fixing circular imports inside package barrel files
- Reorganizing inter-package dependency flows

## Excludes
- Cache validation configurations
- Docker compose PostgreSQL setup configurations
- Scalar OpenAPI interface customizations

## Resolving Circular Imports

### The Barrel File Danger (Index.ts)
A common pitfall is importing a sibling module via the local barrel `index.ts` inside a package.
- **Example**: `packages/trpc/server/routes/auth/route.ts` importing from `packages/trpc/server/index.ts` instead of directly importing from parent configurations like `packages/trpc/server/trpc.ts`.
- **Solution**: Always import sibling modules directly from their source paths rather than intermediate entrypoints.
```typescript
// ❌ Avoid importing from index files
import { publicProcedure } from "../../";

//  Correct direct import
import { publicProcedure } from "../../trpc";
```
<!-- chunk-end -->

### Inter-Package Circular Relationships
When workspaces depend on each other cyclically (e.g. `@repo/trpc` depending on `@repo/services` which in turn tries to import context or router definitions from `@repo/trpc`), the compilation crashes.
- **Detection**: Run dependency visualizers or examine build order failures.
- **Resolution**:
  1. Extract the shared interface or type definition into a separate leaf package (such as `@repo/types` or a common package like `@repo/logger`).
  2. Ensure the dependency graph flows in one strict direction (e.g., UI -> API -> Services -> DB).
<!-- chunk-end -->
