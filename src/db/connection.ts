import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { dish } from "@/db/schema/dish";
import { party } from "@/db/schema/party";

import { config } from "@/db/config";

const pool = new Pool(config);

const schema = {
	dish,
	party,
};

const db = drizzle(pool, { schema });

export default db;
