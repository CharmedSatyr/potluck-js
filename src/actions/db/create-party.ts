"use server";

import { JTDSchemaType } from "ajv/dist/jtd";
import ajv from "@/actions/ajv";
import db from "@/db/connection";
import { Party, parties } from "@/db/schema/parties";
import { auth } from "@/auth";

export type NewParty = Omit<
	Party,
	"createdAt" | "createdBy" | "id" | "shortId" | "updatedAt"
>;

type NewPartyWithUser = NewParty & Pick<Party, "createdBy">;

const schema: JTDSchemaType<NewPartyWithUser> = {
	properties: {
		createdBy: { type: "string" },
		description: { type: "string", nullable: true },
		hosts: { type: "string" },
		end: { type: "timestamp" },
		location: { type: "string" },
		name: { type: "string" },
		start: { type: "timestamp" },
	},
	additionalProperties: false,
};

const validate = ajv.compile(schema);

const createParty = async (info: NewParty): Promise<string> => {
	const session = await auth();

	if (!session?.user) {
		throw new Error("Not authenticated");
	}

	const createdBy = session.user.name;
	if (!createdBy) {
		console.error(
			"Missing user name in session for user:",
			JSON.stringify(session.user)
		);
	}

	const values = { ...info, createdBy: createdBy ?? "Auth user" };

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
