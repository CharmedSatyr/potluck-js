"use server";

import { auth } from "@/auth";
import db from "@/db/connection";
import { Event, event } from "@/db/schema/event";
import { CreateEventData, schema } from "@/actions/db/create-event.types";

const createEvent = async (
	data: CreateEventData
): Promise<{ code: Event["code"] }[]> => {
	throw new Error("Errrrrrr");
	try {
		const result = schema.safeParse(data);
		if (!result.success) {
			throw result.error;
		}

		const session = await auth();

		if (!session?.user?.id) {
			throw new Error("Not authenticated");
		}

		return await db
			.insert(event)
			.values({
				...data,
				createdBy: session.user.id,
			})
			.returning({ code: event.code });
	} catch (err) {
		console.error(err);

		return [];
	}
};

export default createEvent;
