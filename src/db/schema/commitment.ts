import {
	uuid,
	varchar,
	timestamp,
	pgTable,
	integer,
} from "drizzle-orm/pg-core";
import { slot } from "@/db/schema/slot";
import { user } from "@/db/schema/auth/user";

export const commitment = pgTable("commitment", {
	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
	createdBy: uuid("user_id")
		.references(() => user.id, { onDelete: "cascade" })
		.notNull(),
	description: varchar("description", { length: 256 }).notNull(),
	id: uuid("id").primaryKey().notNull().defaultRandom(),
	quantity: integer("quantity").notNull(),
	slotId: uuid("slot_id")
		.references(() => slot.id, { onDelete: "cascade" })
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
});

export type Commitment = typeof commitment.$inferSelect;
