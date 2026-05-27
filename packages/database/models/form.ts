import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  jsonb,
  index,
  uniqueIndex,
  integer,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { usersTable } from "./user";

// ─── Type Definitions for JSONB Fields ───────────────────────────────────────

export interface DbFormField {
  id: string;
  type: "TEXT" | "TEXTAREA" | "NUMBER" | "EMAIL" | "DATE" | "SELECT" | "RADIO" | "CHECKBOX" | "FILE" | "RATING";
  label: string;
  placeholder?: string;
  required: boolean;
  order?: number;
  options?: string[];
  min?: number;
  max?: number;
  accept?: "image" | "video" | "any";
  maxSizeMB?: number;
  maxStars?: number;
}

export type DbSubmissionData = Record<
  string,
  string | number | boolean | string[] | { url: string; name: string; size: number; type: string }
>;

// ─── Forms Table ────────────────────────────────────────────────────────────────

export const formsTable = pgTable(
  "forms",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),

    slug: varchar("slug", { length: 12 }).notNull().unique(),

    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),

    published: boolean("published").default(false),

    layoutMode: varchar("layout_mode", { length: 50 }).$type<"SCROLL" | "SLIDE">().notNull().default("SLIDE"),
    theme: varchar("theme", { length: 50 }).notNull().default("skullyLight"),

    fields: jsonb("fields").$type<DbFormField[]>().notNull().default([]),

    // Public visibility: PUBLIC (appears in explore/galleries) | UNLISTED (link-only)
    visibility: varchar("visibility", { length: 20 }).$type<"PUBLIC" | "UNLISTED">().notNull().default("PUBLIC"),

    // Enforce submission access controls: "ANONYMOUS", "AUTHENTICATED", "BOTH"
    submissionMode: varchar("submission_mode", { length: 50 }).$type<"ANONYMOUS" | "AUTHENTICATED" | "BOTH">().notNull().default("ANONYMOUS"),

    // Optional payload hook URL triggered on each success response
    webhookUrl: text("webhook_url"),

    // Cached running count of submissions (Phase 2 Performance Upgrade)
    submissionCount: integer("submission_count").notNull().default(0),

    // Expiration timestamp for scheduled form closing
    expiresAt: timestamp("expires_at"),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
  },
  (table) => [
    index("forms_user_created_idx").on(table.userId, table.createdAt),
    uniqueIndex("forms_slug_unique_idx").on(table.slug),
  ],
);

export type SelectForm = typeof formsTable.$inferSelect;
export type InsertForm = typeof formsTable.$inferInsert;

// ─── Submissions Table ──────────────────────────────────────────────────────────

export const submissionsTable = pgTable(
  "submissions",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    formId: uuid("form_id")
      .notNull()
      .references(() => formsTable.id, { onDelete: "cascade" }),

    data: jsonb("data").$type<DbSubmissionData>().notNull().default({}),

    // Tracks respondent ID if authenticated submission (Phase 3.3)
    respondentId: uuid("respondent_id").references(() => usersTable.id, { onDelete: "set null" }),

    // SHA-256 hash of IP + User-Agent for anonymous rate-limiting/deduplication
    deviceFingerprint: varchar("device_fingerprint", { length: 64 }),

    // Moderation & verification markers
    isSpam: boolean("is_spam").default(false).notNull(),
    reviewedAt: timestamp("reviewed_at"),

    // Chronological timers for duration analytics (Phase 3.17)
    startedAt: timestamp("started_at"),
    durationMs: integer("duration_ms"),

    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    index("submissions_form_created_idx").on(table.formId, table.createdAt),
    uniqueIndex("submissions_form_respondent_unique_idx")
      .on(table.formId, table.respondentId)
      .where(sql`respondent_id IS NOT NULL`),
    uniqueIndex("submissions_form_fingerprint_unique_idx")
      .on(table.formId, table.deviceFingerprint)
      .where(sql`device_fingerprint IS NOT NULL`),
  ],
);

export type SelectSubmission = typeof submissionsTable.$inferSelect;
export type InsertSubmission = typeof submissionsTable.$inferInsert;
