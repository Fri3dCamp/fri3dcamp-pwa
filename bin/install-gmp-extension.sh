#!/usr/bin/env bash

# Get name of the wordpress container (not the test container)
CONTAINER_NAME=$(docker ps -f name=-wordpress -q | tail -n1 | xargs docker inspect | jq -r '.[0].Name')

# Grab it manually from `docker ps -f name=-wordpress` if not working.

# Install prereqs & gmp extension
docker exec "$CONTAINER_NAME" apt-get update -y \
	&& docker exec "$CONTAINER_NAME" apt-get -y install libgmp-dev \
	&& docker exec "$CONTAINER_NAME" docker-php-ext-install gmp \
	&& docker restart "$CONTAINER_NAME"

# Verify that the extension is installed:
docker exec "$CONTAINER_NAME" php -i | grep gmp
