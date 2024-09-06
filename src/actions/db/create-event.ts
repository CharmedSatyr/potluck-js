"use server";

import { JSONSchemaType } from "ajv";
import ajv from "@/actions/ajv";
import db from "@/db/connection";
import { CustomizableEventValues, Event, event } from "@/db/schema/event";
import { auth } from "@/auth";

type NewEventWithUser = CustomizableEventValues & Pick<Event, "createdBy">;

const schema: JSONSchemaType<NewEventWithUser> = {
	type: "object",
	properties: {
		createdBy: { type: "string", format: "email" },
		description: { type: "string" },
		hosts: { type: "string" },
		location: { type: "string" },
		name: { type: "string" },
		startDate: { type: "string", format: "date" },
		startTime: { type: "string", format: "iso-time" },
	},
	required: [
		"createdBy",
		"hosts",
		"location",
		"name",
		"startDate",
		"startTime",
	],
	additionalProperties: false,
};

const validate = ajv.compile(schema);

const createEvent = async (info: CustomizableEventValues): Promise<string> => {
	const session = await auth();

	if (!session?.user?.email) {
		throw new Error("Not authenticated");
	}

	const values: NewEventWithUser = {
		...info,
		createdBy: session.user.email,
	};

	if (!validate(values)) {
		throw new Error(JSON.stringify(validate.errors));
	}

	const result = await db
		.insert(event)
		.values(values)
		.returning({ shortId: event.shortId });

	return result[0].shortId;
};

export default createEvent;
