---
title: Caching Strategy & Validation
version: 1.0.0
scope: turbo-config
last_updated: 2026-05-22
owner: dev-platform-team
tags: [caching, cache-key, remote-cache, inputs]
chunk_id: turbo-caching-strategy
---

# Caching Strategy & Validation

## Covers
- Constructing cache signatures (inputs, globs, env dependencies)
- Local vs remote caching mechanisms
- Invalidation guidelines and forced cache skipping

## Excludes
- General browser or CDN caching
- Database query cache strategies

## 🔑 Cache Signature Composition
Turborepo determines task caching signatures using:
1. Glob outputs declared under `inputs` inside `turbo.json`.
2. File hashes of matched globs (e.g. `$TURBO_DEFAULT$`, `.env*`).
3. Local environment variables defined under the `env` keys.
4. Active `dependencies` and `devDependencies` listed inside `package.json`.
5. The checksum of the `turbo.json` file.
<!-- chunk-end -->

## 🛠️ Remote Cache Configuration
Our team utilizes remote caching to share build and compile states between developer environments and CI/CD pipelines.

### Setup Steps
- **Vercel Remote Caching**: Run `turbo login` to authenticate, followed by `turbo link` to link local workspace builds with the Vercel remote cache.
- **Cache Hits**: When running `pnpm build`, if the cache matches, Turborepo downloads compiled assets from the remote store instead of running a fresh build, reducing CI times.
<!-- chunk-end -->

## ⚠️ Caching Guardrails & Invalidation

### Guidelines
- **Volatile Outputs**: Never attempt to cache files that contain volatile or non-deterministic values (such as random seeds, compilation timestamps, or system paths).
- **Forced Rebuilds**: If you suspect a cache corruption or local environmental drift, run tasks with the `--force` option to bypass caches and force a fresh run.
- **LLM Caching Rules**:
  ⚠️ LLM NOTE: Do not suggest `--force` as a default command parameter in standard CI/CD configurations. It defeats the performance benefits of Turborepo caching.
<!-- chunk-end -->
