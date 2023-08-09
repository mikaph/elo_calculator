from pydantic import BaseModel

class PlayerData(BaseModel):
    name: str
    elo: int
    winpercent: float
    winloss: str
    last10winpercent: float
    last10winloss: str
