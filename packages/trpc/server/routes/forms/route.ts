import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { publicProcedure, protectedProcedure, router } from "../../trpc";
import { formService } from "../../services";
import { generatePath } from "../../utils/path-generator";

import {
  createFormInputSchema,
  updateFormInputSchema,
  formIdInputSchema,
  slugInputSchema,
  formOutputSchema,
  formListItemOutputSchema,
} from "../../schemas/form-schemas";

import { formFieldsArraySchema } from "../../schemas/form-field-schemas";

const TAGS = ["Forms"];
const getPath = generatePath("/forms");

export const formsRouter = router({
  // ── POST /forms ─────────────────────────────────────────────────────────────
  
  /**
   * Protected procedure to create a new form draft.
   * Generates a default layout and theme configuration and a unique public slug.
   * Requires a valid x-user-id headers in development.
   */
  createForm: protectedProcedure
    .meta({
      openapi: { 
        method: "POST", 
        path: getPath("/"), 
        tags: TAGS, 
        summary: "Create a new form",
        description: "Creates an empty, unpublished form schema linked to the authenticated user ID. Generates a unique 10-character slug for public access."
      },
    })
    .input(createFormInputSchema)
    .output(formOutputSchema)
    .mutation(async ({ ctx, input }) => {
      const form = await formService.createForm({
        userId: ctx.user.id,
        title: input.title,
        description: input.description,
      });

      return {
        ...form,
        fields: formFieldsArraySchema.parse(form.fields ?? []),
        submissionMode: form.submissionMode,
        webhookUrl: form.webhookUrl,
      };
    }),

  // ── GET /forms ───────────────────────────────────────────────────────────────
  
  /**
   * Protected procedure to fetch all forms owned by the active user.
   * Attaches pre-aggregated submission counts to each form for simple creator overview layouts.
   */
  getUserForms: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/"),
        tags: TAGS,
        summary: "List all forms for the current user",
        description: "Retrieves a chronological list of forms created by the authenticated user, complete with total response counts."
      },
    })
    .input(z.undefined())
    .output(z.array(formListItemOutputSchema))
    .query(async ({ ctx }) => {
      const forms = await formService.getUserForms(ctx.user.id);

      return forms.map((form) => ({
        ...form,
        fields: formFieldsArraySchema.parse(form.fields ?? []),
        submissionMode: form.submissionMode,
        webhookUrl: form.webhookUrl,
      }));
    }),

  // ── GET /forms/:formId ───────────────────────────────────────────────────────
  
  /**
   * Protected procedure to fetch full form settings and field mappings by form UUID.
   * Enforces creator ownership check.
   */
  getForm: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/{formId}"),
        tags: TAGS,
        summary: "Get a form by ID (owner only)",
        description: "Retrieves a comprehensive configuration schema of a specific form by its primary UUID. Checks for user ownership."
      },
    })
    .input(formIdInputSchema)
    .output(formOutputSchema)
    .query(async ({ ctx, input }) => {
      const form = await formService.getFormById(input.formId, ctx.user.id);

      return {
        ...form,
        fields: formFieldsArraySchema.parse(form.fields ?? []),
        submissionMode: form.submissionMode,
        webhookUrl: form.webhookUrl,
      };
    }),

  // ── PATCH /forms/:formId ─────────────────────────────────────────────────────
  
  /**
   * Protected procedure to modify a form configuration (title, layout, theme, fields, submission mode, webhooks).
   * Enforces creator ownership check and parses dynamic JSONB field structures.
   */
  updateForm: protectedProcedure
    .meta({
      openapi: {
        method: "PATCH",
        path: getPath("/{formId}"),
        tags: TAGS,
        summary: "Update a form (owner only)",
        description: "Partially updates an existing form's schema, settings, publish flags, CSS themes, and field types. Validates inputs through strict Zod schemas."
      },
    })
    .input(updateFormInputSchema)
    .output(formOutputSchema)
    .mutation(async ({ ctx, input }) => {
      const form = await formService.updateForm({
        formId: input.formId,
        userId: ctx.user.id,
        title: input.title,
        description: input.description,
        published: input.published,
        layoutMode: input.layoutMode,
        theme: input.theme,
        fields: input.fields,
        submissionMode: input.submissionMode,
        webhookUrl: input.webhookUrl,
      });

      return {
        ...form,
        fields: formFieldsArraySchema.parse(form.fields ?? []),
        submissionMode: form.submissionMode,
        webhookUrl: form.webhookUrl,
      };
    }),

  // ── DELETE /forms/:formId ────────────────────────────────────────────────────
  
  /**
   * Protected procedure to delete a form permanently.
   * Cascade purges all submissions and upload catalog records from the database.
   */
  deleteForm: protectedProcedure
    .meta({
      openapi: {
        method: "DELETE",
        path: getPath("/{formId}"),
        tags: TAGS,
        summary: "Delete a form and all its submissions (owner only)",
        description: "Hard deletes a form configuration and triggers a database-level ON DELETE CASCADE purge of all associated submissions and assets."
      },
    })
    .input(formIdInputSchema)
    .output(z.object({ success: z.literal(true) }))
    .mutation(async ({ ctx, input }) => {
      await formService.deleteForm(input.formId, ctx.user.id);
      return { success: true as const };
    }),

  // ── GET /public/forms/:slug ──────────────────────────────────────────────────
  
  /**
   * Public procedure to retrieve form layouts by public URL slug.
   * Requires no authentication header, but requires published = true.
   */
  getPublicForm: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/public/forms/{slug}",
        tags: ["Public"],
        summary: "Get a published form by slug (no auth required)",
        description: "Resolves a published form layout structure by its URL slug. Enables dynamic questionnaire rendering for public respondents."
      },
    })
    .input(slugInputSchema)
    .output(formOutputSchema)
    .query(async ({ input }) => {
      const form = await formService.getPublicForm(input.slug);

      return {
        ...form,
        fields: formFieldsArraySchema.parse(form.fields ?? []),
        submissionMode: form.submissionMode,
        webhookUrl: form.webhookUrl,
      };
    }),
});
