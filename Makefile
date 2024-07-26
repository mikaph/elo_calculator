silence-docker:
	export DOCKER_CLI_HINTS=false

fastapi:
	docker buildx build --platform linux/amd64 -t tommipoiko/palisuli:fastapi -f backend/Dockerfile --push backend

react:
	docker buildx build --platform linux/amd64 -t tommipoiko/palisuli:react -f frontend/Dockerfile --push frontend

production: flake8 eslint fastapi react

build-flake8: silence-docker
	docker build -t flake8:latest -f Dockerfile.flake8 .

flake8: build-flake8
	docker run --rm -v $(shell pwd)/backend:/backend:ro flake8 /backend

build-eslint: silence-docker
	docker build -t eslint:latest -f Dockerfile.eslint .

eslint: build-eslint
	docker run --rm -v $(shell pwd)/frontend:/frontend:ro eslint /frontend

mysql:
	docker run --rm -v $(shell pwd)/db:/var/lib/mysql --name db -e MYSQL_ROOT_PASSWORD=root -p 3306:3306 -d mysql:8

stop-mysql:
	docker stop db
