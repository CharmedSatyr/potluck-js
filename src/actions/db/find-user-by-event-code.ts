"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import db from "@/db/connection";
import { user } from "@/db/schema/auth/user";
import findEvent from "@/actions/db/find-event";
import { schema } from "@/actions/db/find-user-by-event-code.schema";

const findUserByEventCode = async (data: z.infer<typeof schema>) => {
	try {
		schema.parse(data);

		const [event] = await findEvent({ code: data.code });

		return await db
			.select({ image: user.image, name: user.name })
			.from(user)
			.where(eq(user.id, event.createdBy));
	} catch (err) {
		console.error(err);

		return [];
	}
};

export default findUserByEventCode;
