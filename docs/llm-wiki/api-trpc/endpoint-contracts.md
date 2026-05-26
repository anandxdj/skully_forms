---
title: tRPC Endpoint Contracts
version: 2.0.0
scope: api-trpc
last_updated: 2026-05-23
owner: dev-platform-team
tags: [trpc, routing, endpoints, validation, forms, submissions]
chunk_id: trpc-endpoint-contracts
---

# tRPC Endpoint Contracts

## Covers
- All mapped endpoints across `healthRouter`, `authRouter`, `formsRouter`, `submissionsRouter`
- Input/output Zod schema references
- Auth requirements per procedure (`publicProcedure` vs `protectedProcedure`)

## Excludes
- General database configurations or credentials
- CSS layout or frontend component specifications

## 🔐 Authentication Model (Dev Phase)
During Phase 1, protected procedures read identity from the `x-user-id` HTTP header. In Phase 4, this is replaced with JWT cookie extraction in `context.ts` — no router changes needed.

- **`publicProcedure`**: No auth required.
- **`protectedProcedure`**: Requires `x-user-id` header (dev) / JWT cookie (Phase 4). Throws `UNAUTHORIZED` if missing.
<!-- chunk-end -->

## 🟢 Health Router Contracts
Defined in `packages/trpc/server/routes/health/route.ts`.

### `health.getHealth`
- **Type**: Query (public)
- **OpenAPI**: `GET /health`
- **Input**: none
- **Output**: `{ status: "healthy" }`
<!-- chunk-end -->

## 🔑 Authentication Router Contracts
Defined in `packages/trpc/server/routes/auth/route.ts`.

### `auth.getSupportedAuthenticationProviders`
- **Type**: Query (public)
- **OpenAPI**: `GET /authentication/supported-providers`
- **Input**: none
- **Output**: Array of `{ provider, displayName, displayText, authUrl }`
<!-- chunk-end -->

### `auth.signUp`
- **Type**: Mutation (public)
- **OpenAPI**: `POST /authentication/signup`
- **Input**: `{ email: string, password: string (min 6), fullName: string (min 2) }`
- **Output**: `{ id: uuid, email: string, fullName: string }`
- **Side effects**: Creates new user with hashed PBKDF2 credentials password
<!-- chunk-end -->

### `auth.signIn`
- **Type**: Mutation (public)
- **OpenAPI**: `POST /authentication/signin`
- **Input**: `{ email: string, password: string }`
- **Output**: `{ id: uuid, email: string, fullName: string }`
<!-- chunk-end -->

### `auth.me`
- **Type**: Query (protected)
- **OpenAPI**: `GET /authentication/me`
- **Input**: none
- **Output**: `{ id: uuid, email: string, fullName: string }`
- **Guards**: Resolves currently authenticated user based on active context
<!-- chunk-end -->

## 📄 Forms Router Contracts
Defined in `packages/trpc/server/routes/forms/route.ts`. All procedures use Zod schemas from `packages/trpc/server/schemas/form-schemas.ts` and `form-field-schemas.ts`.

### `forms.createForm`
- **Type**: Mutation (protected)
- **OpenAPI**: `POST /forms`
- **Input**: `{ title: string, description?: string }`
- **Output**: `FormOutput` (full form object with validated `fields` array)
- **Side effects**: Generates nanoid(10) slug, inserts into `formsTable`
<!-- chunk-end -->

### `forms.getUserForms`
- **Type**: Query (protected)
- **OpenAPI**: `GET /forms`
- **Input**: none
- **Output**: `FormListItemOutput[]` (each item includes `submissionCount`)
<!-- chunk-end -->

### `forms.getForm`
- **Type**: Query (protected)
- **OpenAPI**: `GET /forms/{formId}`
- **Input**: `{ formId: uuid }`
- **Output**: `FormOutput`
- **Guards**: Ownership check — throws `NOT_FOUND` if formId doesn't belong to user
<!-- chunk-end -->

### `forms.updateForm`
- **Type**: Mutation (protected)
- **OpenAPI**: `PATCH /forms/{formId}`
- **Input**: `{ formId: uuid, title?, description?, published?, layoutMode?, theme?, fields? }`
- **Output**: `FormOutput`
- **Guards**: Ownership check. If `fields` is provided, it is validated through the full Zod discriminated union before DB write.
<!-- chunk-end -->

### `forms.deleteForm`
- **Type**: Mutation (protected)
- **OpenAPI**: `DELETE /forms/{formId}`
- **Input**: `{ formId: uuid }`
- **Output**: `{ success: true }`
- **Guards**: Ownership check. CASCADE deletes all submissions permanently.
<!-- chunk-end -->

### `forms.getPublicForm`
- **Type**: Query (public)
- **OpenAPI**: `GET /public/forms/{slug}`
- **Input**: `{ slug: string }`
- **Output**: `FormOutput`
- **Guards**: Only returns forms where `published = true`. Throws `NOT_FOUND` otherwise.
<!-- chunk-end -->

## 📨 Submissions Router Contracts
Defined in `packages/trpc/server/routes/submissions/route.ts`. Fully implemented and integrated.

### `submissions.submitForm`
- **Type**: Mutation (public)
- **OpenAPI**: `POST /public/forms/{slug}/submit`
- **Input**: `{ slug: string, data: Record<string, FieldAnswer> }`
- **Output**: `SubmissionOutput`
- **Guards**: Form must exist and be published. Fires `onSubmissionCreated` domain event hook.
<!-- chunk-end -->

### `submissions.getSubmissions`
- **Type**: Query (protected)
- **OpenAPI**: `GET /forms/{formId}/submissions`
- **Input**: `{ formId: uuid }`
- **Output**: `SubmissionOutput[]`
- **Guards**: Ownership check.
<!-- chunk-end -->

### `submissions.getFormAnalytics`
- **Type**: Query (protected)
- **OpenAPI**: `GET /forms/{formId}/analytics`
- **Input**: `{ formId: uuid }`
- **Output**: `AnalyticsOutput` — `{ formId, totalSubmissions, distributions[] }`
- **Guards**: Ownership check. Distributions only computed for `SELECT`, `RADIO`, `CHECKBOX` fields.
<!-- chunk-end -->

## ⚠️ API Route Guardrails

### Guidelines
- **Never skip `.output()`**: All procedures must declare an output schema — OpenAPI generation requires it.
- **Never write raw JSONB**: Always parse `fields` through `formFieldsArraySchema.parse()` before returning. Always validate `data` through `fieldAnswerSchema` before accepting submissions.
- **Ownership first**: Any operation on a form by its ID must call `assertOwnership()` in `FormService`. Never bypass this.
- **Zero `as any`**: Use `z.infer<>` for all types. Use Drizzle's `$inferSelect`/`$inferInsert` for DB row types.
- **No `console.log`**: Use `@repo/logger` for all runtime logging.
<!-- chunk-end -->
