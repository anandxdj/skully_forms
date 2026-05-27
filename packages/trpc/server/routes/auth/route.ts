import { TRPCError } from "@trpc/server";
import { z, zodUndefinedModel } from "../../schema";
import { userService } from "../../services";
import { AuthError } from "@repo/services/user";
import { createSession, revokeSession, SESSION_COOKIE_NAME } from "@repo/services/auth";
import { getAuthenticationMethodOutputSchema } from "@repo/services/user/model";
import { signUpInputSchema, signInInputSchema, authResponseSchema } from "../../schemas/auth-schemas";
import { publicProcedure, protectedProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { setSessionCookie, clearSessionCookie } from "../../utils/cookies";

const TAGS = ["Authentication"];
const getPath = generatePath("/authentication");

function getClientIp(req: { headers: Record<string, unknown>; socket: { remoteAddress?: string } }): string | null {
  const fwd = req.headers["x-forwarded-for"];
  if (typeof fwd === "string") {
    const first = fwd.split(",")[0];
    if (first) return first.trim();
  }
  return req.socket.remoteAddress ?? null;
}

export const authRouter = router({
  getSupportedAuthenticationProviders: publicProcedure
    .meta({ openapi: { method: "GET", path: getPath("/supported-providers"), tags: TAGS } })
    .input(zodUndefinedModel)
    .output(z.readonly(z.array(getAuthenticationMethodOutputSchema)))
    .query(async () => {
      const supportedMethods = await userService.getAuthenticationMethods();
      return supportedMethods;
    }),

  signUp: publicProcedure
    .meta({ openapi: { method: "POST", path: getPath("/signup"), tags: TAGS } })
    .input(signUpInputSchema)
    .output(authResponseSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { user, created } = await userService.createUser({
          email: input.email,
          fullName: input.fullName,
          password: input.password,
        });

        if (!created) {
          // Email already on file. Refuse with a single generic message that
          // matches the catch-all path below so callers can't reliably tell
          // "already exists" from "rate-limited" / "transient failure".
          throw new TRPCError({
            code: "CONFLICT",
            message: "Unable to complete sign-up. Please try signing in instead.",
          });
        }

        const { rawToken, expiresAt } = await createSession({
          userId: user.id,
          userAgent: ctx.req.headers["user-agent"] ?? null,
          ip: getClientIp(ctx.req as never),
        });
        setSessionCookie(ctx.res, rawToken, expiresAt);
        return {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
        };
      } catch (err) {
        if (err instanceof TRPCError) throw err;
        // Never echo raw DB errors. Log server-side and return a generic message.
        // eslint-disable-next-line no-console
        console.error("[auth.signUp] failed", err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unable to complete sign-up. Please try again.",
        });
      }
    }),

  signIn: publicProcedure
    .meta({ openapi: { method: "POST", path: getPath("/signin"), tags: TAGS } })
    .input(signInInputSchema)
    .output(authResponseSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const user = await userService.authenticateUser({
          email: input.email,
          password: input.password,
        });

        const { rawToken, expiresAt } = await createSession({
          userId: user.id,
          userAgent: ctx.req.headers["user-agent"] ?? null,
          ip: getClientIp(ctx.req as never),
        });
        setSessionCookie(ctx.res, rawToken, expiresAt);

        return {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
        };
      } catch (err) {
        if (err instanceof AuthError) {
          throw new TRPCError({
            code: err.code === "OAUTH_ONLY" ? "BAD_REQUEST" : "UNAUTHORIZED",
            message: err.message,
          });
        }
        // eslint-disable-next-line no-console
        console.error("[auth.signIn] failed", err);
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password.",
        });
      }
    }),

  signOut: publicProcedure
    .meta({ openapi: { method: "POST", path: getPath("/signout"), tags: TAGS } })
    .input(z.undefined())
    .output(z.object({ success: z.literal(true) }))
    .mutation(async ({ ctx }) => {
      const cookies = (ctx.req as unknown as { cookies?: Record<string, string> }).cookies;
      const rawToken = cookies?.[SESSION_COOKIE_NAME];
      if (rawToken) await revokeSession(rawToken);
      clearSessionCookie(ctx.res);
      return { success: true as const };
    }),

  me: protectedProcedure
    .meta({ openapi: { method: "GET", path: getPath("/me"), tags: TAGS } })
    .input(z.undefined())
    .output(authResponseSchema)
    .query(async ({ ctx }) => {
      const user = await userService.getUserById(ctx.user.id);
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Active session user not found.",
        });
      }
      return {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      };
    }),
});
