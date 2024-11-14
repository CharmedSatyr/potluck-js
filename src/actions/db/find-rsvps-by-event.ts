"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import db from "@/db/connection";
import findEvent from "@/actions/db/find-event";
import { rsvp, Rsvp } from "@/db/schema/rsvp";
import { schema } from "@/actions/db/find-rsvps-by-event.schema";

const findRsvpsByEvent = async (
	data: z.infer<typeof schema>
): Promise<
	{
		createdBy: Rsvp["createdBy"];
		id: Rsvp["id"];
		message: Rsvp["message"];
		response: Rsvp["response"];
	}[]
> => {
	try {
		schema.parse(data);

		const [event] = await findEvent({ code: data.eventCode });

		if (!event) {
			return [];
		}

		return await db
			.select({
				createdBy: rsvp.createdBy,
				id: rsvp.id,
				message: rsvp.message,
				response: rsvp.response,
			})
			.from(rsvp)
			.where(eq(rsvp.eventId, event.id));
	} catch (err) {
		console.error(err);

		return [];
	}
};

export default findRsvpsByEvent;
