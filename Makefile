TAG_NAME = kirillbobykin/hakeshonassybot

release:
	docker build . -t ${TAG_NAME}

push:
	docker push ${TAG_NAME}

provision-prod:
	prod/provision.sh

deploy-prod:
	prod/deploy.sh
	
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
