---
title: Workflows - CI/CD Pipeline
version: 1.0.0
scope: workflows
last_updated: 2026-05-22
owner: dev-platform-team
tags: [ci-cd, lint, formatting, typescript]
chunk_id: workflow-ci-cd
---

# Workflows - CI/CD Pipeline

## Covers
- TypeScript static check pipeline scripts
- Code formatting constraints using Prettier
- Linter checks and rules across workspaces
- Continuous integration sanity validation checklists

## Excludes
- Local dev server configuration steps
- Secrets storage vault configuration (e.g. AWS Secrets Manager)
- Database schema generation migrations

## Static Check Routines

### TypeScript Compilation Checks
To ensure absolute type safety across both frontend and backend domains before any commit or PR is merged, run the global type check suite:
```bash
pnpm check-types
```
This script executes Turborepo pipeline tasks, launching `tsc --noEmit` across all project modules. It compiles Next.js pages, express server endpoints, database ORM contracts, and shared tRPC packages.
<!-- chunk-end -->

### Monorepo Linting Constraints
Lint rules are enforced universally via ESLint configurations. Verify that all components and packages comply with local linter parameters before pushing:
```bash
pnpm lint
```
This task triggers linter engines across all app directories. It prevents the merge of files containing unused variables, unresolved imports, or broken types.
<!-- chunk-end -->

### Prettier Code Format Verification
We use Prettier to preserve style consistency across TS, TSX, JS, JSON, and Markdown files. Use the format script to automatically correct layout discrepancies:
```bash
pnpm format
```
This command runs prettier over all target files, correcting indentation, semicolons, and quotes according to the `prettier.config.js` settings in the root directory.
<!-- chunk-end -->
