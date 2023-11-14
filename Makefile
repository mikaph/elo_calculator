fastapi:
	docker buildx build --platform linux/amd64 -t tommipoiko/palisuli:fastapi -f Dockerfile.FastAPI --push .

react:
	docker buildx build --platform linux/amd64 -t tommipoiko/palisuli:react -f Dockerfile.React --push .

production: flake8 eslint fastapi react

build-flake8:
	docker build -t flake8:latest -f Dockerfile.flake8 .

flake8: build-flake8
	docker run --rm -v $(shell pwd)/backend:/backend:ro flake8 /backend

build-eslint:
	docker build -t eslint:latest -f Dockerfile.eslint .

eslint: build-eslint
	docker run --rm -v $(shell pwd)/frontend:/frontend:ro eslint /frontend

mysql:
	docker run --rm -v $(shell pwd)/db:/var/lib/mysql --name db -e MYSQL_ROOT_PASSWORD=root -p 3306:3306 -d mysql:8

stop-mysql:
	docker stop db
