CONTAINER_DB_NAME = postgres-db
DB_NAME = pick_and_roll

up-dev:
	make init-db
	make init-server-dev

build:
	docker compose build server-dev

down:
	docker compose down

init-db:
# Start the database container in detached mode (-d)
	docker compose up -d $(CONTAINER_DB_NAME)

init-server-dev:
# Start the dev server container
	docker compose up -d server-dev
