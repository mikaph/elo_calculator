from pydantic import BaseModel


class PlayerData(BaseModel):
    name: str
    elo: int
    winpercent: float
    winloss: str
    last10winpercent: float
    last10winloss: str


class Player(BaseModel):
    name: str
    sport: str


class Result(BaseModel):
    sport: str
    winner: str
    loser: str
    submitter: str


class NewSport(BaseModel):
    sport: str


class Game(BaseModel):
    id: int
    winner: str
    loser: str
    time: str
    submitter: str


class Credentials(BaseModel):
    username: str
    password: str


class DBUser(BaseModel):
    username: str
    hashed_password: str


class Token(BaseModel):
    token: str
    username: str
