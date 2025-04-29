CONTAINER_DB_NAME = postgres-db
DB_NAME = pick_and_roll

# Dev commands
up-dev:
	make init-db
	make init-client-dev
	make init-server-dev
build-dev:
	docker compose build --no-cache server-dev client-dev
init-server-dev:
# Start the dev server container
	docker compose up -d server-dev
init-client-dev:
	docker compose up -d client-dev

# Prod commands
up:
	make init-db
	make init-server
build:
	docker compose build --no-cache server
init-server:
	docker compose up -d server

# General commands
init-db:
# Start the database container in detached mode (-d)
	docker compose up -d $(CONTAINER_DB_NAME)
down:
	docker compose down
