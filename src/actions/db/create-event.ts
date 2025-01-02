"use server";

import { z } from "zod";
import db from "@/db/connection";
import { event } from "@/db/schema/event";
import { Event } from "@/@types/event";
import { schema } from "@/actions/db/create-event.schema";

const createEvent = async (
	data: z.infer<typeof schema>
): Promise<{ code: Event["code"] }[]> => {
	try {
		schema.parse(data);

		return await db.insert(event).values(data).returning({ code: event.code });
	} catch (err) {
		console.error(err);

		return [];
	}
};

export default createEvent;
