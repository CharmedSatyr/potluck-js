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
	console.log("Creating party...");
	const result = await db.insert(party).values(info);
	console.log(result);
};

export default createParty;
