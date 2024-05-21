FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
COPY ./src /app/backend/src
COPY ./.env /app/backend/.env
COPY ./requirements.txt /app/backend/requirements.txt
WORKDIR /app/backend
RUN pip install --no-cache-dir --upgrade pip
RUN pip install --no-cache-dir --upgrade -r requirements.txt
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
