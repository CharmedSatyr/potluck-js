"use server";

import db from "@/db/connection";
import { request } from "@/db/schema/request";
import { eq } from "drizzle-orm";
import { commitment, Commitment } from "@/db/schema/commitment";
import { Party } from "@/db/schema/parties";

const findCommitments = async (partyId: Party["id"]): Promise<Commitment[]> => {
	const {
		avatar,
		createdAt,
		createdBy,
		description,
		id,
		quantity,
		requestId,
		updatedAt,
	} = commitment;

	return await db
		.select({
			avatar,
			createdAt,
			createdBy,
			description,
			id,
			quantity,
			requestId,
			updatedAt,
		})
		.from(request)
		.where(eq(request.partyId, partyId))
		.innerJoin(commitment, eq(request.id, commitment.requestId));
};

export default findCommitments;
