"use server";

import { z } from "zod";
import { schema } from "@/actions/db/find-commitments-with-details.schema";
import db from "@/db/connection";
import { Commitment, commitment } from "@/db/schema/commitment";
import { eq } from "drizzle-orm";
import { Slot, slot } from "@/db/schema/slot";
import findEvent from "@/actions/db/find-event";
import { User, user } from "@/db/schema/auth/user";

type CommitmentsWithDetails = {
	commitmentId: Commitment["id"];
	description: Commitment["description"];
	item: Slot["course"];
	quantity: Commitment["quantity"];
	user: {
		image: User["image"];
		name: User["name"];
	};
};

const findCommitmentsWithDetails = async (
	data: z.infer<typeof schema>
): Promise<CommitmentsWithDetails[]> => {
	try {
		schema.parse(data);

		const [event] = await findEvent({ code: data.code });

		return await db
			.select({
				commitmentId: commitment.id,
				description: commitment.description,
				item: slot.course,
				quantity: commitment.quantity,
				user: {
					image: user.image,
					name: user.name,
				},
			})
			.from(slot)
			.where(eq(slot.eventId, event.id))
			.innerJoin(commitment, eq(commitment.slotId, slot.id))
			.innerJoin(user, eq(commitment.createdBy, user.id));
	} catch (err) {
		console.error(err);

		return [];
	}
};

export default findCommitmentsWithDetails;
