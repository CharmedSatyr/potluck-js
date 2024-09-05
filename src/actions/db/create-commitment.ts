"use server";

import { JSONSchemaType } from "ajv";
import ajv from "@/actions/ajv";
import { auth } from "@/auth";
import db from "@/db/connection";
import { Commitment, commitment } from "@/db/schema/commitment";

type NewCommitment = Pick<
	Commitment,
	"description" | "quantity" | "foodPlanId"
>;

const schema: JSONSchemaType<NewCommitment> = {
	type: "object",
	properties: {
		description: { type: "string" },
		foodPlanId: { type: "string" },
		quantity: { type: "number" },
	},
	required: ["description", "foodPlanId", "quantity"],
	additionalProperties: false,
};

const validate = ajv.compile(schema);

const createCommitment = async (data: NewCommitment): Promise<Commitment[]> => {
	if (!validate(data)) {
		throw new Error(JSON.stringify(validate.errors));
	}

	const session = await auth();

	if (!session?.user?.email || !session.user.image) {
		throw new Error("Not authenticated");
	}

	const values = {
		avatar: session.user.image,
		createdBy: session.user.email,
		description: data.description,
		quantity: data.quantity,
		foodPlanId: data.foodPlanId,
	};

	return await db.insert(commitment).values(values).returning();
};

export default createCommitment;
