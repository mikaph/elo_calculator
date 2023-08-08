from fastapi import FastAPI
from data_types import PlayerData

app = FastAPI()

@app.get("/hello")
async def hello():
    return {"message": "Hello Ping Pong players"}

@app.get("/leaderboard/{sport_name}")
async def get_leaderboard(sport_name: str) -> list[PlayerData] | list[None]:
    if sport_name == "Ping pong":
        ret = [
            PlayerData(name="Tommi", elo=2000, wins=10, losses=2),
            PlayerData(name="Mika", elo=2500, wins=13, losses=2)
        ]
    else:
        ret = []

    return ret
