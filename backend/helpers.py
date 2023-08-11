from datetime import datetime
from data_types import PlayerData, Player, Result, NewSport, Game
from csv import DictReader, writer, DictWriter
import elocalculator
from pathlib import Path


def get_last_10(last10: str) -> list[int, int]:
    wins = 0
    for g in last10:
        if g == "w":
            wins += 1
    return [wins, len(last10) - wins]


def get_leaderboard(sport_name: str) -> list[PlayerData]:
    ret = []
    try:
        with open(f"data/{sport_name}.csv", newline='') as csvfile:
            rdr = DictReader(csvfile)
            for r in rdr:
                name = r["name"]
                elo = r["elo"]
                wins = int(r["wins"])
                losses = int(r["losses"])
                if wins > 0 and losses == 0:
                    winpercent = 100
                elif wins == 0 and losses == 0:
                    winpercent = 0
                else:
                    winpercent = round(wins / (wins + losses) * 100, 1)
                winloss = f"{wins}-{losses}"
                last10games = get_last_10(r["last10"])
                if last10games[0] > 0 and last10games[1] == 0:
                    last10winpercent = 100
                elif last10games[0] == 0 and last10games[1] == 0:
                    last10winpercent = 0
                else:
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
    with open(f"data/sports.csv", newline='') as csvfile:
        rdr = DictReader(csvfile)
        for r in rdr:
            ret.append(r["name"])
        return ret


def get_players(sport_name: str) -> list[str]:
    ret = []
    with open(f"data/players.csv", newline='') as csvfile:
        rdr = DictReader(csvfile)
        for r in rdr:
            if r["sport"] == sport_name:
                ret.append(r["name"])
        return ret


def add_player(player: Player):
    name = player.name
    sport = player.sport
    with open(f"data/{sport}.csv", "a") as csvfile:
        wrtr = writer(csvfile, delimiter=",")
        wrtr.writerow([name, 1000, 0, 0, None])


def handle_recent_win(r: dict) -> dict:
    last10 = r["last10"]
    last10 += "w"
    if len(last10) > 10:
        last10 = last10[1:]
    r["last10"] = last10
    return r


def handle_recent_loss(r: dict) -> dict:
    last10 = r["last10"]
    last10 += "l"
    if len(last10) > 10:
        last10 = last10[1:]
    r["last10"] = last10
    return r


def add_player_to_list(sport: str, player: str):
    with open("data/players.csv", "a") as csvfile:
        wrtr = writer(csvfile, delimiter=",")
        wrtr.writerow([sport, player])


def add_result(result: Result):
    sport = result.sport
    winner = result.winner
    loser = result.loser
    time = str(datetime.now())
    stats = []
    winner_found = False
    loser_found = False
    w_elo = 1000
    l_elo = 1000
    with open(f"data/{sport}.csv", newline='') as csvfile:
        rdr = DictReader(csvfile)
        for r in rdr:
            if r["name"] == winner:
                winner_found = True
                r["wins"] = int(r["wins"]) + 1
                r = handle_recent_win(r)
                w_elo = int(r["elo"])
            elif r["name"] == loser:
                loser_found = True
                r["losses"] = int(r["losses"]) + 1
                r = handle_recent_loss(r)
                l_elo = int(r["elo"])
            stats.append(r)
    if not winner_found:
        stats.append({
            "name": winner,
            "elo": 1000,
            "wins": 1,
            "losses": 0,
            "last10": "w"
        })
        add_player_to_list(sport, winner)
    if not loser_found:
        stats.append({
            "name": loser,
            "elo": 1000,
            "wins": 0,
            "losses": 1,
            "last10": "l"
        })
        add_player_to_list(sport, loser)
    w = elocalculator.Player(name=winner, elo=w_elo)
    l = elocalculator.Player(name=loser, elo=l_elo)
    elocalculator.set_new_elos(w, l)
    for s in stats:
        if s["name"] == winner:
            s["elo"] = w.elo
        elif s["name"] == loser:
            s["elo"] = l.elo
    with open(f"data/{sport}.csv", "w", newline='') as csvfile:
        fieldnames = stats[0].keys()
        wrtr = DictWriter(csvfile, fieldnames=fieldnames)
        wrtr.writeheader()
        for s in stats:
            wrtr.writerow(s)
    with open("data/recent_games.csv", "a") as csvfile:
        wrtr = writer(csvfile, delimiter=",")
        wrtr.writerow([sport, winner, loser, time])


def add_sport(new_sport: NewSport):
    sport = new_sport.sport
    filename = new_sport.filename
    with open(f"data/sports.csv", "a", newline='') as csvfile:
        wrtr = writer(csvfile, delimiter=",")
        wrtr.writerow([sport])
    f = Path(f"data/{filename}.csv")
    if not f.is_file():
        with open(f"data/{filename}.csv", "w") as csvfile:
            wrtr = writer(csvfile, delimiter=",")
            wrtr.writerow(["name", "elo", "wins", "losses", "last10"])


def get_recent_games(sport_name: str) -> list[Game]:
    ret = []
    row_amount = 0
    maximum_amount_returned = 20
    try:
        with open(f"data/recent_games.csv", newline='') as csvfile:
            rdr = DictReader(csvfile)
            for r in rdr:
                sport = r["sport"]
                if sport != sport_name:
                    continue
                winner = r["winner"]
                loser = r["loser"]
                time = datetime.strptime(r["time"], "%Y-%m-%d %H:%M:%S.%f")
                time = datetime.strftime(time, "%d-%m-%Y %H:%M:%S")
                ret.append(Game(
                    winner=winner,
                    loser=loser,
                    time=time
                ))
                row_amount += 1
                if row_amount == maximum_amount_returned:
                    break
    except Exception as e:
        print(e)
    finally:
        return ret
