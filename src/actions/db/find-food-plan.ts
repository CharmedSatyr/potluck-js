"use server";

import { JSONSchemaType } from "ajv";
import ajv from "@/actions/ajv";
import validateCtx from "@/actions/validate-ctx";
import db from "@/db/connection";
import { foodPlan, Request } from "@/db/schema/food-plan";
import { Party } from "@/db/schema/parties";
import { eq } from "drizzle-orm";

interface RequestData {
	shortId: Party["shortId"];
}

const schema: JSONSchemaType<RequestData> = {
	type: "object",
	properties: {
		shortId: { type: "string" },
	},
	required: ["shortId"],
	additionalProperties: false,
};

const validate = ajv.compile(schema);

const findFoodPlan = async (data: RequestData): Promise<Request[]> => {
	if (!validate(data)) {
		throw new Error(JSON.stringify(validate.errors));
	}

	const { id } = await validateCtx(data.shortId);

	return await db.select().from(foodPlan).where(eq(foodPlan.partyId, id));
};

export default findFoodPlan;
