import { pgTable, uuid, varchar, integer, timestamp, uniqueIndex, index } from "drizzle-orm/pg-core";
import { formsTable } from "./form";

export const formAnalyticsCacheTable = pgTable(
  "form_analytics_cache",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    formId: uuid("form_id")
      .notNull()
      .references(() => formsTable.id, { onDelete: "cascade" }),
    fieldId: varchar("field_id", { length: 50 }).notNull(), // Form question ID (e.g. "q1")
    option: varchar("option", { length: 255 }).notNull(),   // Option text value (e.g. "Excellent")
    count: integer("count").notNull().default(0),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
  },
  (table) => [
    // Unique compound key enables safe, atomic upsert locks
    uniqueIndex("form_analytics_cache_unique_idx").on(table.formId, table.fieldId, table.option),
    index("form_analytics_cache_form_idx").on(table.formId),
  ]
);

export type SelectFormAnalyticsCache = typeof formAnalyticsCacheTable.$inferSelect;
export type InsertFormAnalyticsCache = typeof formAnalyticsCacheTable.$inferInsert;
