import {
	uuid,
	varchar,
	timestamp,
	pgTable,
	integer,
} from "drizzle-orm/pg-core";
import { parties } from "@/db/schema/parties";

export const Commitment = pgTable("commitment", {
	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
	createdBy: varchar("created_by", { length: 256 }).notNull(),
	description: varchar("description", { length: 256 }).notNull(),
	id: uuid("id").primaryKey().notNull().defaultRandom(),
	partyId: uuid("party_id")
		.references(() => parties.id, { onDelete: "cascade" })
		.notNull(),
	quantity: integer("quantity").notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
});

export type Commitment = typeof Commitment.$inferSelect;
