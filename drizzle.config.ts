import { defineConfig } from "drizzle-kit";
import { config } from "@/db/config";

export default defineConfig({
	dialect: "postgresql",
	schema: "@/db/schema/*.ts",
	out: "@/db/migrations",
	dbCredentials: config,
});
