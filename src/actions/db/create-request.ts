"use server";

import { JSONSchemaType } from "ajv";
import ajv from "@/actions/ajv";
import validateCtx from "@/actions/validate-ctx";
import db from "@/db/connection";
import {
	CustomizableFoodPlanValues,
	request,
	Request,
} from "@/db/schema/request";
import { Party } from "@/db/schema/parties";

interface NewRequest {
	slots: CustomizableFoodPlanValues[];
	shortId: Party["shortId"];
}

const schema: JSONSchemaType<NewRequest> = {
	type: "object",
	properties: {
		shortId: { type: "string" },
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
	required: ["shortId", "slots"],
	additionalProperties: false,
};

const validate = ajv.compile(schema);

const createRequest = async (data: NewRequest): Promise<Request[]> => {
	if (!validate(data)) {
		throw new Error(JSON.stringify(validate.errors));
	}

	const { slots, shortId } = data;

	const { id } = await validateCtx(shortId);

	const values = slots.map((slot) => ({ ...slot, partyId: id }));

	return await db.insert(request).values(values).returning();
};

export default createRequest;
