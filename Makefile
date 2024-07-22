db-generate-migrations:
	./node_modules/.bin/drizzle-kit generate

db-migrate:
	npm run db:migrate