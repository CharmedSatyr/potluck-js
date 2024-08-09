"use server";

import db from "@/db/connection";
import { Dish, dishes } from "@/db/schema/dishes";
import { parties } from "@/db/schema/parties";
import { eq } from "drizzle-orm";

interface NewDish {
	createdBy: Dish["createdBy"];
	description: Dish["description"];
	name: Dish["name"];
	shortId: Dish["partyId"];
}

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
