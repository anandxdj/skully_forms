import { initTRPC, TRPCError } from "@trpc/server";
import { OpenApiMeta } from "trpc-to-openapi";

import { createContext } from "./context";

const tRPCContext = initTRPC
  .meta<OpenApiMeta>()
  .context<typeof createContext>()
  .create({});

export const router = tRPCContext.router;

// Public — no auth required
export const publicProcedure = tRPCContext.procedure;

// Protected — requires user identity (x-user-id header now, JWT in Phase 4)
export const protectedProcedure = tRPCContext.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be authenticated to perform this action.",
    });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});
