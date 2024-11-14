"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import { schema } from "@/actions/db/find-events-by-user-with-rsvp.schema";
import db from "@/db/connection";
import { Event, event } from "@/db/schema/event";
import { rsvp } from "@/db/schema/rsvp";

const findEventsByUserWithRsvp = async (
	data: z.infer<typeof schema>
): Promise<
	{
		code: Event["code"];
		name: Event["name"];
		startDate: Event["startDate"];
		startTime: Event["startTime"];
		location: Event["location"];
		description: Event["location"];
	}[]
> => {
	try {
		schema.parse(data);

		const { code, name, startDate, startTime, location, description } = event;

		return await db
			.select({
				code,
				name,
				startDate,
				startTime,
				location,
				description,
			})
			.from(rsvp)
			.where(eq(rsvp.createdBy, data.id))
			.innerJoin(event, eq(event.id, rsvp.eventId));
	} catch (err) {
		console.error(err);

		return [];
	}
};

export default findEventsByUserWithRsvp;
