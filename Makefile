.PHONY: dev test lint deploy migrate seed

dev:
	nodemon app.js

test:
	jest --coverage

lint:
	eslint . --fix

migrate:
	knex migrate:latest

seed:
	node scripts/seed.js

deploy:
	helm upgrade --install ticketflow ./charts/ticketflow
