"use server";

import findEvent from "@/actions/db/find-event";
import db from "@/db/connection";
import { slot, Slot } from "@/db/schema/slot";
import { z } from "zod";
import { schema } from "@/actions/db/create-slots.schema";

const createSlots = async (
	data: z.infer<typeof schema>
): Promise<{ id: Slot["id"] }[]> => {
	try {
		schema.parse(data);

		const [event] = await findEvent({ code: data.code });

		if (!event) {
			return [];
		}

		const values = data.slots.map((slot) => ({
			...slot,
			eventId: event.id,
		}));

		return await db.insert(slot).values(values).returning({ id: slot.id });
	} catch (err) {
		console.error(err);

		return [];
	}
};

export default createSlots;
