import { pgTable, uuid, varchar, integer, timestamp, text, index, bigint } from "drizzle-orm/pg-core";
import { usersTable } from "./user";
import { formsTable } from "./form";
import { submissionsTable } from "./form"; // re-exported in formsTable/schema

export const assetsTable = pgTable(
  "assets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => usersTable.id, { onDelete: "set null" }), // Uploader
    formId: uuid("form_id").references(() => formsTable.id, { onDelete: "cascade" }), // Form linkage
    submissionId: uuid("submission_id").references(() => submissionsTable.id, { onDelete: "cascade" }), // Response answer linkage
    filename: varchar("filename", { length: 255 }).notNull(), // UUID-prefixed local storage filename
    originalName: varchar("original_name", { length: 255 }).notNull(),
    url: text("url").notNull(), // Static asset URL
    mimeType: varchar("mime_type", { length: 100 }).notNull(),
    fileSize: bigint("file_size", { mode: "number" }).notNull(), // Bytes (handles >2GB uploads seamlessly)
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    index("assets_user_idx").on(table.userId),
    index("assets_form_idx").on(table.formId),
    index("assets_submission_idx").on(table.submissionId),
  ]
);

export type SelectAsset = typeof assetsTable.$inferSelect;
export type InsertAsset = typeof assetsTable.$inferInsert;
