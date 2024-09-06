import { defineConfig } from "drizzle-kit";
import { config } from "@/db/config";

export default defineConfig({
	dialect: "postgresql",
	schema: "./src/db/schema/**/*.ts",
	out: "./src/db/migrations/",
	dbCredentials: config,
});
