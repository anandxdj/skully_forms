import { TRPCError } from "@trpc/server";
import { eq, desc, count, and, sql, lt } from "drizzle-orm";
import { nanoid } from "nanoid";

import { db } from "@repo/database";
import { assertSafeUrl } from "../security/url-guard";
import {
  formsTable,
  submissionsTable,
  formAnalyticsCacheTable,
  type SelectForm,
  type SelectSubmission,
  type DbFormField,
} from "@repo/database/schema";
import {
  type SubmissionCreatedCallback,
  type CreateFormInput,
  type UpdateFormInput,
  type SubmitResponseInput,
} from "./model";

// ─── Domain event hook (no-op — replaced with Socket.IO in a future phase) ────

let onSubmissionCreated: SubmissionCreatedCallback = () => {};

/**
 * Registers a callback hook that triggers automatically whenever a new form submission is created.
 * This hook is used for real-time notifications (such as WebSockets or Socket.IO events) in later phases.
 * 
 * @param fn - The callback function containing the form ID and the new submission ID.
 */
export function setSubmissionCreatedHook(fn: SubmissionCreatedCallback) {
  onSubmissionCreated = fn;
}

// ─── Helper: assert form ownership ───────────────────────────────────────────

/**
 * Asserts that a form exists in the database and is owned by the specified user ID.
 * Throws a NOT_FOUND TRPCError if the form is missing or if the user is not the owner.
 * 
 * @param formId - The unique UUID of the form to verify.
 * @param userId - The unique UUID of the owner user to authenticate against.
 * @returns The queried SelectForm record if authentication succeeds.
 * @throws {TRPCError} If the form is not found or user ownership checks fail.
 */
async function assertOwnership(formId: string, userId: string): Promise<SelectForm> {
  const [form] = await db
    .select()
    .from(formsTable)
    .where(and(eq(formsTable.id, formId), eq(formsTable.userId, userId)))
    .limit(1);

  if (!form) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Form not found or you do not have access to it.",
    });
  }

  return form;
}

// ─── Form CRUD ────────────────────────────────────────────────────────────────

class FormService {
  /**
   * Creates a new form configuration inside the database with a unique 10-character public slug.
   * By default, newly created forms are stored as drafts (published = false) with an empty fields list.
   * 
   * @param input - The payload containing the owner's userId, a title, and optional description.
   * @returns The created SelectForm database record.
   * @throws {TRPCError} If the database query fails to return the newly inserted record.
   */
  async createForm(input: CreateFormInput): Promise<SelectForm> {
    const slug = nanoid(10);

    const [form] = await db
      .insert(formsTable)
      .values({
        userId: input.userId,
        slug,
        title: input.title,
        description: input.description ?? null,
        fields: [],
      })
      .returning();

    if (!form) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to create form." });
    }

