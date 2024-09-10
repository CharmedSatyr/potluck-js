"use server";

import { JSONSchemaType } from "ajv";
import ajv from "@/actions/ajv";
import findEvent from "@/actions/db/find-event";
import { auth } from "@/auth";
import db from "@/db/connection";
import {
	CustomizableRequestValues,
	request,
	Request,
} from "@/db/schema/request";
import { Event } from "@/db/schema/event";

interface NewRequests {
	code: Event["code"];
	requests: CustomizableRequestValues[];
}

const schema: JSONSchemaType<NewRequests> = {
	type: "object",
	properties: {
		code: { type: "string" },
		requests: {
			type: "array",
			items: {
				type: "object",
				properties: {
					count: { type: "number" },
					course: { type: "string" },
				},
				required: ["count", "course"],
				additionalProperties: false,
			},
			minItems: 1,
		},
	},
	required: ["code", "requests"],
	additionalProperties: false,
};

const validate = ajv.compile(schema);

const createRequest = async ({
	code,
	requests,
}: NewRequests): Promise<{ id: Request["id"] }[]> => {
	if (!validate({ code, requests })) {
		throw new Error(JSON.stringify(validate.errors));
	}

	const [event] = await findEvent({ code });

	if (!event) {
		throw new Error("Invalid event code");
	}

	const session = await auth();

	if (!session?.user?.email) {
		throw new Error("Not authenticated");
	}

	const values = requests.map((request) => ({
		...request,
		eventId: event.id,
	}));

	return await db.insert(request).values(values).returning({ id: request.id });
};

export default createRequest;
