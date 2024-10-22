"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import { schema } from "@/actions/db/find-event.types";
import db from "@/db/connection";
import { Event, event } from "@/db/schema/event";

const findEvent = async (data: z.infer<typeof schema>): Promise<Event[]> => {
	try {
		schema.parse(data);

		return await db
			.select()
			.from(event)
			.where(eq(event.code, data.code))
			.limit(1);
	} catch (err) {
		console.error(err);

		return [];
	}
};

export default findEvent;
