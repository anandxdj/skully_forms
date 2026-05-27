import crypto from "node:crypto";
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

function getClientIp(req: { headers: Record<string, unknown>; socket: { remoteAddress?: string } }): string {
  const fwd = req.headers["x-forwarded-for"];
  if (typeof fwd === "string") {
    const first = fwd.split(",")[0];
    if (first) return first.trim();
  }
  return req.socket.remoteAddress ?? "";
}

function deriveFingerprint(ip: string, userAgent: string, slug: string): string {
  // Slug acts as a per-form salt so the same device on different forms produces
  // different fingerprints — keeps anonymous-dedup scoped to a single form.
  return crypto
    .createHash("sha256")
    .update(`${ip}\n${userAgent}\n${slug}`)
    .digest("hex");
}

export const submissionsRouter = router({
  submitForm: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/public/forms/{slug}/submit",
        tags: ["Public"],
        summary: "Submit responses to a published form",
        description:
          "Accepts, validates, and stores a respondent's form submission. Enforces constraints based on the form's publishing and authentication states.",
      },
    })
    .input(submitFormInputSchema)
    .output(submissionOutputSchema)
    .mutation(async ({ ctx, input }) => {
      const req = ctx.req as never as {
        headers: Record<string, unknown>;
        socket: { remoteAddress?: string };
      };
      const userAgent = String(req.headers["user-agent"] ?? "");
      const ip = getClientIp(req);
      const fingerprint = deriveFingerprint(ip, userAgent, input.slug);
      // Pull respondentId from the authenticated session, NEVER the input body.
      const respondentId = ctx.user?.id;

      const submission = await formService.submitResponse({
        slug: input.slug,
        data: input.data,
        respondentId,
        deviceFingerprint: fingerprint,
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

  getSubmissions: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/{formId}"),
        tags: TAGS,
        summary: "Get all submissions for a specific form (owner only)",
      },
    })
    .input(getSubmissionsInputSchema)
    .output(z.array(submissionOutputSchema))
    .query(async ({ ctx, input }) => {
      // Server-side hard cap (100). Cursor is honored when provided; absent
      // cursor returns the most-recent page so existing callers keep working.
      const { items } = await formService.getSubmissions(
        input.formId,
        ctx.user.id,
        { limit: input.limit, cursor: input.cursor },
      );

      return items.map((sub) => ({
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

  getFormAnalytics: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/{formId}/analytics"),
        tags: TAGS,
        summary: "Get response distribution analytics for option-based fields (owner only)",
      },
    })
    .input(getAnalyticsInputSchema)
    .output(analyticsOutputSchema)
    .query(async ({ ctx, input }) => {
      const analytics = await formService.getAnalytics(input.formId, ctx.user.id);
      return analytics;
    }),

  rebuildFormAnalytics: protectedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/{formId}/analytics/rebuild"),
        tags: TAGS,
        summary: "Force recount and rebuild form analytics caches (owner only)",
      },
    })
    .input(getAnalyticsInputSchema)
    .output(z.object({ success: z.literal(true) }))
    .mutation(async ({ ctx, input }) => {
      await formService.rebuildAnalyticsCache(input.formId, ctx.user.id);
      return { success: true as const };
    }),
});
