"use server";

import { z } from "zod";
import { schema } from "@/actions/db/delete-commitment.schema";
import db from "@/db/connection";
import { Commitment, commitment } from "@/db/schema/commitment";
import { and, eq } from "drizzle-orm";

const deleteCommitment = async (
	data: z.infer<typeof schema>
): Promise<{ id: Commitment["id"] }[]> => {
	try {
		schema.parse(data);

		return await db
			.delete(commitment)
			.where(
				and(
					eq(commitment.createdBy, data.createdBy),
					eq(commitment.id, data.id)
				)
			)
			.returning({ id: commitment.id });
	} catch (err) {
		console.error(err);

		return [];
	}
};

export default deleteCommitment;
