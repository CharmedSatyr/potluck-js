import {
	uuid,
	varchar,
	text,
	timestamp,
	pgTable,
	index,
} from "drizzle-orm/pg-core";

const createShortId = (): string =>
	Math.random().toString(36).substring(2, 8).toUpperCase();

export const parties = pgTable(
	"parties",
	{
		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
		createdBy: varchar("created_by", { length: 256 }).notNull(),
		description: text("description"),
		end: timestamp("end", { withTimezone: true }).notNull(),
		hosts: varchar("hosts", { length: 256 }).notNull(),
		id: uuid("id").primaryKey().notNull().defaultRandom(),
		name: varchar("name", { length: 256 }).notNull(),
		shortId: varchar("short_id", { length: 6 })
			.notNull()
			.unique()
			.$default(createShortId),
		start: timestamp("start", { withTimezone: true }).notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(table) => ({ shortIdIdx: index("short_id_idx").on(table.shortId) })
);

export type Party = typeof parties.$inferSelect;
