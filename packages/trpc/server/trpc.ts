import { initTRPC, TRPCError } from "@trpc/server";
import { OpenApiMeta } from "trpc-to-openapi";

import { createContext } from "./context";

const IS_PROD = (process.env.NODE_ENV as string) === "prod";

const tRPCContext = initTRPC
  .meta<OpenApiMeta>()
  .context<typeof createContext>()
  .create({
    errorFormatter({ shape, error }) {
      // Never echo raw DB / framework errors to the client. In prod, replace
      // any 5xx body with a generic message; in dev, keep the detail to make
      // debugging tractable. The full error is still available server-side
      // via TRPCError's `cause`.
      if (IS_PROD && error.code === "INTERNAL_SERVER_ERROR") {
        return {
          ...shape,
          message: "Internal server error.",
          data: {
            ...shape.data,
            stack: undefined,
          },
        };
      }
      // Always strip stack traces from the client payload, regardless of env —
      // they're noisy and occasionally leak file paths.
      return {
        ...shape,
        data: {
          ...shape.data,
          stack: undefined,
        },
      };
    },
  });

export const router = tRPCContext.router;

// Public — no auth required
export const publicProcedure = tRPCContext.procedure;

// Protected — requires an authenticated user (resolved by createContext from
// the session cookie; dev-only fallback to x-user-id header).
export const protectedProcedure = tRPCContext.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be authenticated to perform this action.",
    });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});
