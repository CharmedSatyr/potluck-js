import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { event } from "@/db/schema/event";
import { config } from "@/db/config";
import { commitment } from "@/db/schema/commitment";
import { slot } from "@/db/schema/slot";
import { account } from "@/db/schema/auth/account";
import { session } from "@/db/schema/auth/session";
import { user } from "@/db/schema/auth/user";

const sql = neon(config.connectionString);

const schema = {
	account,
	commitment,
	event,
	session,
	slot,
	user,
};

const db = drizzle(sql, { schema });

export default db;
