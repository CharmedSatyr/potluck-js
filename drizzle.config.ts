import { defineConfig } from "drizzle-kit";

export default defineConfig({
	dialect: "postgresql",
	schema: "./src/db/schema/*.ts",
	out: "./src/db/migrations",
	dbCredentials: {
		user: process.env.DATABASE_USER,
		password: process.env.DATABASE_PASSWORD,
		host: process.env.DATABASE_HOST!,
		port: Number(process.env.DATABASE_PORT),
		database: process.env.DATABASE_NAME!,
	},
});
