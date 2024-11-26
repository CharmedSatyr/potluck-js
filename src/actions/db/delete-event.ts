"use server";

import { z } from "zod";
import { schema } from "@/actions/db/delete-event.schema";
import db from "@/db/connection";
import { Event, event } from "@/db/schema/event";
import { and, eq } from "drizzle-orm";
import findEvent from "@/actions/db/find-event";

const deleteEvent = async (
	data: z.infer<typeof schema>
): Promise<{ id: Event["id"] }[]> => {
	try {
		schema.parse(data);

		const [result] = await findEvent({ code: data.code });

		if (!event) {
			return [];
		}

		return await db
			.delete(event)
			.where(and(eq(event.createdBy, data.createdBy), eq(event.id, result.id)))
			.returning({ id: event.id });
	} catch (err) {
		console.error(err);

		return [];
	}
};

export default deleteEvent;
