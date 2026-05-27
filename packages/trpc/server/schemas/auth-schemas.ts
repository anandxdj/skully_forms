import { z } from "zod";

export const signUpInputSchema = z.object({
  email: z.string().email("Please provide a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters long.").max(256),
  fullName: z.string().min(2, "Full name must be at least 2 characters long.").max(80),
});

export const signInInputSchema = z.object({
  email: z.string().email("Please provide a valid email address."),
  password: z.string().min(1, "Password is required.").max(256),
});

export const authResponseSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  fullName: z.string(),
});
