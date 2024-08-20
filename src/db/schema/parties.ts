import {
	date,
	index,
	pgTable,
	text,
	timestamp,
	time,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";

export const SHORT_ID_LENGTH = 5;

const createShortId = (): string =>
	Math.random()
		.toString(36)
		.substring(2, 2 + SHORT_ID_LENGTH)
		.toUpperCase();

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
		description: text("description").notNull(),
		hosts: varchar("hosts", { length: 256 }).notNull(),
		id: uuid("id").primaryKey().notNull().defaultRandom(),
		location: varchar("location", { length: 256 }).notNull(),
		name: varchar("name", { length: 256 }).notNull(),
		// TODO: RSVP options (yes, maybe, no)
		shortId: varchar("short_id", { length: SHORT_ID_LENGTH })
			.notNull()
			.unique()
			.$default(createShortId),
		startDate: date("startDate").notNull(),
		startTime: time("startTime", { withTimezone: false }).notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(table) => ({ shortIdIdx: index("short_id_idx").on(table.shortId) })
);

export type Party = typeof parties.$inferSelect;

export type ModifiablePartyValues = Pick<
	Party,
	"description" | "hosts" | "location" | "name" | "startDate" | "startTime"
>;
