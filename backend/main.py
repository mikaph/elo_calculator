import secrets
from fastapi import Depends
from sqlalchemy.orm import Session
from database import SessionLocal
from fastapi import FastAPI
from data_types import PlayerData, Result, Game, Credentials, Token, NewSport
import helpers
from database import Base, engine, Sports
import login_helpers
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

with SessionLocal() as db:
    default_sport = db.query(Sports).filter_by(name="Ping pong").one_or_none()
    if not default_sport:
        db.add(Sports(name="Ping pong"))
        db.commit()

app = FastAPI()

origins = [
    "http://localhost:443",
    "http://localhost:80",
    "http://localhost:3000",
    "http://fe:443",
    "http://fe:80"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/api/leaderboard/{sport_name}")
async def get_leaderboard(sport_name: str, db: Session = Depends(get_db)) -> list[PlayerData]:
    return helpers.get_leaderboard(db, sport_name)


@app.get("/api/sports")
async def get_sports(db: Session = Depends(get_db)) -> list[str]:
    return helpers.get_sports(db)


@app.get("/api/players/{sport_name}")
async def get_players(sport_name: str, db: Session = Depends(get_db)) -> list[str]:
    return helpers.get_players(db, sport_name)


@app.get("/api/recent_games/{sport_name}")
async def get_recent_games(sport_name: str, db: Session = Depends(get_db)) -> list[Game]:
    return helpers.get_recent_games(db, sport_name)


@app.post("/api/add_result/")
async def add_result(result: Result, db: Session = Depends(get_db), token: str = Depends(login_helpers.get_token)) -> bool:
    try:
        helpers.add_result(db, result)
        return True
    except Exception as e:
        print(e)
        return False


@app.delete("/api/delete_result/{id}")
async def delete_result(id: int, db: Session = Depends(get_db), token: str = Depends(login_helpers.get_token)) -> bool:
    try:
        helpers.delete_result(db, id)
        return True
    except Exception as e:
        print(e)
        return False


@app.post("/api/add_sport/")
async def add_sport(new_sport: NewSport, db: Session = Depends(get_db), token: str = Depends(login_helpers.get_token)) -> bool:
    try:
        helpers.add_sport(db, new_sport)
        return True
    except Exception as e:
        print(e)
        return False


@app.post("/api/login/")
async def login(credentials: Credentials, db: Session = Depends(get_db)) -> Token | bool:
    db_user = login_helpers.get_user(db, credentials.username)
    if not db_user:
        return False
    elif not login_helpers.verify_password(credentials.password, db_user.hashed_password):
        return False
    else:
        access_token = login_helpers.create_access_token(data={"sub": db_user.username})
        return Token(token=access_token, username=db_user.username)


@app.post("/api/signup/")
async def signup(credentials: Credentials, db: Session = Depends(get_db)) -> Token | bool:
    existing_user = login_helpers.get_user(db, credentials.username)
    if existing_user:
        return False
    elif credentials.secret_key != secrets.secret_key:
        return False
    else:
        new_user = login_helpers.create_user(db, credentials)
        access_token = login_helpers.create_access_token(data={"sub": new_user})
        return Token(token=access_token, username=new_user)
