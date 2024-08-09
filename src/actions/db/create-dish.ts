"use server";

import db from "@/db/connection";
import { Dish, dishes } from "@/db/schema/dishes";
import { Party } from "@/db/schema/parties";
import { parties } from "@/db/schema/parties";
import { eq } from "drizzle-orm";

export type NewDish = Omit<Dish, "createdAt" | "id" | "updatedAt"> &
	Pick<Party, "shortId">;

const createDish = async ({
	createdBy,
	description,
	name,
	shortId,
}: NewDish): Promise<Dish[]> => {
	const ids = await db
		.select({ id: parties.id })
		.from(parties)
		.where(eq(parties.shortId, shortId));

	const partyId = ids[0].id;

	return await db
		.insert(dishes)
		.values({
			createdBy,
			description,
			name,
			partyId,
		})
		.returning();
};

export default createDish;
