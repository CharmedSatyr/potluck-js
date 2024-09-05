"use server";

import { auth } from "@/auth";
import db from "@/db/connection";
import { Commitment, commitment } from "@/db/schema/commitment";
import { revalidatePath } from "next/cache";

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
	const avatar = session?.user?.image ?? "";

	if (!createdBy) {
		throw new Error("Not authenticated");
	}

	const values = {
		avatar,
		createdBy,
		description,
		quantity,
		foodPlanId,
	};

	const result = await db.insert(commitment).values(values).returning();

	revalidatePath(`/`, "layout"); // TODO: DOn't do this. Just the one page.

	return result;
};

export default createCommitment;
