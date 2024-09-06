"use server";

import { JSONSchemaType } from "ajv";
import { eq } from "drizzle-orm";
import ajv from "@/actions/ajv";
import db from "@/db/connection";
import findEvent from "@/actions/db/find-event";
import { request, Request } from "@/db/schema/request";
import { Event } from "@/db/schema/event";

interface EventCode {
	eventCode: Event["code"];
}

const schema: JSONSchemaType<EventCode> = {
	type: "object",
	properties: {
		eventCode: { type: "string" },
	},
	required: ["eventCode"],
	additionalProperties: false,
};

const validate = ajv.compile(schema);

const findRequests = async ({ eventCode }: EventCode): Promise<Request[]> => {
	if (!validate({ eventCode })) {
		throw new Error(JSON.stringify(validate.errors));
	}

	const event = await findEvent({ code: eventCode });

	if (!event) {
		throw new Error("Invalid event code");
	}

	return await db.select().from(request).where(eq(request.eventId, event.id));
};

export default findRequests;
