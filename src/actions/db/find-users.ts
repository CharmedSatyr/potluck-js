"use server";

import { z } from "zod";
import { inArray } from "drizzle-orm";
import db from "@/db/connection";
import { user } from "@/db/schema/auth/user";
import { schema } from "./find-users.types";

const findUsers = async (data: z.infer<typeof schema>) => {
	try {
		schema.parse(data);

		return await db.select().from(user).where(inArray(user.id, data.users));
	} catch (err) {
		console.error(err);

		return [];
	}
};

export default findUsers;
