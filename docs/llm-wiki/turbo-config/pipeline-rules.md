---
title: Pipeline Execution Rules
version: 1.0.0
scope: turbo-config
last_updated: 2026-05-22
owner: dev-platform-team
tags: [pipeline, task-graph, filters, execution]
chunk_id: turbo-pipeline-rules
---

# Pipeline Execution Rules

## Covers
- Dependencies execution graphs (`^build` vs `build`)
- Parallel vs sequential boundaries
- Filtering commands for targeted package builds

## Excludes
- Specific Zod endpoints or route contexts
- Drizzle table constraints

## 🕸️ Task Dependency Tree
Turborepo parses the relationships between workspace packages to build a topological execution graph.

### Pipeline Dependency Syntaxes
- **`^build` (Upstream Dependency)**: Instructs Turborepo that the current package cannot compile until all of its dependency packages have finished their compile steps.
- **`build` (Self Dependency)**: Controls the task dependencies inside the same package boundary.
<!-- chunk-end -->

## 🔍 Task Filtering Protocols
To save resources, do not execute builds across the entire repository. Run commands targeted directly at affected package boundaries.

### Filter Commands
- **Filter Single App**: Run `pnpm exec turbo build --filter=web` to compile the frontend application without touching unrelated packages.
- **Filter Package and Dependents**: Run `pnpm exec turbo build --filter=@repo/trpc...` to build `@repo/trpc` and any workspaces that depend on it.
- **Filter Affected in CI**: Under PR validation, run `pnpm exec turbo build --filter=[origin/main]` to build only packages containing code changes since the main branch reference.
<!-- chunk-end -->

## ⚠️ Pipeline Execution Constraints

### Invariants
- **No Circular Imports**: Ensure there are no mutual dependencies between package workspaces (e.g., package A depending on package B, and package B depending on package A). This breaks topological sorting and halts the build.
- **LLM Filtering Rule**:
  ⚠️ LLM NOTE: When proposing commands, always default to target filters (using `--filter`) instead of full global builds, unless a repository-wide compile is specifically requested by the developer.
<!-- chunk-end -->
