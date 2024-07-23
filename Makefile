db-generate:
	npm run db:generate

db-migrate:
	npm run db:migrate

db-down:
	docker compose down

db-up:
	docker compose up --build -d

db-rebuild:
	$(MAKE) db-down
	$(MAKE) db-up

sql:
	docker exec -it potluck-js-db-1 psql postgres://potluck:password@127.0.0.1:5432/potluck