"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import db from "@/db/connection";
import findEvent from "@/actions/db/find-event";
import { slot, Slot } from "@/db/schema/slot";
import { schema } from "@/actions/db/find-slots.schema";

const findSlots = async (data: z.infer<typeof schema>): Promise<Slot[]> => {
	try {
		schema.parse(data);

		const [event] = await findEvent({ code: data.eventCode });

		if (!event) {
			return [];
		}

		return await db.select().from(slot).where(eq(slot.eventId, event.id));
	} catch (err) {
		console.error(err);

		return [];
	}
};

export default findSlots;
