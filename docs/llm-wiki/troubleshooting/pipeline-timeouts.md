---
title: Troubleshooting - Pipeline Timeouts
version: 1.0.0
scope: troubleshooting
last_updated: 2026-05-22
owner: dev-platform-team
tags: [pipeline, timeouts, hanging-tasks, debugging]
chunk_id: troubleshoot-pipeline-timeouts
---

# Troubleshooting - Pipeline Timeouts

## Covers
- Diagnosing hanging tasks inside Turborepo execution workflows
- Investigating unclosed database connection pools in migration scripts
- Configuring dev task parameters to avoid process locks

## Excludes
- Barrel file imports refactoring guidelines
- Prettier styling conventions
- Express middleware routers creation

## Mitigating Hanging Pipelines

### Non-Interactive Task Locks
Running a long-running, interactive, or persistent task (such as a development server `next dev` or Express API listener) during compile-time or testing pipelines without marking it correctly will stall execution.
- **Rule**: In `turbo.json`, any task that spawns a server must be explicitly marked with:
  ```json
  "persistent": true,
  "cache": false
  ```
- Do not run persistent tasks as dependencies of build or validation steps.
<!-- chunk-end -->

### Hanging Connections in Scripts
Database migrations or seeds that fail to call `process.exit()` or do not shut down connection pools will hold Node.js event loops open.
- When utilizing Drizzle and `node-postgres`, always ensure that pg pool close functions are fired when tasks conclude.
- **Example pattern**:
  ```typescript
  const client = new pg.Pool({ ... });
  const db = drizzle(client);
  
  // Run operation
  await applyMigrations(db);
  
  // Ensure the pool is closed!
  await client.end();
  ```
<!-- chunk-end -->
