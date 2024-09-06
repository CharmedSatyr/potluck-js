"use server";

import db from "@/db/connection";
import { request } from "@/db/schema/request";
import { eq } from "drizzle-orm";
import { commitment, Commitment } from "@/db/schema/commitment";
import { Event } from "@/db/schema/event";

const findCommitments = async (eventId: Event["id"]): Promise<Commitment[]> => {
	const {
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
			createdAt,
			createdBy,
			description,
			id,
			quantity,
			requestId,
			updatedAt,
		})
		.from(request)
		.where(eq(request.eventId, eventId))
		.innerJoin(commitment, eq(request.id, commitment.requestId));
};

export default findCommitments;
