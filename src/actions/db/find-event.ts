"use server";

import { JSONSchemaType } from "ajv";
import ajv from "@/actions/ajv";
import db from "@/db/connection";
import { Event, event } from "@/db/schema/event";
import { eq } from "drizzle-orm";

interface EventCode {
	code: Event["code"];
}

const schema: JSONSchemaType<EventCode> = {
	type: "object",
	properties: {
		code: { type: "string" },
	},
	required: ["code"],
	additionalProperties: false,
};

const validate = ajv.compile(schema);

const findEvent = async ({ code }: EventCode): Promise<Event[]> => {
	if (!validate({ code })) {
		throw new Error(JSON.stringify(validate.errors));
	}

	return await db.select().from(event).where(eq(event.code, code)).limit(1);
};

export default findEvent;
