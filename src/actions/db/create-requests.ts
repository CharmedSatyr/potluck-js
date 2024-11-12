"use server";

import findEvent from "@/actions/db/find-event";
import db from "@/db/connection";
import { request, Request } from "@/db/schema/request";
import { z } from "zod";
import { schema } from "@/actions/db/create-requests.types";

const createRequests = async (
	data: z.infer<typeof schema>
): Promise<{ id: Request["id"] }[]> => {
	try {
		schema.parse(data);

		const [event] = await findEvent({ code: data.code });

		if (!event) {
			return [];
		}

		const values = data.requests.map((request) => ({
			...request,
			eventId: event.id,
		}));

		return await db
			.insert(request)
			.values(values)
			.returning({ id: request.id });
	} catch (err) {
		console.error(err);

		return [];
	}
};

export default createRequests;
