"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import db from "@/db/connection";
import findEvent from "@/actions/db/find-event";
import { rsvp, Rsvp } from "@/db/schema/rsvp";
import { schema } from "@/actions/db/find-rsvps-with-details.schema";
import { User, user } from "@/db/schema/auth/user";

type RsvpsWithDetails = {
	createdBy: Rsvp["createdBy"];
	id: Rsvp["id"];
	message: Rsvp["message"];
	response: Rsvp["response"];
	user: {
		image: User["image"];
		name: User["name"];
	};
};

const findRsvpsWithDetails = async (
	data: z.infer<typeof schema>
): Promise<RsvpsWithDetails[]> => {
	try {
		schema.parse(data);

		const [event] = await findEvent({ code: data.code });

		if (!event) {
			return [];
		}

		return await db
			.select({
				createdBy: rsvp.createdBy,
				id: rsvp.id,
				message: rsvp.message,
				response: rsvp.response,
				user: {
					image: user.image,
					name: user.name,
				},
			})
			.from(rsvp)
			.where(eq(rsvp.eventId, event.id))
			.innerJoin(user, eq(user.id, rsvp.createdBy));
	} catch (err) {
		console.error(err);

		return [];
	}
};

export default findRsvpsWithDetails;
