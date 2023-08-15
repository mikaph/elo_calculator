build-fastapi:
	docker build -t fastapi-app -f Dockerfile.FastAPI .

fastapi: build-fastapi
	docker run --rm -p 8000:8000 fastapi-app

build-react:
	docker build -t react-app -f Dockerfile.React .

react: build-react
	docker run --rm -p 80:80 react-app

build-flake8:
	docker build -t flake8:latest -f Dockerfile.flake8 .

flake8: build-flake8
	docker run --rm -v $(shell pwd):/app:ro flake8 backend/*.py
