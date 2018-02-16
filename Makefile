build:
	docker build $(CONSTRAINT) --build-arg BUILD_ENV=$(ENV) --label env=$(ENV) -t web-frontend -t web-frontend -f docker/Dockerfile .

rebuild:
	docker build --no-cache=true $(CONSTRAINT) --build-arg BUILD_ENV=$(ENV) --label env=$(ENV) -t web-frontend -f docker/Dockerfile .

launch:
	docker run --name front_end_1 -p $(LOCAL_PORT):80 -d web-frontend

# Remove all stopped containers
docker_clean_containers:
	docker rm $(docker ps -a | grep Exited | awk '{print $1}')

# Remove all untagged images
docker_clean_images:
	docker rmi $(docker images -q --filter "dangling=true")

# Stop and remove all containers
docker_stop_and_remove:
	docker rm -f $(docker ps -a -q)

# Push to registry (currently available at 34.212.90.12)
push:
ifndef REGISTRY_SERVER
	$(eval REGISTRY_SERVER=34.212.90.12:5000)
endif
	docker tag web-frontend $(REGISTRY_SERVER)/web-frontend
	docker push $(REGISTRY_SERVER)/web-frontend

