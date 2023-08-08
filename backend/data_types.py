from pydantic import BaseModel

class PlayerData(BaseModel):
    name: str
    elo: int
    wins: int
    losses: int
