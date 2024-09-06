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

export const EVENT_CODE_LENGTH = 5;

const createcode = (): string =>
	Math.random()
		.toString(36)
		.substring(2, 2 + EVENT_CODE_LENGTH)
		.toUpperCase();

export const event = pgTable(
	"event",
	{
		// TODO: Capacity
		// TODO: Cost per person
		// TODO: Cover image ()
		code: varchar("code", { length: EVENT_CODE_LENGTH })
			.notNull()
			.unique()
			.$default(createcode),
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

		startDate: date("startDate").notNull(),
		startTime: time("startTime", { withTimezone: false }).notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(table) => ({ codeIdx: index("code_idx").on(table.code) })
);

export type Event = typeof event.$inferSelect;

export type CustomizableEventValues = Pick<
	Event,
	"description" | "hosts" | "location" | "name" | "startDate" | "startTime"
>;
