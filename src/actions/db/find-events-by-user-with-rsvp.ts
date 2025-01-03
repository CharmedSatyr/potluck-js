"use server";

import { z } from "zod";
import { desc, eq } from "drizzle-orm";
import { Event } from "@/@types/event";
import { schema } from "@/actions/db/find-events-by-user-with-rsvp.schema";
import db from "@/db/connection";
import { event } from "@/db/schema/event";
import { rsvp } from "@/db/schema/rsvp";

const findEventsByUserWithRsvp = async (
	data: z.infer<typeof schema>
): Promise<
	{
		code: Event["code"];
		description: Event["location"];
		location: Event["location"];
		startUtcMs: Event["startUtcMs"];
		title: Event["title"];
	}[]
> => {
	try {
		schema.parse(data);

		const { code, description, location, startUtcMs, title } = event;

		return await db
			.select({
				code,
				description,
				location,
				startUtcMs,
				title,
			})
			.from(rsvp)
			.where(eq(rsvp.createdBy, data.id))
			.innerJoin(event, eq(event.id, rsvp.eventId))
			.orderBy(desc(event.startDate), desc(event.startTime));
	} catch (err) {
		console.error(err);

		return [];
	}
};

export default findEventsByUserWithRsvp;
