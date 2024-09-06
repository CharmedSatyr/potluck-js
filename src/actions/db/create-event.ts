"use server";

import { JSONSchemaType } from "ajv";
import ajv from "@/actions/ajv";
import db from "@/db/connection";
import { CustomizableEventValues, Event, event } from "@/db/schema/event";
import { auth } from "@/auth";

const schema: JSONSchemaType<CustomizableEventValues> = {
	type: "object",
	properties: {
		description: { type: "string" },
		hosts: { type: "string" },
		location: { type: "string" },
		name: { type: "string" },
		startDate: { type: "string", format: "date" },
		startTime: { type: "string", format: "iso-time" },
	},
	required: ["hosts", "location", "name", "startDate", "startTime"],
	additionalProperties: false,
};

const validate = ajv.compile(schema);

const createEvent = async (
	data: CustomizableEventValues
): Promise<{ eventCode: Event["eventCode"] }[]> => {
	if (!validate(data)) {
		throw new Error(JSON.stringify(validate.errors));
	}

	const session = await auth();

	if (!session?.user?.email) {
		throw new Error("Not authenticated");
	}

	return await db
		.insert(event)
		.values({
			...data,
			createdBy: session.user.email,
		})
		.returning({ eventCode: event.eventCode });
};

export default createEvent;
