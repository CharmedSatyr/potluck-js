import {
	uuid,
	varchar,
	timestamp,
	pgTable,
	integer,
} from "drizzle-orm/pg-core";
import { event } from "@/db/schema/event";

export const slot = pgTable("slot", {
	course: varchar("course", { length: 256 }).notNull(),
	count: integer("count").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
	id: uuid("id").primaryKey().notNull().defaultRandom(),
	eventId: uuid("event_id")
		.references(() => event.id, { onDelete: "cascade" })
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
});

export type Slot = typeof slot.$inferSelect;

export type CustomizableSlotValues = Pick<Slot, "course" | "count">;
