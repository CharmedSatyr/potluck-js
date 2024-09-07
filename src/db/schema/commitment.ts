import {
	uuid,
	varchar,
	timestamp,
	pgTable,
	integer,
} from "drizzle-orm/pg-core";
import { request } from "@/db/schema/request";
import { user } from "./auth/user";

export const commitment = pgTable("commitment", {
	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
	description: varchar("description", { length: 256 }).notNull(),
	id: uuid("id").primaryKey().notNull().defaultRandom(),
	quantity: integer("quantity").notNull(),
	requestId: uuid("request_id")
		.references(() => request.id, { onDelete: "cascade" })
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
	userId: uuid("user_id")
		.references(() => user.id, { onDelete: "cascade" })
		.notNull(),
});

export type Commitment = typeof commitment.$inferSelect;
