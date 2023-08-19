fastapi:
	docker buildx build --platform linux/amd64,linux/arm64 -t tommipoiko/palisuli:fastapi -f Dockerfile.FastAPI --push .

react:
	docker buildx build --platform linux/amd64,linux/arm64 -t tommipoiko/palisuli:react -f Dockerfile.React --push .

release: fastapi react

build-flake8:
	docker build -t flake8:latest -f Dockerfile.flake8 .

flake8: build-flake8
	docker run --rm -v $(shell pwd):/app:ro flake8 backend/*.py
