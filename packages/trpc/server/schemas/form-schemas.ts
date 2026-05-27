import { z } from "zod";
import { formFieldsArraySchema } from "./form-field-schemas";

// ─── Layout, Theme & Auth enums ────────────────────────────────────────────────

export const layoutModeSchema = z.enum(["SCROLL", "SLIDE"]);
export const themeSchema = z.enum(["slate", "cyberpunk", "sunset", "forest", "skullyLight", "skullyDark", "skullyNeon", "skullyGold", "skullyGreen", "skullyParty", "skullySpace", "skullyWitch", "skullyAutumn", "skullyOcean", "skullyPunk", "skullyZen", "skullyRoyal", "skullyDream"]);
export const submissionModeSchema = z.enum(["ANONYMOUS", "AUTHENTICATED", "BOTH"]);
export const visibilitySchema = z.enum(["PUBLIC", "UNLISTED"]);

export type LayoutMode = z.infer<typeof layoutModeSchema>;
export type Theme = z.infer<typeof themeSchema>;
export type SubmissionMode = z.infer<typeof submissionModeSchema>;
export type Visibility = z.infer<typeof visibilitySchema>;

// ─── Create form ──────────────────────────────────────────────────────────────

export const createFormInputSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(2000).optional(),
});

export type CreateFormInput = z.infer<typeof createFormInputSchema>;

// ─── Update form ──────────────────────────────────────────────────────────────

export const updateFormInputSchema = z.object({
  formId: z.string().uuid(),
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(2000).optional(),
  published: z.boolean().optional(),
  layoutMode: layoutModeSchema.optional(),
  theme: themeSchema.optional(),
  fields: formFieldsArraySchema.optional(),
  visibility: visibilitySchema.optional(),
  submissionMode: submissionModeSchema.optional(),
  webhookUrl: z.string().url().max(2048).or(z.literal("")).optional(),
  // Scheduled close date. `null` clears it; absent leaves it unchanged.
  // Accepted as ISO string from the client; coerced to Date for Drizzle.
  expiresAt: z
    .union([z.string().datetime(), z.date(), z.null()])
    .optional(),
});

export type UpdateFormInput = z.infer<typeof updateFormInputSchema>;

// ─── Get / delete form ────────────────────────────────────────────────────────

export const formIdInputSchema = z.object({
  formId: z.string().uuid(),
});

export type FormIdInput = z.infer<typeof formIdInputSchema>;

// ─── Public form (by slug) ────────────────────────────────────────────────────

export const slugInputSchema = z.object({
  slug: z.string().min(1).max(12),
});

export type SlugInput = z.infer<typeof slugInputSchema>;

// ─── Output types ─────────────────────────────────────────────────────────────

export const formOutputSchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  published: z.boolean().nullable(),
  visibility: z.string(),
  layoutMode: z.string(),
  theme: z.string(),
  fields: formFieldsArraySchema,
  submissionMode: z.string(),
  webhookUrl: z.string().nullable(),
  expiresAt: z.date().nullable(),
  submissionCount: z.number().optional(),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable(),
});

export type FormOutput = z.infer<typeof formOutputSchema>;

export const formListItemOutputSchema = formOutputSchema.extend({
  submissionCount: z.number(),
});

export type FormListItemOutput = z.infer<typeof formListItemOutputSchema>;
