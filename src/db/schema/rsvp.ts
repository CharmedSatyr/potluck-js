import {
	uuid,
	timestamp,
	pgTable,
	pgEnum,
	unique,
	varchar,
} from "drizzle-orm/pg-core";
import { user } from "@/db/schema/auth/user";
import { event } from "@/db/schema/event";

export const rsvp = pgTable(
	"rsvp",
	{
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
		message: varchar("message", { length: 256 }).notNull(),
		response: pgEnum("response", ["yes", "no"])().notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(t) => [unique("unique_event_user").on(t.eventId, t.createdBy)]
);

export type Rsvp = typeof rsvp.$inferSelect;
