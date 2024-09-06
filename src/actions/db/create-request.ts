"use server";

import { JSONSchemaType } from "ajv";
import ajv from "@/actions/ajv";
import validateCtx from "@/actions/validate-ctx";
import db from "@/db/connection";
import {
	CustomizableRequestValues,
	request,
	Request,
} from "@/db/schema/request";
import { Event } from "@/db/schema/event";

interface NewRequest {
	eventCode: Event["eventCode"];
	slots: CustomizableRequestValues[];
}

const schema: JSONSchemaType<NewRequest> = {
	type: "object",
	properties: {
		eventCode: { type: "string" },
		slots: {
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
	required: ["eventCode", "slots"],
	additionalProperties: false,
};

const validate = ajv.compile(schema);

const createRequest = async (data: NewRequest): Promise<Request[]> => {
	if (!validate(data)) {
		throw new Error(JSON.stringify(validate.errors));
	}

	const { eventCode, slots } = data;

	const { id } = await validateCtx(eventCode);

	const values = slots.map((slot) => ({ ...slot, eventId: id }));

	return await db.insert(request).values(values).returning();
};

export default createRequest;
