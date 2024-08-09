import {
	uuid,
	varchar,
	text,
	timestamp,
	pgTable,
	index,
} from "drizzle-orm/pg-core";

const SHORT_ID_LENGTH = 5;

const createShortId = (): string =>
	Math.random().toString(36).substring(2, 2 + SHORT_ID_LENGTH).toUpperCase();

export const parties = pgTable(
	"parties",
	{
		// TODO: Capacity
		// TODO: Cost per person
		// TODO: Cover image ()
		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
		createdBy: varchar("created_by", { length: 256 }).notNull(),
		// TODO: Add custom field (link or text)
		description: text("description"),
		end: timestamp("end", { withTimezone: true }).notNull(),
		hosts: varchar("hosts", { length: 256 }).notNull(),
		id: uuid("id").primaryKey().notNull().defaultRandom(),
		// TODO: Location
		name: varchar("name", { length: 256 }).notNull(),
		// TODO: RSVP options
		shortId: varchar("short_id", { length: SHORT_ID_LENGTH })
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
