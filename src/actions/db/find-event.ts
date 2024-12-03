"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import { schema } from "@/actions/db/find-event.schema";
import db from "@/db/connection";
import { event } from "@/db/schema/event";
import { EventDataWithCtx } from "@/@types/event";

const findEvent = async (
	data: z.infer<typeof schema>
): Promise<EventDataWithCtx[]> => {
	try {
		schema.parse(data);

		const {
			createdBy,
			description,
			hosts,
			id,
			location,
			startDate,
			startTime,
			title,
		} = event;

		return await db
			.select({
				createdBy,
				description,
				hosts,
				id,
				location,
				startDate,
				startTime,
				title,
			})
			.from(event)
			.where(eq(event.code, data.code))
			.limit(1);
	} catch (err) {
		console.error(err);

		return [];
	}
};

export default findEvent;
