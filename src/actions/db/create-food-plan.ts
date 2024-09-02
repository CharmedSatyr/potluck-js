"use server";

import { JSONSchemaType } from "ajv";
import ajv from "@/actions/ajv";
import validateCtx from "@/actions/validate-ctx";
import db from "@/db/connection";
import {
	CustomizableFoodPlanValues,
	foodPlan,
	FoodPlan,
} from "@/db/schema/food-plan";
import { Party } from "@/db/schema/parties";

interface NewFoodPlan {
	slots: CustomizableFoodPlanValues[];
	shortId: Party["shortId"];
}

const schema: JSONSchemaType<NewFoodPlan> = {
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

const createFoodPlan = async (data: NewFoodPlan): Promise<FoodPlan[]> => {
	if (!validate(data)) {
		throw new Error(JSON.stringify(validate.errors));
	}

	const { slots, shortId } = data;

	const id = await validateCtx(shortId);

	const values = slots.map((slot) => ({ ...slot, partyId: id }));

	return await db.insert(foodPlan).values(values).returning();
};

export default createFoodPlan;
