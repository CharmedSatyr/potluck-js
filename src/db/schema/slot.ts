import {
	uuid,
	varchar,
	timestamp,
	pgTable,
	integer,
	serial,
} from "drizzle-orm/pg-core";
import { event } from "@/db/schema/event";

export const slot = pgTable("slot", {
	count: integer("count").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
	eventId: uuid("event_id")
		.references(() => event.id, { onDelete: "cascade" })
		.notNull(),
	id: uuid("id").primaryKey().notNull().defaultRandom(),
	item: varchar("item", { length: 256 }).notNull(),
	order: serial("order").notNull().unique(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
});

export type Slot = typeof slot.$inferSelect;
