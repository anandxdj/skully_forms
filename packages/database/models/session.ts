import { pgTable, uuid, varchar, timestamp, text, index } from "drizzle-orm/pg-core";
import { usersTable } from "./user";

export const sessionsTable = pgTable(
  "sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    token: varchar("token", { length: 512 }).notNull().unique(), // hashed refresh token identifier
    expiresAt: timestamp("expires_at").notNull(),
    deviceInfo: text("device_info"), // User-Agent, approximate IP, platform info
    revokedAt: timestamp("revoked_at"), // Soft session revocation
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    index("sessions_token_idx").on(table.token),
    index("sessions_user_idx").on(table.userId),
  ]
);

export type SelectSession = typeof sessionsTable.$inferSelect;
export type InsertSession = typeof sessionsTable.$inferInsert;
