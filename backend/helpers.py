from data_types import PlayerData
from csv import DictReader

def get_last_10(last10: str) -> list[int, int]:
    wins = 0
    for g in last10:
        if g == "w":
            wins += 1
    return [wins, 10 - wins]

def get_statistics(sport_name: str) -> list[PlayerData]:
    ret = []
    try:
        with open(f"statistics/{sport_name}.csv", newline='') as csvfile:
            rdr = DictReader(csvfile)
            for r in rdr:
                name = r["name"]
                elo = r["elo"]
                wins = int(r["wins"])
                losses = int(r["losses"])
                winpercent = round(wins / (wins + losses) * 100, 1)
                winloss = f"{wins}-{losses}"
                last10games = get_last_10(r["last10"])
                last10winpercent = round(last10games[0] / (last10games[0] + last10games[1]) * 100, 1)
                last10winloss = f"{last10games[0]}-{last10games[1]}"
                ret.append(PlayerData(
                    name=name,
                    elo=elo,
                    winpercent=winpercent,
                    winloss=winloss,
                    last10winpercent=last10winpercent,
                    last10winloss=last10winloss
                ))
    except Exception as e:
        print(e)
    finally:
        return ret

def get_sports() -> list[str]:
    ret = []
    with open(f"statistics/sports.csv", newline='') as csvfile:
        rdr = DictReader(csvfile)
        for r in rdr:
            ret.append(r["name"])
        return ret
