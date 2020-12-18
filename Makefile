TAG_NAME = kirillbobykin/hakeshonassybot
VERSION=$(shell git rev-parse --short HEAD)
IMAGE_TAG=$(TAG_NAME):$(VERSION)
IMAGE_TAG_LATEST=$(TAG_NAME):lastest
DOCKER_USERNAME=kirillbobykin

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

docker-build:
	docker build . -f prod.Dockerfile -t $(IMAGE_TAG)

docker-login:
	cat docker_password.txt | docker login --username $(DOCKER_USERNAME) --password-stdin

docker-login-ci:
	docker login --username $(DOCKER_USERNAME) --password $(DOCKER_PASSWORD)

docker-tag-latest:
	docker tag $(IMAGE_TAG) $(IMAGE_TAG_LATEST)

docker-push:
	docker push $(IMAGE_TAG)

docker-push-latest:
	docker push $(IMAGE_TAG_LATEST)

docker-release: docker-build docker-push
docker-release-latest: docker-release docker-tag-latest docker-push-latest
