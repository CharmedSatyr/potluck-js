"use server";

import db from "@/db/connection";
import { party } from "@/db/schema/party";

interface NewParty {
	createdBy: string;
	description?: string;
	hosts: string;
	name: string;
}

export const addParty = async (info: NewParty) => {
	await db.insert(party).values(info);
};
