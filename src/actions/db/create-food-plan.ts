"use server";

import db from "@/db/connection";
import { Dish, dishes } from "@/db/schema/dishes";
import { foodPlan, FoodPlan } from "@/db/schema/food-plan";
import { Party, parties } from "@/db/schema/parties";
import { eq } from "drizzle-orm";

interface Insertable {
	course: string;
	count: number;
	partyId: string;
}

interface Plan {
	course: string;
	count: number;
}

interface Plans {
	[key: string]: Plan;
}

interface Data {
	plan: Plans;
	shortId: string;
}

const createFoodPlan = async (data: Data): Promise<any> => {
	const { plan, shortId } = data;

	console.log("plan:", data);

	const ids = await db
		.select({ id: parties.id })
		.from(parties)
		.where(eq(parties.shortId, shortId));

	const partyId = ids[0].id;

	const insertable: Insertable[] = Object.values(plan).map(
		(plan: Plan): Insertable => ({ ...plan, partyId })
	);

	console.log("insertable:", insertable);

	return await db.insert(foodPlan).values(insertable).returning();
};

export default createFoodPlan;
