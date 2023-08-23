from fastapi import FastAPI, Depends
from data_types import PlayerData, Result, NewSport, Game, Credentials, Token
import helpers
from database import Base, Users, engine, session, Sports
import secrets
import login_helpers
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:443",
    "http://localhost:80",
    "https://localhost",
    "http://localhost",
    "https://localhost:3000",
    "http://localhost:3000",
    "http://fe:443",
    "http://fe:80",
    "https://fe",
    "http://fe"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.on_event("startup")
async def startup():
    Base.metadata.create_all(bind=engine)
    default_user = session.query(Users).filter_by(username=secrets.username).one_or_none()
    if not default_user:
        un = secrets.username
        pw = login_helpers.hash_password(secrets.password)
        ds = secrets.default_sport
        default_user = Users(username=un, hashed_password=pw, is_admin=True)
        default_user.save()
        default_sport = Sports(name=ds)
        default_sport.save()


@app.get("/api/leaderboard/{sport_name}")
async def get_leaderboard(sport_name: str) -> list[PlayerData]:
    return helpers.get_leaderboard(sport_name)


@app.get("/api/sports")
async def get_sports() -> list[str]:
    return helpers.get_sports()


@app.get("/api/players/{sport_name}")
async def get_players(sport_name: str) -> list[str]:
    return helpers.get_players(sport_name)


@app.get("/api/recent_games/{sport_name}")
async def get_recent_games(sport_name: str) -> list[Game]:
    return helpers.get_recent_games(sport_name)


@app.post("/api/add_result/")
async def add_result(result: Result, token: str = Depends(login_helpers.get_token)) -> bool:
    try:
        helpers.add_result(result)
        return True
    except Exception as e:
        print(e)
        return False


@app.delete("/api/delete_result/{id}")
async def delete_result(id: int, token: str = Depends(login_helpers.get_token)) -> bool:
    try:
        helpers.delete_result(id)
        return True
    except Exception as e:
        print(e)
        return False


@app.post("/api/add_sport/")
async def add_sport(new_sport: NewSport, token: str = Depends(login_helpers.get_token)) -> bool:
    try:
        helpers.add_sport(new_sport)
        return True
    except Exception as e:
        print(e)
        return False


@app.post("/api/login/")
async def login(credentials: Credentials) -> Token | bool:
    db_user = login_helpers.get_user(credentials.username)
    if not db_user:
        return False
    elif not login_helpers.verify_password(credentials.password, db_user.hashed_password):
        return False
    else:
        access_token = login_helpers.create_access_token(data={"sub": db_user.username})
        return Token(token=access_token, username=db_user.username)


@app.post("/api/signup/")
async def signup(credentials: Credentials) -> Token | bool:
    existing_user = login_helpers.get_user(credentials.username)
    if existing_user:
        return False
    else:
        hashed_pw = login_helpers.hash_password(credentials.password)
        new_user = Users(username=credentials.username, hashed_password=hashed_pw)
        new_user.save()
        access_token = login_helpers.create_access_token(data={"sub": new_user.username})
        return Token(token=access_token, username=new_user.username)
