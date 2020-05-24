TAG_NAME = kirillbobykin/hakeshonassybot

workdir:
	docker-compose run --rm bot sh

migrate:
	docker-compose run --rm bot npm run migrate
	
dev:
	docker-compose up

test:
	docker-compose run --rm -e MONGO_DB_NAME=hakeshonassydb_test bot npm test

setup_test:
	docker-compose run --rm -e MONGO_DB_NAME=hakeshonassydb_test bot npm run migrate

lint:
	docker-compose run --rm --no-deps bot npm run lint

lint-fix:
	docker-compose run --rm --no-deps bot npm run lint-fix

test-coverage:
	docker-compose run --rm bot npx jest --coverage
