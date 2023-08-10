from fastapi import FastAPI
from data_types import PlayerData, Result
import helpers


app = FastAPI()


@app.get("/leaderboard/{sport_name}")
async def get_leaderboard(sport_name: str) -> list[PlayerData]:
    return helpers.get_statistics(sport_name)


@app.get("/sports")
async def get_sports() -> list[str]:
    return helpers.get_sports()


@app.post("/add_result/")
async def add_result(result: Result):
    try:
        helpers.add_result(result)
        return True
    except Exception as e:
        print(e)
        return False
