from fastapi import FastAPI, Depends
from data_types import PlayerData, Result, NewSport, Game, Credentials, Token
import helpers
from database import Base, Users, engine, session
import secrets
import login_helpers


app = FastAPI()


@app.on_event("startup")
async def startup():
    Base.metadata.create_all(bind=engine)
    default_user = session.query(Users).filter_by(username=secrets.username).one_or_none()
    if not default_user:
        default_user = Users(username=secrets.username, hashed_password=secrets.hashed_password)
        default_user.save()


@app.on_event("shutdown")
async def startup():
    pass


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
async def add_result(result: Result, token: str = Depends(login_helpers.get_token)) -> bool:
    try:
        helpers.add_result(result)
        return True
    except Exception as e:
        print(e)
        return False


@app.post("/add_sport/")
async def add_sport(new_sport: NewSport, token: str = Depends(login_helpers.get_token)) -> bool:
    try:
        helpers.add_sport(new_sport)
        return True
    except Exception as e:
        print(e)
        return False


@app.post("/login/")
async def login(credentials: Credentials) -> Token | bool:
    db_user = login_helpers.get_user(credentials.username)
    if not db_user:
        return False
    elif not login_helpers.verify_password(credentials.password, db_user.hashed_password):
        return False
    else:
        access_token = login_helpers.create_access_token(data={"sub": db_user.username})
        return {"token": access_token, "username": db_user.username}
