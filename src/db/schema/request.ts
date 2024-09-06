import {
	uuid,
	varchar,
	timestamp,
	pgTable,
	integer,
} from "drizzle-orm/pg-core";
import { parties } from "@/db/schema/parties";

export const request = pgTable("request", {
	course: varchar("course", { length: 256 }).notNull(),
	count: integer("count").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
	id: uuid("id").primaryKey().notNull().defaultRandom(),
	partyId: uuid("party_id")
		.references(() => parties.id, { onDelete: "cascade" })
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
});

export type Request = typeof request.$inferSelect;

export type CustomizableFoodPlanValues = Pick<Request, "course" | "count">;
