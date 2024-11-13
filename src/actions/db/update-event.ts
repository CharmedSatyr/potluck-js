"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import db from "@/db/connection";
import { Event, event } from "@/db/schema/event";
import findEvent from "@/actions/db/find-event";
import { schema } from "@/actions/db/update-event.schema";

const updateEvent = async (
	data: z.infer<typeof schema>
): Promise<{ code: Event["code"] }[]> => {
	try {
		schema.parse(data);

		const [eventToUpdate] = await findEvent({ code: data.code });

		return await db
			.update(event)
			.set(data)
			.where(eq(event.id, eventToUpdate.id))
			.returning({ code: event.code });
	} catch (err) {
		console.error(err);

		return [];
	}
};

export default updateEvent;
