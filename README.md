To run the DB:
```shell
make mysql
```

To run the backend:
```shell
cd backend
pip install -r requirements.txt
uvicorn src.main:app --reload
```

To run the frontend:
```shell
cd frontend
npm install
npm start
```

This opens a browser in localhost:3000, data is fetched from localhost:8000.
