---
title: Database Contract - Form Analytics Cache Table
version: 1.0.0
scope: database
last_updated: 2026-05-24
owner: dev-platform-team
tags: [drizzle, schema, analytics, caching, performance, model]
chunk_id: db-contract-analytics-cache
---

# Database Contract - Form Analytics Cache Table

## Covers
- Drizzle schema columns for the `form_analytics_cache` table.
- Atomic unique constraints and database indexing for incremental counter updates.
- Inferred TypeScript data shapes (`SelectFormAnalyticsCache`, `InsertFormAnalyticsCache`).

## Excludes
- Local Node.js memory analytics parsing code.
- Relational mapping of forms or submissions configs.

## 📊 Analytics Cache Schema Blueprint
The `form_analytics_cache` table stores pre-aggregated counts of option choices to provide highly performant, $O(1)$ analytics retrieval. It is defined in `packages/database/models/analytics-cache.ts`.

### Columns & Specifications
- **`id`** (`uuid`): Primary key. Automatically generates a random UUID using `defaultRandom()`.
- **`formId`** (`uuid`, references `forms(id)`, cascade delete): Relates the cache counts to a primary form. Purged instantly if the form is deleted.
- **`fieldId`** (`varchar(50)`): The specific form field ID (e.g. `q1`).
- **`option`** (`varchar(255)`): The specific selected text value option (e.g. `Excellent`).
- **`count`** (`integer`): Running total count of submissions containing this option answer. Defaults to `0`.
- **`updatedAt`** (`timestamp`): Automatically updates to current timestamp on any row update.
<!-- chunk-end -->

## 🧩 TypeScript Contracts
Drizzle provides static types inferred from the schema to represent select and insert records:
- **`SelectFormAnalyticsCache`**: Shape of a record returned by a query (`typeof formAnalyticsCacheTable.$inferSelect`).
- **`InsertFormAnalyticsCache`**: Shape of a record required for insertion (`typeof formAnalyticsCacheTable.$inferInsert`).
<!-- chunk-end -->

## ⚠️ Analytics Cache Table Guardrails
- **Atomic UPSERT**: A compound unique index `form_analytics_cache_unique_idx` on `(formId, fieldId, option)` ensures that we can safely execute high-speed, thread-safe atomic upsert increments:
  ```sql
  INSERT INTO form_analytics_cache (form_id, field_id, option, count)
  VALUES ('form-uuid', 'field-id', 'option', 1)
  ON CONFLICT (form_id, field_id, option)
  DO UPDATE SET count = count + 1;
  ```
- **Cascade Cleanup**: Foreign key references cascade deletes, keeping the database extremely clean without any manual cache invalidation code.
<!-- chunk-end -->
