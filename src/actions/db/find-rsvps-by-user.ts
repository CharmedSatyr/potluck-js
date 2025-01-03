"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import db from "@/db/connection";
import { rsvp, Rsvp } from "@/db/schema/rsvp";
import { schema } from "@/actions/db/find-rsvps-by-user.schema";

const findRsvpsByUser = async (
	data: z.infer<typeof schema>
): Promise<
	{
		createdBy: Rsvp["createdBy"];
		eventId: Rsvp["eventId"];
		id: Rsvp["id"];
		message: Rsvp["message"];
		response: Rsvp["response"];
	}[]
> => {
	try {
		schema.parse(data);

		return await db
			.select({
				createdBy: rsvp.createdBy,
				eventId: rsvp.eventId,
				id: rsvp.id,
				message: rsvp.message,
				response: rsvp.response,
			})
			.from(rsvp)
			.where(eq(rsvp.createdBy, data.id));
	} catch (err) {
		console.error(err);

		return [];
	}
};

export default findRsvpsByUser;
