import { uuid, varchar, text, timestamp, pgTable } from "drizzle-orm/pg-core";
import { parties } from "./parties";

export const dishes = pgTable("dishes", {
	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
	createdBy: varchar("created_by", { length: 256 }).notNull(),
	description: text("description"),
	id: uuid("id").primaryKey().notNull().defaultRandom(),
	name: varchar("name", { length: 256 }).notNull(),
	partyId: uuid("party_id")
		.references(() => parties.id, { onDelete: "cascade" })
		.notNull()
		.unique(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
});

export type Dish = typeof dishes.$inferSelect;
