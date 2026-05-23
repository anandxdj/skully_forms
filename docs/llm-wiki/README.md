---
title: LLM Wiki Registry & Entrypoint
version: 1.0.0
scope: entrypoint
last_updated: 2026-05-22
owner: dev-platform-team
tags: [index, sitemap, routing]
chunk_id: wiki-entrypoint-readme
---

# LLM Wiki Registry & Entrypoint

## Covers
- Entrypoint index of all documentation domains inside `/docs/llm-wiki/`
- Custom scopes and task-matching tags
- Verification procedures for incoming agents

## Excludes
- Specific table schemas or database columns
- Reusable UI styling definitions
- Fastify/Express server port configurations

## 🧭 Ingestion & Routing Matrix
You must match your current task scope to the tags below, and ONLY load the corresponding directory. Do not load all subfolders.

| Topic Keywords / Tags | Purpose | Directory to Read |
| :--- | :--- | :--- |
| `#architecture`, `#repo`, `#monorepo` | Turborepo workspaces, folder structures, global commands | `/docs/llm-wiki/architecture/` |
| `#turbo`, `#pipeline`, `#cache` | `turbo.json` configurations, caching strategies, pipelines | `/docs/llm-wiki/turbo-config/` |
| `#db`, `#drizzle`, `#postgres`, `#schema` | Database schema contracts, migrations, setup commands | `/docs/llm-wiki/database/` |
| `#api`, `#trpc`, `#routes`, `#endpoints` | Server router handlers, client queries, RPC validation | `/docs/llm-wiki/api-trpc/` |
| `#ui`, `#design`, `#css`, `#tailwind` | Tailwind CSS v4, styling parameters, layout rules | `/docs/llm-wiki/frontend-design/` |
| `#workflow`, `#dev`, `#ci-cd`, `#deploy` | Step-by-step dev workflows, linting checks, build routines | `/docs/llm-wiki/workflows/` |
| `#troubleshoot`, `#debug`, `#errors` | Cache misses, circular dependency resolution guidelines | `/docs/llm-wiki/troubleshooting/` |
| `#thoughts`, `#history`, `#logs` | Chronicled historical thoughts, trade-offs, milestones | `/docs/llm-wiki/thoughts/` |
<!-- chunk-end -->

## 🚦 Ingest Rules for AIs
- Parse the user's instructions and map them to tags in the routing matrix.
- Load *only* the specific subdirectory mapped to those tags.
- Refer to `docs/llm-wiki/ai-agent-guidelines.md` for strict tool execution boundaries.
<!-- chunk-end -->
