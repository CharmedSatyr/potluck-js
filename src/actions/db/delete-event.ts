"use server";

import { z } from "zod";
import { schema } from "@/actions/db/delete-event.schema";
import db from "@/db/connection";
import { Event, event } from "@/db/schema/event";
import { eq } from "drizzle-orm";

const deleteEvent = async (
	data: z.infer<typeof schema>
): Promise<{ id: Event["id"] }[]> => {
	try {
		schema.parse(data);

		return await db
			.delete(event)
			.where(eq(event.code, data.code))
			.returning({ id: event.id });
	} catch (err) {
		console.error(err);

		return [];
	}
};

export default deleteEvent;
