from fastapi import FastAPI
from data_types import PlayerData
import helpers

app = FastAPI()

@app.get("/hello")
async def hello():
    return {"message": "Hello Ping Pong players"}

@app.get("/leaderboard/{sport_name}")
async def get_leaderboard(sport_name: str) -> list[PlayerData]:
    return helpers.get_statistics(sport_name)

@app.get("/sports")
async def get_leaderboard() -> list[str]:
    return helpers.get_sports()
