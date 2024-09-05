"use server";

import db from "@/db/connection";
import { foodPlan } from "@/db/schema/food-plan";
import { eq } from "drizzle-orm";
import { commitment, Commitment } from "@/db/schema/commitment";

interface RequestData {
	partyId: string;
}

export interface Return {
	[foodPlanId: string]: Commitment[];
}

const findCommitments = async ({ partyId }: RequestData): Promise<Return> => {
	const result = await db
		.select({ commitment })
		.from(foodPlan)
		.where(eq(foodPlan.partyId, partyId))
		.innerJoin(commitment, eq(foodPlan.id, commitment.foodPlanId));

	return result
		.map((item) => ({ ...item.commitment }))
		.reduce<Return>((acc, curr) => {
			if (acc[curr.foodPlanId]) {
				acc[curr.foodPlanId] = [...acc[curr.foodPlanId], curr];

				return acc;
			}

			acc[curr.foodPlanId] = [curr];
			return acc;
		}, {});
};

export default findCommitments;
