import { drizzle } from "drizzle-orm/postgres-js";
import { dish } from "@/db/schema/dish";
import { party } from "@/db/schema/party";
import postgres from "postgres";

const client = postgres();

const db = drizzle(client, { schema: { ...dish, ...party } });

export default db;
