import { TRPCError } from "@trpc/server";
import { z, zodUndefinedModel } from "../../schema";
import { userService } from "../../services";
import { getAuthenticationMethodOutputSchema } from "@repo/services/user/model";
import { signUpInputSchema, signInInputSchema, authResponseSchema } from "../../schemas/auth-schemas";
import { publicProcedure, protectedProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";

const TAGS = ["Authentication"];
const getPath = generatePath("/authentication");

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
    .mutation(async ({ input }) => {
      try {
        const user = await userService.createUser({
          email: input.email,
          fullName: input.fullName,
          password: input.password,
        });
        return {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
        };
      } catch (err: any) {
        throw new TRPCError({
          code: "CONFLICT",
          message: err.message || "Failed to create user account.",
        });
      }
    }),

  signIn: publicProcedure
    .meta({ openapi: { method: "POST", path: getPath("/signin"), tags: TAGS } })
    .input(signInInputSchema)
    .output(authResponseSchema)
    .mutation(async ({ input }) => {
      try {
        const user = await userService.authenticateUser({
          email: input.email,
          password: input.password,
        });
        return {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
        };
      } catch (err: any) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: err.message || "Invalid email or password.",
        });
      }
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
