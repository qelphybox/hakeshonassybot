TAG_NAME=kirillbobykin/hakeshonassybot
VERSION=$(shell git rev-parse --short HEAD)
IMAGE_TAG=$(TAG_NAME):$(VERSION)
IMAGE_TAG_LATEST=$(TAG_NAME):lastest
DOCKER_USERNAME=kirillbobykin

COMPOSE_RUN=docker-compose run --rm

workdir:
	$(COMPOSE_RUN) bot sh

migrate:
	$(COMPOSE_RUN) bot npm run migrate
dev:
	docker-compose up

dev-down:
	docker-compose down

dev-down-v:
	docker-compose down -v

dev-build:
	docker-compose build

dev-setup:
	docker-compose run --rm api npm install

dev-reset: dev-down-v dev-build dev-setup

test:
	$(COMPOSE_RUN) -e MONGO_DB_NAME=hakeshonassydb_test bot npm test

setup_test:
	$(COMPOSE_RUN) -e MONGO_DB_NAME=hakeshonassydb_test bot npm run migrate

lint:
	$(COMPOSE_RUN) --no-deps bot npm run lint

lint-fix:
	$(COMPOSE_RUN) --no-deps bot npm run lint:fix

test-coverage:
	$(COMPOSE_RUN) bot npx jest --coverage

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

docker-run-image:
	docker run -it --rm $(IMAGE_TAG) sh

docker-release: docker-build docker-push
docker-release-latest: docker-release docker-tag-latest docker-push-latest
