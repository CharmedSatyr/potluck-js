"use server";

import db from "@/db/connection";
import { Dish, dishes } from "@/db/schema/dishes";
import { parties } from "@/db/schema/parties";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

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
}: NewDish) => {
	try {
		const ids = await db
			.select({ id: parties.id })
			.from(parties)
			.where(eq(parties.shortId, shortId));

		const partyId = ids[0].id;

		await db
			.insert(dishes)
			.values({
				createdBy,
				description,
				name,
				partyId,
			})
			.returning();

		revalidatePath("/party/[id]", "page");
	} catch (err) {
		console.log("Error:", err);
	}
};

export default createDish;
