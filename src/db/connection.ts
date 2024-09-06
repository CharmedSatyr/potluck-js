import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { event } from "@/db/schema/event";
import { config } from "@/db/config";
import { commitment } from "./schema/commitment";
import { request } from "./schema/request";

const sql = neon(config.connectionString);

const schema = {
	commitment,
	event,
	request,
};

const db = drizzle(sql, { schema });

export default db;
