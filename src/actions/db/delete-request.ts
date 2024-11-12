"use server";

import { z } from "zod";
import { schema } from "@/actions/db/delete-request.schema";
import db from "@/db/connection";
import { eq } from "drizzle-orm";
import { request, Request } from "@/db/schema/request";

const deleteRequest = async (
	data: z.infer<typeof schema>
): Promise<{ id: Request["id"] }[]> => {
	try {
		schema.parse(data);

		return await db
			.delete(request)
			.where(eq(request.id, data.id))
			.returning({ id: request.id });
	} catch (err) {
		console.error(err);

		return [];
	}
};

export default deleteRequest;
