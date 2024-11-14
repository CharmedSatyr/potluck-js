"use server";

import { z } from "zod";
import db from "@/db/connection";
import findEvent from "@/actions/db/find-event";
import { schema } from "@/actions/db/upsert-rsvp.schema";
import { Rsvp, rsvp } from "@/db/schema/rsvp";

const upsertRsvp = async (
	data: z.infer<typeof schema>
): Promise<{ success: boolean }> => {
	try {
		schema.parse(data);

		const [event] = await findEvent({ code: data.code });

		if (!event) {
			return { success: false };
		}

		const [result] = await db
			.insert(rsvp)
			.values({
				createdBy: data.createdBy,
				eventId: event.id,
				response: data.response,
			})
			.onConflictDoUpdate({
				target: [rsvp.createdBy, rsvp.eventId],
				set: { response: data.response },
			})
			.returning({ id: rsvp.id });

		if (result.id) {
			return { success: true };
		}

		return { success: false };
	} catch (err) {
		console.error(err);

		return { success: false };
	}
};

export default upsertRsvp;
