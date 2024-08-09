"use server";

import { eq } from "drizzle-orm";
import db from "@/db/connection";
import { parties } from "@/db/schema/parties";
import { dishes } from "@/db/schema/dishes";

const findPartyWithDishes = async (shortId: string) =>
	await db
		.select()
		.from(parties)
		.where(eq(parties.shortId, shortId))
		.leftJoin(dishes, eq(parties.id, dishes.partyId));

export default findPartyWithDishes;
