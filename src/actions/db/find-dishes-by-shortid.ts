"use server";

import { eq } from "drizzle-orm";
import db from "@/db/connection";
import { Dish, dishes } from "@/db/schema/dishes";
import { parties } from "@/db/schema/parties";

const findDishesByShortId = async (shortId: string): Promise<Dish[]> => {
	const results = await db
		.select({ id: parties.id })
		.from(parties)
		.where(eq(parties.shortId, shortId));

	if (!results.length) {
		return [];
	}

	const partyId = results.shift()!.id;

	return await db.select().from(dishes).where(eq(dishes.partyId, partyId));
};

export default findDishesByShortId;
