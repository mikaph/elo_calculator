build-fastapi:
	docker build -t fastapi-app -f Dockerfile.FastAPI .

run-fastapi: build-fastapi
	docker run -p 8000:8000 fastapi-app

build-react:
	docker build -t react-app -f Dockerfile.React .

run-react: build-react
	docker run -p 80:80 react-app
