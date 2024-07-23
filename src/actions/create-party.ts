"use server";

import db from "@/db/connection";
import { Party, party } from "@/db/schema/party";

interface NewParty {
	createdBy: Party["createdBy"];
	description: Party["description"];
	hosts: Party["hosts"];
	name: Party["name"];
}

const createParty = async (info: NewParty) => {
	const result = await db.insert(party).values(info).returning();

	return result[0].shortId;
};

export default createParty;
