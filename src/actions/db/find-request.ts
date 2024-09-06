"use server";

import { JSONSchemaType } from "ajv";
import ajv from "@/actions/ajv";
import validateCtx from "@/actions/validate-ctx";
import db from "@/db/connection";
import { request, Request } from "@/db/schema/request";
import { Event } from "@/db/schema/event";
import { eq } from "drizzle-orm";

interface RequestData {
	eventCode: Event["eventCode"];
}

const schema: JSONSchemaType<RequestData> = {
	type: "object",
	properties: {
		eventCode: { type: "string" },
	},
	required: ["eventCode"],
	additionalProperties: false,
};

const validate = ajv.compile(schema);

const findFoodPlan = async (data: RequestData): Promise<Request[]> => {
	if (!validate(data)) {
		throw new Error(JSON.stringify(validate.errors));
	}

	const { id } = await validateCtx(data.eventCode);

	return await db.select().from(request).where(eq(request.eventId, id));
};

export default findFoodPlan;
