import { uuid, varchar, text, timestamp, pgTable } from "drizzle-orm/pg-core";

const createShortId = (): string =>
	Math.random().toString(36).substring(2, 7).toUpperCase();

export const parties = pgTable("parties", {
	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
	createdBy: varchar("created_by", { length: 256 }).notNull(),
	description: text("description"),
	hosts: varchar("hosts", { length: 256 }).notNull(),
	id: uuid("id").primaryKey().notNull().defaultRandom(),
	name: varchar("name", { length: 256 }).notNull(),
	shortId: varchar("short_id", { length: 5 })
		.notNull()
		.unique()
		.$default(createShortId),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
});

export type Party = typeof parties.$inferSelect;
