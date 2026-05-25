import { z } from "zod";

// ─── Submit form ──────────────────────────────────────────────────────────────

// Each field answer: primitive value OR an uploaded file reference
export const fileAnswerSchema = z.object({
  url: z.string().url(),
  name: z.string(),
  size: z.number(),
  type: z.string(),
});

export const fieldAnswerSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.array(z.string()),  // checkbox multi-select
  fileAnswerSchema,
]);

export const submitFormInputSchema = z.object({
  slug: z.string().min(1).max(12),
  data: z.record(z.string(), fieldAnswerSchema),
  respondentId: z.string().uuid().optional(),
  deviceFingerprint: z.string().max(64).optional(),
  startedAt: z.date().optional(),
  durationMs: z.number().int().nonnegative().optional(),
});

export type SubmitFormInput = z.infer<typeof submitFormInputSchema>;
export type FieldAnswer = z.infer<typeof fieldAnswerSchema>;
export type FileAnswer = z.infer<typeof fileAnswerSchema>;

// ─── Get submissions (owner) ──────────────────────────────────────────────────

export const getSubmissionsInputSchema = z.object({
  formId: z.string().uuid(),
});

export type GetSubmissionsInput = z.infer<typeof getSubmissionsInputSchema>;

// ─── Submission output ────────────────────────────────────────────────────────

export const submissionOutputSchema = z.object({
  id: z.string().uuid(),
  formId: z.string().uuid(),
  data: z.record(z.string(), fieldAnswerSchema),
  respondentId: z.string().uuid().nullable().optional(),
  deviceFingerprint: z.string().nullable().optional(),
  startedAt: z.date().nullable().optional(),
  durationMs: z.number().nullable().optional(),
  createdAt: z.date().nullable(),
});

export type SubmissionOutput = z.infer<typeof submissionOutputSchema>;

// ─── Analytics ────────────────────────────────────────────────────────────────

export const getAnalyticsInputSchema = z.object({
  formId: z.string().uuid(),
});

export type GetAnalyticsInput = z.infer<typeof getAnalyticsInputSchema>;

// Option distribution for a single select/radio/checkbox field
export const fieldDistributionSchema = z.object({
  fieldId: z.string(),
  fieldLabel: z.string(),
  fieldType: z.enum(["SELECT", "RADIO", "CHECKBOX"]),
  distribution: z.array(
    z.object({
      option: z.string(),
      count: z.number(),
    }),
  ),
});

export const analyticsOutputSchema = z.object({
  formId: z.string().uuid(),
  totalSubmissions: z.number(),
  distributions: z.array(fieldDistributionSchema),
});

export type AnalyticsOutput = z.infer<typeof analyticsOutputSchema>;
export type FieldDistribution = z.infer<typeof fieldDistributionSchema>;
