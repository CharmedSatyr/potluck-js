"use server";

import { z } from "zod";
import { inArray } from "drizzle-orm";
import db from "@/db/connection";
import { User, user } from "@/db/schema/auth/user";
import { schema } from "@/actions/db/find-users.schema";

const findUsers = async (
	data: z.infer<typeof schema>
): Promise<
	{
		id: User["id"];
		image: User["image"];
		name: User["name"];
	}[]
> => {
	try {
		schema.parse(data);

		return await db
			.select({ id: user.id, image: user.image, name: user.name })
			.from(user)
			.where(inArray(user.id, data.users));
	} catch (err) {
		console.error(err);

		return [];
	}
};

export default findUsers;
