import {
	uuid,
	varchar,
	timestamp,
	pgTable,
	integer,
} from "drizzle-orm/pg-core";
import { request } from "@/db/schema/request";

export const commitment = pgTable("commitment", {
	avatar: varchar("avatar").notNull(), // TODO: THIS IS BAD! There should be a user table!
	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
	createdBy: varchar("created_by", { length: 256 }).notNull(),
	description: varchar("description", { length: 256 }).notNull(),
	id: uuid("id").primaryKey().notNull().defaultRandom(),
	quantity: integer("quantity").notNull(),
	requestId: uuid("request_id")
		.references(() => request.id, { onDelete: "cascade" })
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
});

export type Commitment = typeof commitment.$inferSelect;
