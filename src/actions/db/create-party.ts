"use server";

import { JSONSchemaType } from "ajv";
import ajv from "@/actions/ajv";
import db from "@/db/connection";
import { CustomizablePartyValues, Party, parties } from "@/db/schema/parties";
import { auth } from "@/auth";

export type NewParty = CustomizablePartyValues;

type NewPartyWithUser = NewParty & Pick<Party, "createdBy">;

const schema: JSONSchemaType<NewPartyWithUser> = {
	type: "object",
	properties: {
		createdBy: { type: "string", format: "email" },
		description: { type: "string" },
		hosts: { type: "string" },
		location: { type: "string" },
		name: { type: "string" },
		startDate: { type: "string", format: "date" },
		startTime: { type: "string", format: "iso-time" },
	},
	required: [
		"createdBy",
		"hosts",
		"location",
		"name",
		"startDate",
		"startTime",
	],
	additionalProperties: false,
};

const validate = ajv.compile(schema);

const createParty = async (info: NewParty): Promise<string> => {
	const session = await auth();

	if (!session?.user?.email) {
		throw new Error("Not authenticated");
	}

	const values: NewPartyWithUser = {
		...info,
		createdBy: session.user.email,
	};

	if (!validate(values)) {
		throw new Error(JSON.stringify(validate.errors));
	}

	const result = await db
		.insert(parties)
		.values(values)
		.returning({ shortId: parties.shortId });

	return result[0].shortId;
};

export default createParty;
