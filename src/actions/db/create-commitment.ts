"use server";

import { z } from "zod";
import { schema } from "@/actions/db/create-commitment.schema";
import db from "@/db/connection";
import { Commitment, commitment } from "@/db/schema/commitment";

const createCommitment = async (
	data: z.infer<typeof schema>
): Promise<{ id: Commitment["id"] }[]> => {
	try {
		schema.parse(data);

		return await db
			.insert(commitment)
			.values(data)
			.returning({ id: commitment.id });
	} catch (err) {
		console.error(err);

		return [];
	}
};

export default createCommitment;
