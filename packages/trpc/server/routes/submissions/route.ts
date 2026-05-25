import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../../trpc";
import { formService } from "../../services";
import { generatePath } from "../../utils/path-generator";
import {
  submitFormInputSchema,
  getSubmissionsInputSchema,
  getAnalyticsInputSchema,
  submissionOutputSchema,
  analyticsOutputSchema,
} from "../../schemas/submission-schemas";

const TAGS = ["Submissions"];
const getPath = generatePath("/submissions");

export const submissionsRouter = router({
  // ── POST /public/forms/:slug/submit ─────────────────────────────────────────
  
  /**
   * Public procedure to submit answers to a published form.
   * Resolves form ID via slug, validates input answers schema, and records tracking metrics
   * (respondent ID, device fingerprint, started timestamps, and completion speed).
   */
  submitForm: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/public/forms/{slug}/submit",
        tags: ["Public"],
        summary: "Submit responses to a published form",
        description: "Accepts, validates, and stores a respondent's form submission. Enforces constraints based on the form's publishing and authentication states."
      },
    })
    .input(submitFormInputSchema)
    .output(submissionOutputSchema)
    .mutation(async ({ input }) => {
      const submission = await formService.submitResponse({
        slug: input.slug,
        data: input.data,
        respondentId: input.respondentId,
        deviceFingerprint: input.deviceFingerprint,
        startedAt: input.startedAt,
        durationMs: input.durationMs,
      });

      return {
        id: submission.id,
        formId: submission.formId,
        data: submission.data as Record<string, any>,
        respondentId: submission.respondentId,
        deviceFingerprint: submission.deviceFingerprint,
        startedAt: submission.startedAt,
        durationMs: submission.durationMs,
        createdAt: submission.createdAt,
      };
    }),

  // ── GET /forms/:formId/submissions ──────────────────────────────────────────
  
  /**
   * Protected procedure to fetch chronological list of all submissions.
   * Enforces creator ownership checks.
   */
  getSubmissions: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/{formId}"),
        tags: TAGS,
        summary: "Get all submissions for a specific form (owner only)",
        description: "Retrieves a comprehensive array of all submitted questionnaire responses for a given form ID. Checks for creator ownership."
      },
    })
    .input(getSubmissionsInputSchema)
    .output(z.array(submissionOutputSchema))
    .query(async ({ ctx, input }) => {
      const submissions = await formService.getSubmissions(input.formId, ctx.user.id);

      return submissions.map((sub) => ({
        id: sub.id,
        formId: sub.formId,
        data: sub.data as Record<string, any>,
        respondentId: sub.respondentId,
        deviceFingerprint: sub.deviceFingerprint,
        startedAt: sub.startedAt,
        durationMs: sub.durationMs,
        createdAt: sub.createdAt,
      }));
    }),

  // ── GET /forms/:formId/analytics ─────────────────────────────────────────────
  
  /**
   * Protected procedure to aggregate dynamic in-memory counts.
   * Enforces creator ownership checks and counts distributions for option-based field types.
   */
  getFormAnalytics: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/{formId}/analytics"),
        tags: TAGS,
        summary: "Get response distribution analytics for option-based fields (owner only)",
        description: "Aggregates form response data dynamically to return total submission volume and chosen choice ratios for select, radio, and checkbox questions."
      },
    })
    .input(getAnalyticsInputSchema)
    .output(analyticsOutputSchema)
    .query(async ({ ctx, input }) => {
      const analytics = await formService.getAnalytics(input.formId, ctx.user.id);

      return {
        formId: analytics.formId,
        totalSubmissions: analytics.totalSubmissions,
        distributions: analytics.distributions,
      };
    }),

  // ── POST /forms/:formId/analytics/rebuild ────────────────────────────────────
  
  /**
   * Protected procedure to force recount and rebuild form analytics caches.
   * Runs a complete SQL-native recalculation. Enforces owner verification.
   */
  rebuildFormAnalytics: protectedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/{formId}/analytics/rebuild"),
        tags: TAGS,
        summary: "Force recount and rebuild form analytics caches (owner only)",
        description: "Runs a complete, atomic transaction in PostgreSQL to recount all raw submissions, reset cached counters, and rebuild the analytics cache from scratch."
      },
    })
    .input(getAnalyticsInputSchema)
    .output(z.object({ success: z.literal(true) }))
    .mutation(async ({ ctx, input }) => {
      await formService.rebuildAnalyticsCache(input.formId, ctx.user.id);
      return { success: true as const };
    }),
});
