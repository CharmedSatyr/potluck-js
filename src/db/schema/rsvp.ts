import { uuid, timestamp, pgTable } from "drizzle-orm/pg-core";
import { user } from "@/db/schema/auth/user";
import { event } from "@/db/schema/event";

export const rsvp = pgTable("rsvp", {
	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
	createdBy: uuid("user_id")
		.references(() => user.id, { onDelete: "cascade" })
		.notNull(),
	id: uuid("id").primaryKey().notNull().defaultRandom(),
	eventId: uuid("event_id")
		.references(() => event.id, { onDelete: "cascade" })
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
});

export type Rsvp = typeof rsvp.$inferSelect;
