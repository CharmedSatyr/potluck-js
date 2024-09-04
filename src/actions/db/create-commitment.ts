"use server";

import { auth } from "@/auth";
import db from "@/db/connection";
import { Commitment, commitment } from "@/db/schema/commitment";

interface Data {
	description: string;
	quantity: number;
	foodPlanId: string;
}

const createCommitment = async ({
	description,
	quantity,
	foodPlanId,
}: Data): Promise<Commitment[]> => {
	const session = await auth();

	const createdBy = session?.user?.email;

	if (!createdBy) {
		throw new Error("Not authenticated");
	}

	const values = {
		createdBy,
		description,
		quantity,
		foodPlanId,
	};

	return await db.insert(commitment).values(values).returning();
};

export default createCommitment;
