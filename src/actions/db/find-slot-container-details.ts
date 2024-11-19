"use server";

import { z } from "zod";
import { count, eq, sql } from "drizzle-orm";
import db from "@/db/connection";
import findEvent from "@/actions/db/find-event";
import { slot, Slot } from "@/db/schema/slot";
import { schema } from "@/actions/db/find-slot-container-details.schema";
import { commitment } from "@/db/schema/commitment";
import { User, user } from "@/db/schema/auth/user";

type SlotContainerDetails = {
	commitmentCount: number;
	slotId: Slot["id"];
	item: Slot["course"];
	requestedCount: Slot["count"];
	users: {
		commitmentQuantity: number;
		id: User["id"];
		image: User["image"];
		name: User["name"];
	}[];
};

const findSlotContainerDetails = async (
	data: z.infer<typeof schema>
): Promise<SlotContainerDetails[]> => {
	try {
		schema.parse(data);

		const [event] = await findEvent({ code: data.code });

		if (!event) {
			return [];
		}

		return await db
			.select({
				commitmentCount: count(commitment),
				slotId: slot.id,
				item: slot.course,
				requestedCount: slot.count,
				users: sql<
					{
						commitmentQuantity: number;
						id: string;
						image: string;
						name: string;
					}[]
				>`
				JSON_AGG(
				  JSON_BUILD_OBJECT(
				  	'id', ${user.id},
					'image', ${user.image},
					'name', ${user.name},
					'commitmentQuantity', ${commitment.quantity}
				  )
				) 
			  `.as("users"),
			})
			.from(slot)
			.where(eq(slot.eventId, event.id))
			.innerJoin(commitment, eq(commitment.slotId, slot.id))
			.innerJoin(user, eq(commitment.createdBy, user.id))
			.groupBy(slot.id);
	} catch (err) {
		console.error(err);

		return [];
	}
};

export default findSlotContainerDetails;
