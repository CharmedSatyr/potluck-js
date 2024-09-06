import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { parties } from "@/db/schema/parties";
import { config } from "@/db/config";
import { commitment } from "./schema/commitment";
import { foodPlan } from "./schema/food-plan";

const sql = neon(config.connectionString);

const schema = {
	parties,
	commitment,
	foodPlan,
};

const db = drizzle(sql, { schema });

export default db;
