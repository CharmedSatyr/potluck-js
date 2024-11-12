"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import db from "@/db/connection";
import findEvent from "@/actions/db/find-event";
import { request, Request } from "@/db/schema/request";
import { schema } from "./find-requests.schema";

const findRequests = async (
	data: z.infer<typeof schema>
): Promise<Request[]> => {
	try {
		schema.parse(data);

		const [event] = await findEvent({ code: data.eventCode });

		if (!event) {
			return [];
		}

		return await db.select().from(request).where(eq(request.eventId, event.id));
	} catch (err) {
		console.error(err);

		return [];
	}
};

export default findRequests;
