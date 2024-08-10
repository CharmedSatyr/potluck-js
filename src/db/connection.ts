import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { dishes } from "@/db/schema/dishes";
import { parties } from "@/db/schema/parties";
import { config } from "@/db/config";

const sql = neon(config.connectionString);

const schema = {
	dishes,
	parties,
};

const db = drizzle(sql, { schema });

export default db;
