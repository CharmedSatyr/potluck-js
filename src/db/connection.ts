import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { dishes } from "@/db/schema/dishes";
import { parties } from "@/db/schema/parties";
import { config } from "@/db/config";

const pool = new Pool(config);

const schema = {
	dishes,
	parties,
};

const db = drizzle(pool, { schema });

export default db;
