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
		description: Event["location"];
		location: Event["location"];
		name: Event["name"];
		startDate: Event["startDate"];
		startTime: Event["startTime"];
	}[]
> => {
	try {
		schema.parse(data);

		const { code, name, startDate, startTime, location, description } = event;

		return await db
			.select({
				code,
				description,
				location,
				name,
				startDate,
				startTime,
			})
			.from(rsvp)
			.where(eq(rsvp.createdBy, data.id))
			.innerJoin(event, eq(event.id, rsvp.eventId))
			.orderBy(event.startDate, event.startTime);
	} catch (err) {
		console.error(err);

		return [];
	}
};

export default findEventsByUserWithRsvp;
