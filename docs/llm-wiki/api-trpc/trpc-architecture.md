---
title: tRPC API Architecture
version: 1.0.0
scope: api-trpc
last_updated: 2026-05-22
owner: api-team
tags: [trpc, context, procedures, router]
chunk_id: trpc-api-architecture
---

# tRPC API Architecture

## Covers
- Mounting tRPC on the server side using the `@trpc/server` init method
- Context creation and type inference inside `packages/trpc/server/context.ts`
- Shared type interfaces exported upward to Next.js clients

## Excludes
- Specific frontend page layouts
- Individual table column specifications

## 🛠️ Router & Context Setup
Our API is powered by tRPC, which bridges client applications and backend services with complete type safety.

### Server Initialization
tRPC is instantiated inside `packages/trpc/server/trpc.ts`:
```typescript
import { initTRPC, TRPCError } from "@trpc/server";
import { OpenApiMeta } from "trpc-to-openapi";
import { createContext } from "./context";

export const tRPCContext = initTRPC
  .meta<OpenApiMeta>()
  .context<typeof createContext>()
  .create({});

export const router = tRPCContext.router;
export const publicProcedure = tRPCContext.procedure;
```
- **Context Constructor**: Context is built in `context.ts` to attach OAuth tokens, request headers, and active session properties.
- **OpenAPI Meta**: Allows tRPC routers to be compiled automatically into OpenAPI JSON endpoints for REST client compliance.
- **Global Router Entry**: The entrypoint is defined in `packages/trpc/server/index.ts` export:
```typescript
export const serverRouter = router({
  health: healthRouter,
  auth: authRouter,
});
export type ServerRouter = typeof serverRouter;
```
<!-- chunk-end -->

## ⚠️ tRPC Architecture Guardrails

### Guidelines
- **Context Injection**: All request context properties (like authenticated sessions) must be added via `createContext` rather than fetched ad-hoc inside query hooks.
- **Public vs Protected Procedures**: Check user authorization boundaries carefully. Do not export state-changing mutations under `publicProcedure` without verification mechanisms.
- **LLM Context Rules**:
  ⚠️ LLM NOTE: Never construct a query endpoint without specifying Zod inputs. For endpoints that require no input parameters, use the shared helper model `zodUndefinedModel`.
<!-- chunk-end -->
