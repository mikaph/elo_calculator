from fastapi import FastAPI, Depends, HTTPException, Request
from data_types import PlayerData, Result, NewSport, Game, Credentials, Token
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
async def add_result(result: Result, token: str = Depends(helpers.get_token)) -> bool:
    try:
        helpers.add_result(result)
        return True
    except Exception as e:
        print(e)
        return False


@app.post("/add_sport/")
async def add_sport(new_sport: NewSport, token: str = Depends(helpers.get_token)) -> bool:
    try:
        helpers.add_sport(new_sport)
        return True
    except Exception as e:
        print(e)
        return False


@app.post("/login/")
async def login(credentials: Credentials) -> Token | bool:
    db_user = helpers.get_user(credentials.username)
    if not db_user:
        return False
    elif not helpers.verify_password(credentials.password, db_user.hashed_password):
        return False
    else:
        access_token = helpers.create_access_token(data={"sub": db_user.username})
        return {"token": access_token, "username": db_user.username}
