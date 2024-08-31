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
	courses: {
		[key: string]: CustomizableFoodPlanValues;
	};
	shortId: Party["shortId"];
}

const schema: JSONSchemaType<NewFoodPlan> = {
	type: "object",
	properties: {
		shortId: { type: "string" },
		courses: {
			minProperties: 1,
			type: "object",
			properties: {
				$ref: {
					type: "object",
					properties: {
						course: { type: "string" },
						count: { type: "number" },
					},
					required: ["count", "course"],
					additionalProperties: false,
				},
			},
			required: ["0"],
			additionalProperties: true,
		},
	},
	required: ["courses", "shortId"],
	additionalProperties: false,
};

const validate = ajv.compile(schema);

export const isNewFoodPlan = (data: unknown): data is NewFoodPlan =>
	validate(data);

const createFoodPlan = async (data: NewFoodPlan): Promise<FoodPlan[]> => {
	if (!validate(data)) {
		throw new Error(JSON.stringify(validate.errors));
	}

	const { courses, shortId } = data;

	const id = await validateCtx(shortId);

	const values = Object.values(courses).map((course) => ({
		...course,
		partyId: id,
	}));

	return await db.insert(foodPlan).values(values).returning();
};

export default createFoodPlan;
