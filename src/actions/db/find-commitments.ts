"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import findEvent from "@/actions/db/find-event";
import db from "@/db/connection";
import { commitment, Commitment } from "@/db/schema/commitment";
import { request } from "@/db/schema/request";
import { schema } from "@/actions/db/find-commitments.types";

const findCommitments = async (
	data: z.infer<typeof schema>
): Promise<Commitment[]> => {
	try {
		schema.parse(data);

		const [event] = await findEvent({ code: data.eventCode });

		if (!event) {
			return [];
		}

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
			.where(eq(request.eventId, event.id))
			.innerJoin(commitment, eq(request.id, commitment.requestId));
	} catch (err) {
		console.error(err);

		return [];
	}
};

export default findCommitments;
