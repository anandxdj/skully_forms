---
title: Thoughts - Module A Response Validation & Deduplication (Skully Forms)
version: 1.0.0
scope: thoughts
last_updated: 2026-05-24
owner: dev-platform-team
tags: [antigravity, thought-log, module-a, backend, validation, deduplication, postgres, drizzle]
chunk_id: thought-module-a-validation-deduplication
---

# Thoughts - Module A Response Validation & Deduplication (Skully Forms)

## Covers
- Implementation details of the 11-Layer response validation and deduplication pipeline in `FormService`.
- Database partial unique index schema modifications in PostgreSQL.
- Handover instructions for Module B (Next.js layout shell and developer mock login).

## Excludes
- JWT credentials token generation and authentication protocols (Phase 4).
- WebSocket event subscription logic (Phase 3).

---

## 🚀 A. Context & Implementation Summary

### What Was Built
On 2026-05-24, we successfully implemented **Module A (11-Layer Validation & IP Deduplication)** inside the Skully Forms monorepo:
1.  **Partial Unique Indexes**: We updated the `submissionsTable` schema in `packages/database/models/form.ts` to add partial unique indexes on `(form_id, respondent_id)` and `(form_id, device_fingerprint)` ensuring database-level duplicate prevention for both signed-in and anonymous respondents.
2.  **11-Layer Validation Pipeline**: We refactored `FormService.submitResponse` in `packages/services/form/index.ts` to implement strict checks: form status checks, expiration gates, submission access gates, duplicate voter checks (authenticated and anonymous device hashes), missing required fields validations, and field type option membership checks (RADIO, SELECT, CHECKBOX, FILE, and RATING).
3.  **Conflict Catching**: We wrapped the transaction insertion in a db-level conflict block mapping Postgres unique violations (`23505`) to clean, human-readable `CONFLICT` tRPC errors.
4.  **Verification**: Successfully ran `pnpm db:generate` and `pnpm db:migrate` on the live Docker Postgres instance, followed by a complete monorepo build verification (`pnpm check-types` and `pnpm build`) with zero compile or linting errors.
<!-- chunk-end -->

---

## 🧠 B. Design Rationale & Trade-offs

### Partial Unique Indexes over Full Constraints
To prevent duplicate anonymous submissions, we used a partial unique index filtered with `WHERE device_fingerprint IS NOT NULL` instead of a full unique index. In standard SQL, a unique index on nullable columns will allow multiple null values, which is desirable (e.g., when signed-in users don't submit fingerprints), but standard composite unique indexes fail when one of the keys is null. Postgres partial index filters explicitly guarantee that uniqueness is strictly enforced only on rows containing fingerprints, keeping data clean.
<!-- chunk-end -->

### 11-Layer Server-Side Schema Inspection
Rather than relying on client-side React Hook Form states alone, we built complete field schema matching on the server. If a malicious client tries to bypass validations by making direct HTTP calls to mutate choices or options that are not in the predefined `options` JSONB list, the server immediately isolates the injection. This addresses a major criticism raised in previous hackathon reviews where systems accepted fake option injections.
<!-- chunk-end -->

---

## 🚦 C. Active State & Handover

### Direct Next Steps for Module B (Frontend Shell)
With the backend data layer and validation pipelines fully completed and verified on the Postgres database, the project is ready for **Module B (Frontend Shell Setup)**:
1.  **Tailwind CSS v4 Configuration**: Inspect `apps/web/app/globals.css` and verify OKLCH color variables map correctly for dark and light layouts.
2.  **Visual Landing Page & Layout**: Set up the Outfitters font and Framer Motion animation containers for the landing page.
3.  **Developer User Selector Dropdown**: Implement the local storage mock login widget in the navbar so the client tRPC links automatically forward the active dev UUID inside the `x-user-id` header context.
<!-- chunk-end -->
