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


class NewSport(BaseModel):
    sport: str
    filename: str


class Game(BaseModel):
    winner: str
    loser: str
    time: str


class Credentials(BaseModel):
    username: str
    password: str


class DBUser(BaseModel):
    username: str
    hashed_password: str

class Token(BaseModel):
    token: str
    username: str
