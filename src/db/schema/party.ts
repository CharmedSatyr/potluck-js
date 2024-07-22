import { uuid, varchar, text, timestamp, pgTable } from "drizzle-orm/pg-core";

type ShortId = string & { length: 5 };

const isShortId = (value: unknown): value is ShortId =>
	typeof value === "string" && value.length === 5;

const createShortId = (): ShortId => {
	const value = Math.random().toString(36).substring(2, 7);
	if (isShortId(value)) {
		return value;
	}

	throw new Error(`Invalid shortId generated: ${value}`);
};

export const party = pgTable("party", {
	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
	createdBy: varchar("created_by", { length: 256 }).notNull(),
	description: text("description"),
	hosts: varchar("hosts", { length: 256 }).notNull(),
	id: uuid("id").primaryKey().notNull().defaultRandom(),
	name: varchar("name", { length: 256 }).notNull(),
	shortId: text("short_id")
		.$type<ShortId>()
		.notNull()
		.unique()
		.$default(createShortId),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
});

export type Party = typeof party.$inferSelect;
