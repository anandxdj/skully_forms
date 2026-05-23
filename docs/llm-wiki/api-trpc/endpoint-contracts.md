---
title: tRPC Endpoint Contracts
version: 1.0.0
scope: api-trpc
last_updated: 2026-05-22
owner: api-team
tags: [trpc, routing, endpoints, validation]
chunk_id: trpc-endpoint-contracts
---

# tRPC Endpoint Contracts

## Covers
- Mapped endpoints inside `healthRouter` and `authRouter`
- Expected query and mutation parameter types
- Input and output validation specifications using Zod

## Excludes
- General database configurations or credentials
- CSS layout specifications

## 🟢 Health Router Contracts
The `health` domain provides basic server state validation. Defined in `packages/trpc/server/routes/health/route.ts`.

### Mapped Route: `health.getHealth`
- **Type**: Query Procedure
- **OpenAPI Endpoint**: `GET /health`
- **Input Schema**: `zodUndefinedModel` (Requires no input params)
- **Output Schema**:
```typescript
z.object({
  status: z.literal("healthy").describe("status of the server"),
})
```
- **Returns**: `{ status: "healthy" }`
<!-- chunk-end -->

## 🔑 Authentication Router Contracts
The `auth` domain provides auth methods list. Defined in `packages/trpc/server/routes/auth/route.ts`.

### Mapped Route: `auth.getSupportedAuthenticationProviders`
- **Type**: Query Procedure
- **OpenAPI Endpoint**: `GET /authentication/supported-providers`
- **Input Schema**: `zodUndefinedModel` (Requires no input params)
- **Output Schema**: Array of supported authentication methods (Google OAuth).
- **Returns**: Static array of active OAuth provider objects from `userService`.
<!-- chunk-end -->

## ⚠️ API Route Guardrails

### Guidelines
- **Strict Validations**: All inputs must declare Zod constraints. Queries matching string constraints must check parameters (such as minimum character length or format rules like `.email()`) before passing values to internal database procedures.
- **LLM API Invariants**:
  ⚠️ LLM NOTE: Do not change the input/output schemas of `getHealth` or `getSupportedAuthenticationProviders` as they are consumed by Next.js components. When drafting new API endpoints, always define Zod input validations and enforce output schemas using `.output()`.
<!-- chunk-end -->
