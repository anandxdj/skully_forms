---
title: Database Contracts - Forms
version: 1.0.0
scope: database
last_updated: 2026-05-24
owner: dev-platform-team
tags: [db, schema, forms, contracts]
chunk_id: db-contracts-forms
---

# Database Contracts - Forms

## Covers
- Table schemas, constraints, and data definitions for the `forms` table in PostgreSQL.
- Slug generation protocols and ownership mappings.

## Excludes
- Client-side Next.js/Vite component design patterns.
- Submissions table schema (managed in submissions contract).

## 📊 Forms Table Structure

### Columns Definition
The `forms` table holds form configurations, themes, fields layout, and administrative flags.
- `id` (uuid, primary key): Defaults to `defaultRandom()`.
- `userId` (uuid, references `users(id)`, cascade delete): Tracks the user who owns this form.
- `slug` (varchar(12), unique, index): Unique nanoid slug used for public access.
- `title` (varchar(255)): Name of the form.
- `description` (text, nullable): Optional long-form subtitle.
- `published` (boolean): Controls public response collection. Defaults to `false`.
- `layoutMode` (varchar(50)): Render configuration restricted to `"SCROLL" | "SLIDE"`. Defaults to `SCROLL`.
- `theme` (varchar(50)): UI visual parameters. Defaults to `slate`.
- `fields` (jsonb): Schema holding the custom fields configuration. Typed compile-time as `DbFormField[]`. Defaults to `[]`.
- `submissionMode` (varchar(50)): Access control mode restricted to `"ANONYMOUS" | "AUTHENTICATED" | "BOTH"`. Defaults to `ANONYMOUS`.
- `webhookUrl` (text, nullable): Optional endpoint URL triggered on each successful submission.
- `expiresAt` (timestamp, nullable): Expiration timestamp for scheduled form closing.
- `createdAt` (timestamp): Tracking creation timestamp. Defaults to `defaultNow()`.
- `updatedAt` (timestamp): Track modified timestamp with automated update handler.
<!-- chunk-end -->

### Indexing & Unique Constraints
The table defines two active indexes to ensure query speed:
1. `forms_slug_unique_idx` (Unique Index): Single-column query speedup when searching public forms via slug.
2. `forms_user_created_idx` (Compound Index): Speeds up fetching of user-owned forms sorted by their creation date (`userId` + `createdAt`).
<!-- chunk-end -->

## 🛠️ Service Level Protocols

### Slug & Fields Protocols
Slugs are generated in the application service layer via `nanoid(10)` from `nanoid@3` for maximum ESM/CJS runtime compatibility. The unique constraint prevents collision.

The `fields` JSONB array is fully parsed and validated upon save and retrieval using Zod schemas (`formFieldsArraySchema` in `form-field-schemas.ts`).
<!-- chunk-end -->
