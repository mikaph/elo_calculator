from fastapi import FastAPI
from data_types import PlayerData, Result, NewSport, Game
import helpers


app = FastAPI()


@app.get("/leaderboard/{sport_name}")
async def get_leaderboard(sport_name: str) -> list[PlayerData]:
    return helpers.get_leaderboard(sport_name)


@app.get("/sports")
async def get_sports() -> list[str]:
    return helpers.get_sports()


@app.get("/players/{sport_name}")
async def get_players(sport_name: str) -> list[str]:
    return helpers.get_players(sport_name)


@app.get("/recent_games/{sport_name}")
async def get_recent_games(sport_name: str) -> list[Game]:
    return helpers.get_recent_games(sport_name)


@app.post("/add_result/")
async def add_result(result: Result) -> bool:
    try:
        helpers.add_result(result)
        return True
    except Exception as e:
        print(e)
        return False


@app.post("/add_sport/")
async def add_sport(new_sport: NewSport) -> bool:
    try:
        helpers.add_sport(new_sport)
        return True
    except Exception as e:
        print(e)
        return False
