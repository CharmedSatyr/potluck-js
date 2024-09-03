"use server";

import { revalidatePath } from "next/cache";
import _ from "lodash";
import { JSONSchemaType } from "ajv";
import { eq } from "drizzle-orm";
import ajv from "@/actions/ajv";
import db from "@/db/connection";
import { Party, parties, CustomizablePartyValues } from "@/db/schema/parties";
import validateCtx from "@/actions/validate-ctx";

export type UpdatedParty = Pick<Party, "shortId"> &
	Partial<CustomizablePartyValues>;

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

export const isUpdatedParty = (data: unknown): data is UpdatedParty =>
	validate(data);

const updateParty = async (updatedParty: UpdatedParty): Promise<Party[]> => {
	if (Object.keys(updatedParty).length <= 1) {
		return [];
	}

	if (!isUpdatedParty(updatedParty)) {
		throw new Error(JSON.stringify(validate.errors));
	}

	const id = await validateCtx(updatedParty.shortId);

	const values = _.omit(updatedParty, ["shortId"]); // Never update shortId

	return await db
		.update(parties)
		.set(values)
		.where(eq(parties.id, id))
		.returning();
};

export const updatePartyAndRevalidate = async (
	updatedParty: UpdatedParty
): Promise<Party[]> => {
	revalidatePath(`/event/${updatedParty.shortId}`, "page");

	return await updateParty(updatedParty);
};

export default updateParty;
