---
title: AI Agent Operational Guidelines
version: 1.0.0
scope: entrypoint
last_updated: 2026-05-22
owner: dev-platform-team
tags: [rules, agent, prompt, guidelines]
chunk_id: ai-agent-guidelines
---

# AI Agent Operational Guidelines

## Covers
- Authoritative execution protocols for visiting AI agents (Antigravity, Claude, Copilot)
- Context ingestion constraints and lazy-loading boundaries
- Mandatory thought ledger logs and database/API synchronization workflows

## Excludes
- General repository setup commands
- Third-party IDE settings files

## 🚦 Strict Context Boundaries & Lazy-Loading
To keep performance high and prevent context window pollution, you must adhere strictly to these routing steps:

### Protocol Steps
1. **Sitemap Registry Lookup**: On initial startup, you are allowed to read *only* `/docs/llm-wiki/README.md` or this guidelines file.
2. **Intent Matching**: Map the user's coding assignment to active tags (e.g. `#db`, `#trpc`, `#ui`).
3. **Isolate Ingestion**: View files *only* in the mapped target folder under `/docs/llm-wiki/`. Opening unrelated folders is a direct boundary violation.
4. **No Full sweeps**: Never run recursive folder reads or global search-grepping across `/docs/llm-wiki/`. Read files one-by-one, on-demand.
<!-- chunk-end -->

## 🧱 Formatting Standards for Updates
When editing or creating new files under `/docs/llm-wiki/`, you must comply with these strict RAG and chunk-optimization parameters:

### Rules
- **Mandatory YAML Frontmatter**: Include `title`, `version`, `scope`, `last_updated`, `owner`, `tags`, and `chunk_id`.
- **Covers & Excludes**: Every single markdown file must start with a `## Covers` and `## Excludes` block.
- **Strict Depth Hierarchy**: Maintain clean single `# Title` → `## Section` → `### Subsection` layout. Never skip a header level.
- **500-Token Chunk Limits**: Every `###` subsection must be kept under 500 tokens.
- **Chunk End Markers**: Append `<!-- chunk-end -->` at the end of every `###` subsection.
<!-- chunk-end -->

## ✍️ Mandatory Handover and Sync Workflows
Before declaring success or closing your session:

### Rules
1. **Database Sync**: If you changed any schema in `packages/database/models/`, you must update or create the corresponding single-table guide under `/docs/llm-wiki/database/contracts/`.
2. **API Sync**: If you updated any tRPC endpoints in `packages/trpc/server/routes/`, you must sync the endpoint signatures inside `/docs/llm-wiki/api-trpc/endpoint-contracts.md`.
3. **Thought Journal**: Create a new chronological ledger under `/docs/llm-wiki/thoughts/` named `/thoughts/YYYY-MM-DD-[agent]-[topic].md`. Document what was built, your design choices, trade-offs, solved blockers, and active next steps.
<!-- chunk-end -->
