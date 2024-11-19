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
import { user } from "./auth/user";

export const EVENT_CODE_LENGTH = 5;

const createCode = (): string =>
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
			.$default(createCode),
		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
		createdBy: uuid("user_id")
			.references(() => user.id, { onDelete: "cascade" })
			.notNull(),
		description: text("description").notNull(),
		hosts: varchar("hosts", { length: 256 }).notNull(),
		id: uuid("id").primaryKey().notNull().defaultRandom(),
		location: varchar("location", { length: 256 }).notNull(),
		name: varchar("name", { length: 256 }).notNull(),
		startDate: date("startDate").notNull(),
		startTime: time("startTime", { withTimezone: false }).notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(table) => ({ codeIdx: index("code_idx").on(table.code) })
);

export type Event = typeof event.$inferSelect;

export type EventUserValues = Pick<
	Event,
	| "createdBy"
	| "description"
	| "hosts"
	| "location"
	| "name"
	| "startDate"
	| "startTime"
>;
