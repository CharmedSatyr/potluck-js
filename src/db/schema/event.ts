import {
	date,
	index,
	pgTable,
	timestamp,
	time,
	uuid,
	varchar,
	integer,
} from "drizzle-orm/pg-core";
import { user } from "@/db/schema/auth/user";
import { EVENT_CODE_LENGTH } from "@/constants/event-code-length";

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
		description: varchar("description", { length: 256 }).notNull(),
		endUtcMs: integer("end_utc_ms").notNull().default(0),
		hosts: varchar("hosts", { length: 100 }).notNull(),
		id: uuid("id").primaryKey().notNull().defaultRandom(),
		location: varchar("location", { length: 100 }).notNull(),
		startDate: date("startDate").notNull(),
		startTime: time("startTime", { withTimezone: false }).notNull(),
		startUtcMs: integer("start_utc_ms").notNull().default(0),
		title: varchar("title", { length: 100 }).notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(table) => [index("code_idx").on(table.code)]
);
