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
