export const config = {
	user: process.env.DATABASE_USER!,
	password: process.env.DATABASE_PASSWORD!,
	host: process.env.DATABASE_HOST!,
	port: Number(process.env.DATABASE_PORT!),
	database: process.env.DATABASE_NAME!,
	ssl: process.env.NODE_ENV ? process.env.NODE_ENV !== "development" : false,
};
