export const config = {
	user: process.env.DATABASE_USER!,
	password: process.env.DATABASE_PASSWORD!,
	host: process.env.DATABASE_HOST!,
	port: Number(process.env.DATABASE_PORT!),
	database: process.env.DATABASE_NAME!,
};

export const connectionString = `postgres://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}`;
