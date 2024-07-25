"use server";

import db from "@/db/connection";
import { Party, parties } from "@/db/schema/parties";

interface NewParty {
	createdBy: Party["createdBy"];
	description: Party["description"];
	end: Party["end"];
	hosts: Party["hosts"];
	name: Party["name"];
	start: Party["start"];
}

const createParty = async (info: NewParty): Promise<string> => {
	const result = await db.insert(parties).values(info).returning();

	return result[0].shortId;
};

export default createParty;
