---
title: Thoughts - Phase 1 Backend Build (Skully Forms)
version: 1.0.0
scope: thoughts
last_updated: 2026-05-23
owner: dev-platform-team
tags: [antigravity, thought-log, phase1, backend, forms, submissions, trpc]
chunk_id: thought-phase1-backend
---

# Thoughts - Phase 1 Backend Build (Skully Forms)

## Covers
- Scope and decisions made during Phase 1 core backend implementation
- Architecture trade-offs for database models, service layer, and tRPC routing
- Blockers resolved and design patterns enforced
- Exact handover state for the next agent session

## Excludes
- Frontend page implementations (Phase 2)
- Authentication layer (Phase 4)

## A. Context and Scope

### What Was Built
On 2026-05-23, the Antigravity agent executed Phase 1 of the Skully Forms backend: a full-stack dynamic form builder platform built on the existing Turborepo monorepo.

The following was **completed** in this session:
1. **Database models**: `formsTable` + `submissionsTable` with JSONB field definitions, FK CASCADE deletes, nanoid slugs, and 3 proactive indexes. Migration `0001_wooden_gabe_jones.sql` applied successfully.
2. **Zod schemas**: Discriminated union for 10 field types in `form-field-schemas.ts`. Form CRUD and submission I/O schemas in `form-schemas.ts` and `submission-schemas.ts`.
3. **FormService**: Full business logic class at `packages/services/form/index.ts` covering all CRUD, public access, submission handling, and option-distribution analytics. Includes domain event hook (`onSubmissionCreated`) as a no-op ready for Socket.IO in Phase 3.
4. **tRPC layer (partial)**: `context.ts` (x-user-id dev header), `trpc.ts` (protectedProcedure), `api-response.ts` (standardized wrappers), `services/index.ts` (formService added), `routes/forms/route.ts` (6 endpoints fully mapped to OpenAPI).

The following was **not yet completed** and must be done next:
- `routes/submissions/route.ts` (3 endpoints)
- `server/index.ts` registration of new routers
- `apps/api/src/server.ts` enhancements (body limits, logging, file upload, static serving)
- Type-check and build verification
<!-- chunk-end -->

## B. Design Rationale & Trade-offs

### No circular dependencies between packages
`@repo/services` must not import from `@repo/trpc`. The `FormService` defines its own local input interfaces rather than importing Zod types from the schemas package. The tRPC router layer then validates inputs through the Zod schemas and maps them onto the service's interface types. This clean boundary means services remain testable in isolation.

### x-user-id header as dev identity
Authentication is explicitly deferred to Phase 4. The `createContext()` function reads only the `x-user-id` header for now. When Phase 4 arrives, **only this function body changes** — all 9 service methods, all 6 router procedures, and all ownership checks continue to work identically. This was a deliberate design to avoid blocking feature development on auth scaffolding.

### Hard CASCADE deletes (not soft delete)
The user explicitly chose hard delete with CASCADE. The `formsTable` FK on `submissionsTable` is `ON DELETE CASCADE`. Deleting a form permanently removes all its submissions. No `deletedAt` column, no trash/restore. This is intentional and must not be changed without explicit user approval.

### JSONB field validation on write only
The Zod discriminated union (`formFieldsArraySchema`) is validated whenever `fields` is written (via `updateForm`). It is also re-parsed on every read in the tRPC router layer to guarantee the output type. This ensures both write integrity and type-safe client responses.

### nanoid(10) slugs in service layer
Slug generation is NOT a database default. It happens in `FormService.createForm()` using `nanoid(10)` from the `nanoid@3` package (CJS-compatible). The DB enforces uniqueness via a unique index. The 10-character nanoid gives ~1 billion unique values at negligible collision probability.
<!-- chunk-end -->

## C. Blockers & Workarounds

### Circular dependency risk
Initially considered importing Zod types from `@repo/trpc` inside `@repo/services`, which would create a circular dependency (`@repo/trpc` depends on `@repo/services`, `@repo/services` would then depend on `@repo/trpc`). Resolved by keeping service input types as plain TypeScript interfaces local to the service file.

### nanoid ESM/CJS compatibility
`nanoid` v4+ is ESM-only. Since this monorepo uses `tsx` for execution and has mixed module settings, `nanoid@3` was installed specifically for CJS compatibility.

### PowerShell `&&` operator not supported
On Windows PowerShell, chaining commands with `&&` fails. Commands must be run separately or with `;` as separator.
<!-- chunk-end -->

## D. Active State & Handover

### Immediately required (next session)
The next agent must complete the following in order:

1. **Create `packages/trpc/server/routes/submissions/route.ts`**:
   - `submitForm` (public, POST `/public/forms/{slug}/submit`) — calls `formService.submitResponse()`
   - `getSubmissions` (protected, GET `/forms/{formId}/submissions`) — calls `formService.getSubmissions()`
   - `getFormAnalytics` (protected, GET `/forms/{formId}/analytics`) — calls `formService.getAnalytics()`

2. **Update `packages/trpc/server/index.ts`**:
   - Import and register `formsRouter` and `submissionsRouter` into `serverRouter`

3. **Update `apps/api/src/server.ts`**:
   - Add `cookie-parser` middleware
   - Set `express.json({ limit: '1mb' })` and `express.urlencoded({ limit: '1mb' })`
   - Add pino request logging middleware
   - Serve `./public/uploads` statically at `/uploads`
   - Add `POST /api/upload` with multer (UUID-prefixed filenames, 10MB image limit, 50MB video limit)
   - Update OpenAPI title from "Streamyst OpenAPI" to "Skully Forms API"

4. **Run verification**:
   ```sh
   pnpm run check-types
   pnpm run build
   ```

### Known pending issues
- The `formService.updateForm()` uses `Partial<typeof formsTable.$inferInsert>` for the update payload. If Drizzle type inference changes, this typing should be reviewed.
- `getAnalytics()` performs in-memory aggregation over all submissions. For large submission volumes (>10k), this should be replaced with a SQL GROUP BY aggregation query in Phase 3.
<!-- chunk-end -->
