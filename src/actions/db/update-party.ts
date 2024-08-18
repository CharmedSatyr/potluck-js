"use server";

import _ from "lodash";
import { JSONSchemaType } from "ajv";
import { eq } from "drizzle-orm";
import ajv from "@/actions/ajv";
import db from "@/db/connection";
import { Party, parties } from "@/db/schema/parties";
import validateCtx from "@/actions/validate-ctx";

interface UpdateValues {
	description?: string;
	hosts?: string;
	location?: string;
	name?: string;
	startDate?: string;
	startTime?: string;
}

export type UpdatedParty = Partial<UpdateValues> &
	Required<Pick<Party, "shortId">>;

const schema: JSONSchemaType<UpdatedParty> = {
	type: "object",
	properties: {
		description: { type: "string", nullable: true },
		hosts: { type: "string", nullable: true },
		location: { type: "string", nullable: true },
		name: { type: "string", nullable: true },
		shortId: { type: "string" },
		startDate: { type: "string", format: "date", nullable: true },
		startTime: { type: "string", format: "iso-time", nullable: true },
	},
	required: ["shortId"],
	additionalProperties: false,
};

const validate = ajv.compile(schema);

const updateParty = async (updatedParty: UpdatedParty): Promise<Party[]> => {
	const id = await validateCtx(updatedParty.shortId);

	const values: UpdateValues = _.omit(updatedParty, ["shortId"]);

	if (!validate(values)) {
		throw new Error(JSON.stringify(validate.errors));
	}

	return await db
		.update(parties)
		.set(values)
		.where(eq(parties.id, id))
		.returning();
};

export default updateParty;
