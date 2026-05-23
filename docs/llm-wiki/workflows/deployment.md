---
title: Workflows - Production Deployment
version: 1.0.0
scope: workflows
last_updated: 2026-05-22
owner: dev-platform-team
tags: [build, deploy, production, bundling]
chunk_id: workflow-deployment
---

# Workflows - Production Deployment

## Covers
- Production build commands for the full monorepo
- Next.js static asset compilation and output directories
- Express backend bundling via tsup utility configuration
- Pre-deploy build verification workflows

## Excludes
- Local dev environments configuration steps
- Live infrastructure provision maps (Terraform/CloudFormation)
- Local sqlite or dev database seed setups

## Production Building Routines

### Monorepo Full Compilation
To compile the entire codebase for production, execute the global build command inside the project root directory:
```bash
pnpm build
```
This script leverages Turborepo to build all workspaces in topological dependency order. It ensures `@repo/trpc` and `@repo/database` packages compile before bundling the dependent `web` and `api` applications.
<!-- chunk-end -->

### Express API Bundling details
The backend package located in `apps/api` uses `tsup` to bundle all TypeScript endpoints into optimized, single-file JavaScript assets.
- Build Output: Placed in `apps/api/dist/`.
- Entrypoint: Run `node apps/api/dist/index.js` to spawn the production server.
- The pipeline utilizes target Node ES2022 features to reduce bundle footprint.
<!-- chunk-end -->

### Next.js Client Compilation details
The Next.js client app in `apps/web` compiles pages, assets, and styles into the `.next` production distribution package.
- Output Directory: Compiled code resides in `apps/web/.next/`.
- Cache Storage: The pipeline intentionally excludes `.next/cache` from the Turborepo output storage parameters in `turbo.json`.
- The compilation automatically optimizes imagery, CSS parameters, and performs code splitting for faster load times.
<!-- chunk-end -->
