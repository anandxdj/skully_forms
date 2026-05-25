---
title: Database Contract - Assets Table
version: 1.0.0
scope: database
last_updated: 2026-05-24
owner: dev-platform-team
tags: [drizzle, schema, assets, files, model]
chunk_id: db-contract-assets
---

# Database Contract - Assets Table

## Covers
- Drizzle schema columns for the `assets` table.
- Indexing and constraints for cataloging uploaded image and video assets.
- Inferred TypeScript data shapes (`SelectAsset`, `InsertAsset`).

## Excludes
- Local folder path structure of static uploads on Express.
- Multipart form-data parser middleware configuration details.

## 👤 Assets Schema Blueprint
The `assets` table catalogs and tracks all file uploads to manage media storage, link uploads to specific forms/submissions, and avoid orphaned uploads. It is defined in `packages/database/models/asset.ts`.

### Columns & Specifications
- **`id`** (`uuid`): Primary key. Automatically generates a random UUID using `defaultRandom()`.
- **`userId`** (`uuid`, references `users(id)`, set null): Optional creator who uploaded the asset. Nullable to support anonymous respondent uploads.
- **`formId`** (`uuid`, references `forms(id)`, cascade delete): Optional form configuration linked to the asset. Cascade deletes the asset if the form is removed.
- **`submissionId`** (`uuid`, references `submissions(id)`, cascade delete): Optional submission response linked to the asset. Cascade deletes the asset if the submission is removed.
- **`filename`** (`varchar(255)`): UUID-prefixed filename in disk storage (e.g. `${uuid}-${originalname}`).
- **`originalName`** (`varchar(255)`): Sanitized original file name.
- **`url`** (`text`): Direct browser web URL to access the served static asset.
- **`mimeType`** (`varchar(100)`): Document mime type (e.g. `image/png`, `video/mp4`).
- **`fileSize`** (`bigint`): Upload size in bytes, mapped using Drizzle's `mode: "number"` to seamlessly support files larger than 2GB without integer overflow.
- **`createdAt`** (`timestamp`): Default is `now()`. Chronological creation marker.
<!-- chunk-end -->

## 🧩 TypeScript Contracts
Drizzle provides static types inferred from the schema to represent select and insert records:
- **`SelectAsset`**: Shape of a record returned by a query (`typeof assetsTable.$inferSelect`).
- **`InsertAsset`**: Shape of a record required for insertion (`typeof assetsTable.$inferInsert`).
<!-- chunk-end -->

## ⚠️ Assets Table Guardrails
- **Cascades**: Deleting a form or submission immediately triggers database cascading deletions of the catalog record.
- **Respondent Safety**: Setting `userId` references to `SET NULL` on delete ensures that even if a user account is deleted, file submissions are retained until their respective form/submission is explicitly destroyed.
<!-- chunk-end -->
