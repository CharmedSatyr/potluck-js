import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "@/db/schema/auth/user";

export const session = pgTable("session", {
	sessionToken: text("sessionToken").primaryKey(),
	userId: text("userId")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	expires: timestamp("expires", { mode: "date" }).notNull(),
});

export type Session = typeof session.$inferSelect;