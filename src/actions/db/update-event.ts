"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import db from "@/db/connection";
import { Event } from "@/@types/event";
import { event } from "@/db/schema/event";
import { schema } from "@/actions/db/update-event.schema";

const updateEvent = async (
	data: z.infer<typeof schema>
): Promise<{ code: Event["code"] }[]> => {
	try {
		schema.parse(data);

		return await db
			.update(event)
			.set(data)
			.where(eq(event.code, data.code))
			.returning({ code: event.code });
	} catch (err) {
		console.error(err);

		return [];
	}
};

export default updateEvent;
