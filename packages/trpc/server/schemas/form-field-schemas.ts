import { z } from "zod";

// ─── Base field (shared across all types) ────────────────────────────────────

const baseFieldSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1).max(500),
  placeholder: z.string().max(500).optional(),
  required: z.boolean().default(false),
  // Fractional index order (e.g. 1.2, 1.4) for drag-and-drop insertion sorting
  order: z.number().optional(),
});

// ─── Text-based fields ────────────────────────────────────────────────────────

const textFieldSchema = baseFieldSchema.extend({
  type: z.literal("TEXT"),
});

const textareaFieldSchema = baseFieldSchema.extend({
  type: z.literal("TEXTAREA"),
});

const numberFieldSchema = baseFieldSchema.extend({
  type: z.literal("NUMBER"),
  min: z.number().optional(),
  max: z.number().optional(),
});

const emailFieldSchema = baseFieldSchema.extend({
  type: z.literal("EMAIL"),
});

const dateFieldSchema = baseFieldSchema.extend({
  type: z.literal("DATE"),
});

// ─── Options-based fields ─────────────────────────────────────────────────────

const optionFieldExtras = {
  options: z.array(z.string().min(1)).min(1).max(100),
  randomize: z.boolean().optional(),
  allowOther: z.boolean().optional(),
  verticalAlign: z.boolean().optional(),
} as const;

const selectFieldSchema = baseFieldSchema.extend({
  type: z.literal("SELECT"),
  ...optionFieldExtras,
});

const radioFieldSchema = baseFieldSchema.extend({
  type: z.literal("RADIO"),
  ...optionFieldExtras,
});

const checkboxFieldSchema = baseFieldSchema.extend({
  type: z.literal("CHECKBOX"),
  ...optionFieldExtras,
});

// ─── File field ───────────────────────────────────────────────────────────────

const fileFieldSchema = baseFieldSchema.extend({
  type: z.literal("FILE"),
  accept: z.enum(["image", "video", "any"]).default("any"),
  maxSizeMB: z.number().min(1).max(50).default(10),
});

// ─── Rating field ─────────────────────────────────────────────────────────────

const ratingFieldSchema = baseFieldSchema.extend({
  type: z.literal("RATING"),
  maxStars: z.number().min(3).max(10).default(5),
});

// ─── Discriminated union (single source of truth for all field types) ─────────

export const formFieldSchema = z.discriminatedUnion("type", [
  textFieldSchema,
  textareaFieldSchema,
  numberFieldSchema,
  emailFieldSchema,
  dateFieldSchema,
  selectFieldSchema,
  radioFieldSchema,
  checkboxFieldSchema,
  fileFieldSchema,
  ratingFieldSchema,
]);

export const formFieldsArraySchema = z.array(formFieldSchema);

// ─── TypeScript types ─────────────────────────────────────────────────────────

export type FormField = z.infer<typeof formFieldSchema>;
export type FormFieldsArray = z.infer<typeof formFieldsArraySchema>;
export type FormFieldType = FormField["type"];

export const FORM_FIELD_TYPES: FormFieldType[] = [
  "TEXT",
  "TEXTAREA",
  "NUMBER",
  "EMAIL",
  "DATE",
  "SELECT",
  "RADIO",
  "CHECKBOX",
  "FILE",
  "RATING",
];