    return form;
  }

  /**
   * Updates an existing form configuration. First verifies form existence and ownership,
   * then updates the fields provided (title, description, layoutMode, theme, fields schema, submissionMode, webhookUrl).
   * 
   * @param input - The update payload containing the formId, owner's userId, and partial parameters to modify.
   * @returns The updated SelectForm database record.
   * @throws {TRPCError} If the form ownership check fails or the database update query fails.
   */
  async updateForm(input: UpdateFormInput): Promise<SelectForm> {
    await assertOwnership(input.formId, input.userId);

    const updatePayload: Partial<typeof formsTable.$inferInsert> = {};

    if (input.title !== undefined) updatePayload.title = input.title;
    if (input.description !== undefined) updatePayload.description = input.description;
    if (input.published !== undefined) updatePayload.published = input.published;
    if (input.layoutMode !== undefined) updatePayload.layoutMode = input.layoutMode;
    if (input.theme !== undefined) updatePayload.theme = input.theme;
    if (input.fields !== undefined) updatePayload.fields = input.fields;
    if (input.submissionMode !== undefined) updatePayload.submissionMode = input.submissionMode;
    if (input.webhookUrl !== undefined) {
      // Empty string explicitly clears the webhook.
      if (input.webhookUrl === "" || input.webhookUrl === null) {
        updatePayload.webhookUrl = null;
      } else {
        const verdict = await assertSafeUrl(input.webhookUrl);
        if (!verdict.ok) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Webhook URL rejected: ${verdict.reason ?? "not allowed"}`,
          });
        }
        updatePayload.webhookUrl = input.webhookUrl;
      }
    }

    const [updated] = await db
      .update(formsTable)
      .set(updatePayload)
      .where(eq(formsTable.id, input.formId))
      .returning();

    if (!updated) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to update form." });
    }

    return updated;
  }

  /**
   * Deletes a form configuration permanently from the database.
   * Automatically deletes all associated submissions and assets due to foreign key cascade constraints.
   * 
   * @param formId - The unique UUID of the form to delete.
   * @param userId - The unique UUID of the requesting owner to verify deletion rights.
   * @returns A promise that resolves when the form is successfully deleted.
   * @throws {TRPCError} If the form ownership check fails.
   */
  async deleteForm(formId: string, userId: string): Promise<void> {
    await assertOwnership(formId, userId);

    await db.delete(formsTable).where(eq(formsTable.id, formId));
  }

  /**
   * Retrieves a specific form database record by its UUID. First verifies ownership.
   * 
   * @param formId - The unique UUID of the form to fetch.
   * @param userId - The unique UUID of the requesting owner.
   * @returns The SelectForm database record.
   * @throws {TRPCError} If ownership checks fail or the form does not exist.
   */
  async getFormById(formId: string, userId: string): Promise<SelectForm> {
    return assertOwnership(formId, userId);
  }

  /**
   * Resolves and retrieves a public form configuration by its unique public URL slug.
   * The form must be set to published = true to be accessible.
   * 
   * @param slug - The unique 10-character slug identifier of the public form.
   * @returns The SelectForm public record containing field structures and theme configuration.
   * @throws {TRPCError} If the form slug does not exist or the form is not published.
   */
  async getPublicForm(slug: string): Promise<SelectForm> {
    const [form] = await db
      .select()
      .from(formsTable)
      .where(and(eq(formsTable.slug, slug), eq(formsTable.published, true)))
      .limit(1);

    if (!form) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Form not found or is not published.",
      });
    }

    return form;
  }

  /**
   * Fetches all forms owned by a specific user.
   * Utilizes the pre-calculated `submissionCount` cache counter on `formsTable` to avoid expensive LEFT JOIN COUNT queries.
   * Forms are sorted chronologically (latest forms first).
   * 
   * @param userId - The unique UUID of the owner.
   * @returns An array of forms with their respective submission counts.
   */
  async getUserForms(userId: string): Promise<Array<SelectForm & { submissionCount: number }>> {
    const MAX_FORMS_PER_REQUEST = 200;
    const rows = await db
      .select()
      .from(formsTable)
      .where(eq(formsTable.userId, userId))
      .orderBy(desc(formsTable.createdAt))
      .limit(MAX_FORMS_PER_REQUEST);

    return rows.map((row) => ({
      ...row,
      submissionCount: row.submissionCount,
    }));
  }

  // ─── Submissions ────────────────────────────────────────────────────────────

  /**
   * Validates and saves a public respondent's form answers.
   * The parent form must be active and published to accept replies.
   * Performs all updates (submissions write, forms total count increment, and form option distributions updates)
   * atomically inside an ACID-compliant database transaction.
   * 
   * @param input - The submission payload containing the form slug, JSON answer map, and optional device/respondent tracking.
   * @returns The saved SelectSubmission database record.
   * @throws {TRPCError} If the form does not exist, is not accepting submissions, or the save query fails.
   */
  async submitResponse(input: SubmitResponseInput): Promise<SelectSubmission> {
    return db.transaction(async (tx) => {
      // 1. Verify the form exists and is published (Layer 1: Status Gate)
      const [form] = await tx
        .select()
        .from(formsTable)
        .where(and(eq(formsTable.slug, input.slug), eq(formsTable.published, true)))
        .limit(1);

      if (!form) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Form not found or is not accepting submissions.",
        });
      }

      // 2. Expiry Gate (Layer 2)
      if (form.expiresAt && new Date() > form.expiresAt) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This form has expired and is closed to new submissions.",
        });
      }

      // 3. Access Control Gate (Layer 3)
      if (form.submissionMode === "AUTHENTICATED" && !input.respondentId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be signed in to submit this form.",
        });
      }

      // 4. Authenticated Duplicate Deduplication (Layer 4)
      if (input.respondentId) {
        const [existingAuth] = await tx
          .select()
          .from(submissionsTable)
          .where(and(
            eq(submissionsTable.formId, form.id),
            eq(submissionsTable.respondentId, input.respondentId)
          ))
          .limit(1);

        if (existingAuth) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "You have already submitted a response to this form.",
          });
        }
      }

      // 5. Anonymous Duplicate Deduplication (Layer 5)
      if (form.submissionMode === "ANONYMOUS" || (form.submissionMode === "BOTH" && !input.respondentId)) {
        if (!input.deviceFingerprint) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Respondent identity missing. Cannot verify vote uniqueness.",
          });
        }

        const [existingAnon] = await tx
          .select()
          .from(submissionsTable)
          .where(and(
            eq(submissionsTable.formId, form.id),
            eq(submissionsTable.deviceFingerprint, input.deviceFingerprint)
          ))
          .limit(1);

        if (existingAnon) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "A response from this device has already been recorded.",
          });
        }
      }

      // 6. Schema & Option Validation
      const fields = (form.fields as DbFormField[]) ?? [];
      const knownFieldIds = new Set(fields.map((f) => f.id));
      const MAX_TEXT_LENGTH = 50_000;
      const MAX_TEXTAREA_LENGTH = 100_000;
      const MAX_CHECKBOX_SELECTIONS = 200;
      const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      // Drop any keys that aren't declared on the form. This stops clients from
      // stuffing the JSONB column with arbitrary attacker-controlled data.
      const sanitizedData: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(input.data)) {
        if (knownFieldIds.has(k)) sanitizedData[k] = v;
      }

      const missingRequiredFields: string[] = [];
      const invalidChoiceInjections: string[] = [];

      for (const field of fields) {
        const answer = sanitizedData[field.id];

        // Required check
        const isMissing =
          answer === undefined ||
          answer === null ||
          (typeof answer === "string" && answer.trim() === "") ||
          (Array.isArray(answer) && answer.length === 0) ||
          (typeof answer === "object" && !Array.isArray(answer) && !("url" in answer));

        if (field.required && isMissing) {
          missingRequiredFields.push(field.id);
          continue;
        }

        if (isMissing) continue;

        if (field.type === "TEXT") {
          if (typeof answer !== "string" || answer.length > MAX_TEXT_LENGTH) {
            invalidChoiceInjections.push(`Field '${field.label}' exceeds maximum length.`);
          }
        }
        if (field.type === "TEXTAREA") {
          if (typeof answer !== "string" || answer.length > MAX_TEXTAREA_LENGTH) {
            invalidChoiceInjections.push(`Field '${field.label}' exceeds maximum length.`);
          }
        }
        if (field.type === "EMAIL") {
          if (typeof answer !== "string" || !EMAIL_RE.test(answer) || answer.length > 320) {
            invalidChoiceInjections.push(`Field '${field.label}' must be a valid email.`);
          }
        }
        if (field.type === "NUMBER") {
          const n = typeof answer === "number" ? answer : Number(answer);
          if (!Number.isFinite(n)) {
            invalidChoiceInjections.push(`Field '${field.label}' must be a number.`);
          } else {
            if (field.min !== undefined && n < field.min) {
              invalidChoiceInjections.push(`Field '${field.label}' is below the minimum value.`);
            }
            if (field.max !== undefined && n > field.max) {
              invalidChoiceInjections.push(`Field '${field.label}' is above the maximum value.`);
            }
          }
        }
        if (field.type === "DATE") {
          if (typeof answer !== "string" || Number.isNaN(new Date(answer).getTime())) {
            invalidChoiceInjections.push(`Field '${field.label}' must be a valid date.`);
          }
        }

        // Select & Radio Option validation
        if (field.type === "RADIO" || field.type === "SELECT") {
          const allowedOptions = field.options ?? [];
          if (typeof answer !== "string" || !allowedOptions.includes(answer)) {
            invalidChoiceInjections.push(`Field '${field.label}' has an invalid option selection.`);
          }
        }

        // Checkbox multi-select validation
        if (field.type === "CHECKBOX") {
          if (!Array.isArray(answer)) {
            invalidChoiceInjections.push(`Field '${field.label}' must be an array of selections.`);
          } else if (answer.length > MAX_CHECKBOX_SELECTIONS) {
            invalidChoiceInjections.push(`Field '${field.label}' has too many selections.`);
          } else {
            const allowedOptions = field.options ?? [];
            const matches = (answer as any[]).every(
              (ans) => typeof ans === "string" && allowedOptions.includes(ans),
            );
            if (!matches) {
              invalidChoiceInjections.push(`Field '${field.label}' contains invalid option selections.`);
            }
          }
        }

        // Rating bounds check
        if (field.type === "RATING") {
          const ratingVal = Number(answer);
          const maxStars = field.maxStars ?? 5;
          if (!Number.isInteger(ratingVal) || ratingVal < 1 || ratingVal > maxStars) {
            invalidChoiceInjections.push(
              `Field '${field.label}' must be an integer between 1 and ${maxStars}.`,
            );
          }
        }

        // File validation check
        if (field.type === "FILE") {
          if (typeof answer !== "object" || !("url" in (answer as object))) {
            invalidChoiceInjections.push(`Field '${field.label}' must be a valid file upload reference.`);
          } else {
            const file = answer as { url?: unknown; type?: unknown; size?: unknown };
            if (typeof file.url !== "string" || !/^https?:\/\//.test(file.url)) {
              invalidChoiceInjections.push(`Field '${field.label}' has an invalid upload URL.`);
            }
            if (field.maxSizeMB && typeof file.size === "number") {
              const maxBytes = field.maxSizeMB * 1024 * 1024;
              if (file.size > maxBytes) {
                invalidChoiceInjections.push(
                  `Uploaded file in field '${field.label}' exceeds the limit of ${field.maxSizeMB}MB.`,
                );
              }
            }
            if (field.accept) {
              const mimeType = String(file.type || "");
              if (field.accept === "image" && !mimeType.startsWith("image/")) {
                invalidChoiceInjections.push(`Field '${field.label}' only accepts image files.`);
              } else if (field.accept === "video" && !mimeType.startsWith("video/")) {
                invalidChoiceInjections.push(`Field '${field.label}' only accepts video files.`);
              }
            }
          }
        }
      }

      if (missingRequiredFields.length > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Validation failed. Missing required fields: ${missingRequiredFields.join(", ")}`,
        });
      }

      if (invalidChoiceInjections.length > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Validation failed: ${invalidChoiceInjections.join(" | ")}`,
        });
      }

      // Use the sanitized payload from here on so unknown keys never reach the DB.
      input = { ...input, data: sanitizedData as typeof input.data };

      // 7. Insert the submission response (Layer 10: DB Unique Conflict Catch)
      let submission: SelectSubmission;
      try {
        const [inserted] = await tx
          .insert(submissionsTable)
          .values({
            formId: form.id,
            data: input.data,
            respondentId: input.respondentId ?? null,
            deviceFingerprint: input.deviceFingerprint ?? null,
            startedAt: input.startedAt ?? null,
            durationMs: input.durationMs ?? null,
          })
          .returning();

        if (!inserted) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to save submission." });
        }
        submission = inserted;
      } catch (err: any) {
        if (err.code === "23505") {
          const errMsg = String(err.message || "");
          const constraintName = String(err.constraint || "");
          if (constraintName.includes("respondent") || errMsg.includes("respondent")) {
            throw new TRPCError({
              code: "CONFLICT",
              message: "You have already submitted a response to this form.",
            });
          }
          if (constraintName.includes("fingerprint") || errMsg.includes("fingerprint")) {
            throw new TRPCError({
              code: "CONFLICT",
              message: "A response from this device has already been recorded.",
            });
          }
          throw new TRPCError({
            code: "CONFLICT",
            message: "A duplicate submission has been detected.",
          });
        }
        throw err;
      }

      // 8. Atomically increment formsTable.submissionCount (Layer 11)
      await tx
        .update(formsTable)
        .set({
          submissionCount: sql`${formsTable.submissionCount} + 1`,
        })
        .where(eq(formsTable.id, form.id));

      // 9. Extract and incrementally aggregate option-based answers
      const optionFields = fields.filter(
        (f) => f.type === "SELECT" || f.type === "RADIO" || f.type === "CHECKBOX",
      );

      for (const field of optionFields) {
        const answer = input.data[field.id];
        if (!answer) continue;

        const optionsToIncrement: string[] = [];

        if (field.type === "CHECKBOX" && Array.isArray(answer)) {
          for (const selected of answer as string[]) {
            if (typeof selected === "string" && selected.trim()) {
              optionsToIncrement.push(selected);
            }
          }
        } else if (typeof answer === "string" && answer.trim()) {
          optionsToIncrement.push(answer);
        }

        // Run UPSERT increments for each option choice
        for (const opt of optionsToIncrement) {
          await tx
            .insert(formAnalyticsCacheTable)
            .values({
              formId: form.id,
              fieldId: field.id,
              option: opt,
              count: 1,
            })
            .onConflictDoUpdate({
              target: [
                formAnalyticsCacheTable.formId,
                formAnalyticsCacheTable.fieldId,
                formAnalyticsCacheTable.option,
              ],
              set: {
                count: sql`${formAnalyticsCacheTable.count} + 1`,
              },
            });
        }
      }

      // Fire domain event hook (no-op now, Socket.IO in Phase 3)
      onSubmissionCreated(form.id, submission.id);

      return submission;
    });
  }

  /**
   * Retrieves a page of submission response records for a specific form, latest first.
   * Server enforces `limit <= MAX_PAGE_SIZE` regardless of what the client asks for so
   * a single caller cannot OOM the API.
   */
  async getSubmissions(
    formId: string,
    userId: string,
    opts: { limit?: number; cursor?: string } = {},
  ): Promise<{ items: SelectSubmission[]; nextCursor: string | null }> {
    await assertOwnership(formId, userId);

    const MAX_PAGE_SIZE = 100;
    const DEFAULT_PAGE_SIZE = 50;
    const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, opts.limit ?? DEFAULT_PAGE_SIZE));

    const conditions = [eq(submissionsTable.formId, formId)];
    if (opts.cursor) {
      const cursorDate = new Date(opts.cursor);
      if (!Number.isNaN(cursorDate.getTime())) {
        conditions.push(lt(submissionsTable.createdAt, cursorDate));
      }
    }

    // Fetch one extra so we can detect "is there another page".
    const rows = await db
      .select()
      .from(submissionsTable)
      .where(and(...conditions))
      .orderBy(desc(submissionsTable.createdAt))
      .limit(limit + 1);

    const hasMore = rows.length > limit;
    const items = hasMore ? rows.slice(0, limit) : rows;
    const last = items[items.length - 1];
    const nextCursor = hasMore && last?.createdAt ? last.createdAt.toISOString() : null;
    return { items, nextCursor };
  }

  // ─── Analytics ──────────────────────────────────────────────────────────────

  /**
   * Processes form responses inside database-native cache tables to generate option distribution counts.
   * Bypasses scanning submissions entirely, pulling pre-aggregated cache rows in < 1ms regardless of submission volume.
   * 
   * @param formId - The unique UUID of the form to analyze.
   * @param userId - The unique UUID of the requesting owner.
   * @returns An analytical object detailing total submissions and counts of chosen selections for each option-based field.
   * @throws {TRPCError} If form ownership verification fails.
   */
  async getAnalytics(
    formId: string,
    userId: string,
  ): Promise<{
    formId: string;
    totalSubmissions: number;
    distributions: Array<{
      fieldId: string;
      fieldLabel: string;
      fieldType: "SELECT" | "RADIO" | "CHECKBOX";
      distribution: Array<{ option: string; count: number }>;
    }>;
  }> {
    const form = await assertOwnership(formId, userId);

    // Fetch pre-computed option choice cache rows
    const cacheRows = await db
      .select()
      .from(formAnalyticsCacheTable)
      .where(eq(formAnalyticsCacheTable.formId, formId));

    const totalSubmissions = form.submissionCount;

    // Get option-based fields for distributions
    const fields = (form.fields as Array<{ id: string; type: string; label: string; options?: string[] }>) ?? [];
    const optionFields = fields.filter(
      (f) => f.type === "SELECT" || f.type === "RADIO" || f.type === "CHECKBOX",
    );

    const distributions = optionFields.map((field) => {
      const options = field.options ?? [];
      const fieldCache = cacheRows.filter((r) => r.fieldId === field.id);

      // Create option counts mapping (including 0 counters for unselected choices)
      const distributionMap = new Map<string, number>(options.map((opt) => [opt, 0]));
      for (const row of fieldCache) {
        distributionMap.set(row.option, row.count);
      }

      return {
        fieldId: field.id,
        fieldLabel: field.label,
        fieldType: field.type as "SELECT" | "RADIO" | "CHECKBOX",
        distribution: Array.from(distributionMap.entries()).map(([option, count]) => ({
          option,
          count,
        })),
      };
    });

    return { formId, totalSubmissions, distributions };
  }

  /**
   * Rebuilds the analytics cache and submission counts for a specific form from scratch.
   * Runs an optimized query to recount all submissions and updates the cache tables inside an atomic SQL transaction.
   * This provides a complete fail-safe recovery path if counters ever desynchronize.
   * 
   * @param formId - The unique UUID of the form to rebuild.
   * @param userId - The unique UUID of the requesting owner to verify ownership.
   * @throws {TRPCError} If ownership check fails.
   */
  async rebuildAnalyticsCache(formId: string, userId: string): Promise<void> {
    const form = await assertOwnership(formId, userId);

    await db.transaction(async (tx) => {
      // 1. Count actual submissions
      const [submissionsCountRow] = await tx
        .select({ count: count(submissionsTable.id) })
        .from(submissionsTable)
        .where(eq(submissionsTable.formId, formId));

      const actualCount = Number(submissionsCountRow?.count ?? 0);

      // 2. Fetch all raw submissions payloads to aggregate choices
      const submissions = await tx
        .select({ data: submissionsTable.data })
        .from(submissionsTable)
        .where(eq(submissionsTable.formId, formId));

      // 3. Clear existing cache entries for this form
      await tx
        .delete(formAnalyticsCacheTable)
        .where(eq(formAnalyticsCacheTable.formId, formId));

      // 4. Update the formsTable submissionCount counter
      await tx
        .update(formsTable)
        .set({ submissionCount: actualCount })
        .where(eq(formsTable.id, formId));

      // 5. Aggregate option choice distributions
      const fields = (form.fields as Array<{ id: string; type: string; label: string; options?: string[] }>) ?? [];
      const optionFields = fields.filter(
        (f) => f.type === "SELECT" || f.type === "RADIO" || f.type === "CHECKBOX",
      );

      const aggregatedCounts = new Map<string, Map<string, number>>();

      for (const field of optionFields) {
        aggregatedCounts.set(field.id, new Map(field.options?.map((opt) => [opt, 0]) ?? []));
      }

      for (const sub of submissions) {
        const data = sub.data as Record<string, unknown>;
        for (const field of optionFields) {
          const answer = data[field.id];
          if (!answer) continue;

          const countsMap = aggregatedCounts.get(field.id);
          if (!countsMap) continue;

          if (field.type === "CHECKBOX" && Array.isArray(answer)) {
            for (const selected of answer as string[]) {
              if (typeof selected === "string") {
                countsMap.set(selected, (countsMap.get(selected) ?? 0) + 1);
              }
            }
          } else if (typeof answer === "string") {
            countsMap.set(answer, (countsMap.get(answer) ?? 0) + 1);
          }
        }
      }

      // 6. Bulk insert new cached aggregates
      const cacheInsertPayload: Array<typeof formAnalyticsCacheTable.$inferInsert> = [];

      for (const [fieldId, optionCounts] of aggregatedCounts.entries()) {
        for (const [option, countVal] of optionCounts.entries()) {
          if (countVal > 0) {
            cacheInsertPayload.push({
              formId,
              fieldId,
              option,
              count: countVal,
            });
          }
        }
      }

      if (cacheInsertPayload.length > 0) {
        await tx.insert(formAnalyticsCacheTable).values(cacheInsertPayload);
      }
    });
  }
}

export default FormService;
