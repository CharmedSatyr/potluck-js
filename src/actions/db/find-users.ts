"use server";

import { JSONSchemaType } from "ajv";
import { inArray } from "drizzle-orm";
import ajv from "@/actions/ajv";
import db from "@/db/connection";
import { User, user } from "@/db/schema/auth/user";

interface UserLookup {
	users: User["id"][];
}

const schema: JSONSchemaType<UserLookup> = {
	type: "object",
	properties: {
		users: {
			type: "array",
			items: { type: "string" },
			minItems: 1,
		},
	},
	required: ["users"],
	additionalProperties: false,
};

const validate = ajv.compile(schema);

const findUsers = async (data: UserLookup) => {
	if (!validate(data)) {
		throw new Error(JSON.stringify(validate.errors));
	}

	return await db.select().from(user).where(inArray(user.id, data.users));
};

export default findUsers;
