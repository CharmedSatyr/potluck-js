"use server";

import db from "@/db/connection";
import { foodPlan } from "@/db/schema/food-plan";
import { eq } from "drizzle-orm";
import { commitment, Commitment } from "@/db/schema/commitment";
import { Party } from "@/db/schema/parties";

const findCommitments = async (partyId: Party["id"]): Promise<Commitment[]> => {
	const {
		avatar,
		createdAt,
		createdBy,
		description,
		foodPlanId,
		id,
		quantity,
		updatedAt,
	} = commitment;

	return await db
		.select({
			avatar,
			createdAt,
			createdBy,
			description,
			foodPlanId,
			id,
			quantity,
			updatedAt,
		})
		.from(foodPlan)
		.where(eq(foodPlan.partyId, partyId))
		.innerJoin(commitment, eq(foodPlan.id, commitment.foodPlanId));
};

export default findCommitments;
