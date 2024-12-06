"use server";

import { z } from "zod";
import { schema } from "@/actions/db/delete-user-event-commitments.schema";
import db from "@/db/connection";
import { Commitment, commitment } from "@/db/schema/commitment";
import { eq, inArray } from "drizzle-orm";
import { slot } from "@/db/schema/slot";
import findEvent from "./find-event";

const deleteUserEventCommitments = async (
	data: z.infer<typeof schema>
): Promise<{ id: Commitment["id"] }[]> => {
	try {
		schema.parse(data);

		const [event] = await findEvent({ code: data.code });

		if (!event) {
			// TODO: Add some logging for these.
			return [];
		}

		const commitments = await db
			.select({ id: commitment.id })
			.from(slot)
			.where(eq(slot.eventId, event.id))
			.innerJoin(commitment, eq(commitment.createdBy, data.createdBy));

		if (!commitments.length) {
			return [];
		}

		const commitmentIds = commitments.map((c) => c.id);

		return await db
			.delete(commitment)
			.where(inArray(commitment.id, commitmentIds))
			.returning({ id: commitment.id });
	} catch (err) {
		console.error(err);

		return [];
	}
};

export default deleteUserEventCommitments;
