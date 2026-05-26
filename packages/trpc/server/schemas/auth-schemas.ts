import { z } from "zod";

export const signUpInputSchema = z.object({
  email: z.string().email("Please provide a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters long."),
  fullName: z.string().min(2, "Full name must be at least 2 characters long.").max(80),
});

export const signInInputSchema = z.object({
  email: z.string().email("Please provide a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export const authResponseSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  fullName: z.string(),
});
