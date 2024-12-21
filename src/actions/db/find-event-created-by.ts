"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import { schema } from "@/actions/db/find-event-created-by.schema";
import db from "@/db/connection";
import { event } from "@/db/schema/event";
import { User } from "@/db/schema/auth/user";

const findEventCreatedBy = async (
	data: z.infer<typeof schema>
): Promise<{ id: User["id"] }[]> => {
	try {
		schema.parse(data);

		return await db
			.select({
				id: event.createdBy,
			})
			.from(event)
			.where(eq(event.code, data.code))
			.limit(1);
	} catch (err) {
		console.error(err);

		return [];
	}
};

export default findEventCreatedBy;
