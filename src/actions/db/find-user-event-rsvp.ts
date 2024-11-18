"use server";

import { z } from "zod";
import { and, eq } from "drizzle-orm";
import db from "@/db/connection";
import { rsvp, Rsvp } from "@/db/schema/rsvp";
import { schema } from "@/actions/db/find-user-event-rsvp.schema";
import findEvent from "./find-event";

const findUserEventRsvp = async (
	data: z.infer<typeof schema>
): Promise<{ response: Rsvp["response"] }[]> => {
	try {
		schema.parse(data);

		const [event] = await findEvent({ code: data.code });

		return await db
			.select({
				response: rsvp.response,
			})
			.from(rsvp)
			.where(
				and(eq(rsvp.createdBy, data.createdBy), eq(rsvp.eventId, event.id))
			);
	} catch (err) {
		console.error(err);

		return [];
	}
};

export default findUserEventRsvp;
