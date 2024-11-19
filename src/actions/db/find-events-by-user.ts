"use server";

import { z } from "zod";
import { desc, eq } from "drizzle-orm";
import { schema } from "@/actions/db/find-events-by-user.schema";
import db from "@/db/connection";
import { Event, event } from "@/db/schema/event";

const findEventsByUser = async (
	data: z.infer<typeof schema>
): Promise<Event[]> => {
	try {
		schema.parse(data);

		return await db
			.select()
			.from(event)
			.where(eq(event.createdBy, data.createdBy))
			.orderBy(desc(event.startDate), desc(event.startTime));
	} catch (err) {
		console.error(err);

		return [];
	}
};

export default findEventsByUser;
