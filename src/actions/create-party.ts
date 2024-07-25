"use server";

import db from "@/db/connection";
import { Party, parties } from "@/db/schema/parties";
import { redirect } from "next/navigation";

interface NewParty {
	createdBy: Party["createdBy"];
	description: Party["description"];
	end: Party["end"];
	hosts: Party["hosts"];
	name: Party["name"];
	start: Party["start"];
}

const createParty = async (info: NewParty) => {
	const result = await db.insert(parties).values(info).returning();

	redirect(`/party/${result[0].shortId}`);
};

export default createParty;
