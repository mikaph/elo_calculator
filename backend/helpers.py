from datetime import datetime
from database import Sports, Players, RecentGames, Statistics
from data_types import PlayerData, Result, NewSport, Game
import elocalculator
from sqlalchemy.orm import Session


def get_last_10(last10: str) -> list[int, int]:
    wins = 0
    for g in last10:
        if g == "w":
            wins += 1
    return [wins, len(last10) - wins]


def get_leaderboard(db: Session, sport_name: str) -> list[PlayerData]:
    ret = []
    statistics = db.query(Statistics).filter_by(sport=sport_name).all()
    for s in statistics:
        name = s.name
        elo = s.elo
        wins = s.wins
        losses = s.losses
        if wins > 0 and losses == 0:
            winpercent = 100
        elif wins == 0 and losses == 0:
            winpercent = 0
        else:
            winpercent = round(wins / (wins + losses) * 100, 1)
        winloss = f"{wins}-{losses}"
        last10games = get_last_10(s.last10)
        if last10games[0] > 0 and last10games[1] == 0:
            last10winpercent = 100
        elif last10games[0] == 0 and last10games[1] == 0:
            last10winpercent = 0
        else:
            last10winpercent = round(
                last10games[0] / (last10games[0] + last10games[1]) * 100,
                1)
        last10winloss = f"{last10games[0]}-{last10games[1]}"
        ret.append(PlayerData(
            name=name,
            elo=elo,
            winpercent=winpercent,
            winloss=winloss,
            last10winpercent=last10winpercent,
            last10winloss=last10winloss
        ))
    return ret


def get_sports(db: Session) -> list[str]:
    ret = []
    sports = db.query(Sports).all()
    for s in sports:
        ret.append(s.name)
    return ret


def get_players(db: Session, sport_name: str) -> list[str]:
    ret = []
    players = db.query(Players).filter_by(sport=sport_name).all()
    for p in players:
        ret.append(p.name)
    return ret


def handle_recent_win(last10: str) -> str:
    last10 += "w"
    if len(last10) > 10:
        last10 = last10[1:]
    return last10


def handle_recent_loss(last10: str) -> str:
    last10 += "l"
    if len(last10) > 10:
        last10 = last10[1:]
    return last10


def add_player(db: Session, sport: str, player: str):
    name = player
    sport = sport
    p = Players(name=name, sport=sport)
    db.add(p)
    db.commit()


def add_result(db: Session, result: Result):
    sport = result.sport
    winner = result.winner
    loser = result.loser
    time = str(datetime.now())
    submitter = result.submitter

    w = db.query(Statistics).filter_by(sport=sport, name=winner).one_or_none()
    if not w:
        w = Statistics(sport=sport, name=winner, elo=1000, wins=0, losses=0, last10="")
        add_player(db, sport, winner)
        db.add(w)
    w.wins += 1
    w.last10 = handle_recent_win(w.last10)

    l = db.query(Statistics).filter_by(sport=sport, name=loser).one_or_none()
    if not l:
        l = Statistics(sport=sport, name=loser, elo=1000, wins=0, losses=0, last10="")
        add_player(db, sport, loser)
        db.add(l)
    l.losses += 1
    l.last10 = handle_recent_loss(l.last10)

    start_w_elo = w.elo
    start_l_elo = l.elo

    w_elocalc = elocalculator.Player(name=winner, elo=w.elo)
    l_elocalc = elocalculator.Player(name=loser, elo=l.elo)
    elocalculator.set_new_elos(w_elocalc, l_elocalc)
    w.elo = w_elocalc.elo
    l.elo = l_elocalc.elo

    diff_w_elo = w.elo - start_w_elo
    diff_l_elo = l.elo - start_l_elo

    recent_game = RecentGames(sport=sport, winner=winner, loser=loser, time=time, submitter=submitter, elochange_winner=diff_w_elo, elochange_loser=diff_l_elo)
    db.add(recent_game)
    db.commit()


def delete_result(db: Session, id: int):
    result = db.query(RecentGames).filter_by(id=id).one_or_none()

    winner = result.winner
    loser = result.loser
    sport = result.sport

    w_obj = db.query(Statistics).filter_by(name=winner, sport=sport).one_or_none()
    w_obj.elo -= result.elochange_winner
    w_obj.wins -= 1
    w_obj.last10 = w_obj.last10[:-1]

    l_obj = db.query(Statistics).filter_by(name=loser, sport=sport).one_or_none()
    l_obj.elo -= result.elochange_loser
    l_obj.losses -= 1
    l_obj.last10 = l_obj.last10[:-1]

    if w_obj.wins + w_obj.losses == 0:
        db.delete(w_obj)
        w_plr = db.query(Players).filter_by(name=winner, sport=sport).one_or_none()
        db.delete(w_plr)
    if l_obj.wins + l_obj.losses == 0:
        db.delete(l_obj)
        l_plr = db.query(Players).filter_by(name=loser, sport=sport).one_or_none()
        db.delete(l_plr)
    db.delete(result)
    db.commit()


def add_sport(db: Session, new_sport: NewSport):
    sport = new_sport.sport
    s = Sports(name=sport)
    db.add(s)
    db.commit()


def get_recent_games(db: Session, sport_name: str) -> list[Game]:
    ret = []
    row_amount = 0
    maximum_amount_returned = 20
    recent_games = db.query(RecentGames).filter_by(sport=sport_name).order_by(RecentGames.time.desc()).all()
    for g in recent_games:
        id = g.id
        winner = g.winner
        loser = g.loser
        submitter = g.submitter
        time = datetime.strptime(g.time, "%Y-%m-%d %H:%M:%S.%f")
        time = datetime.strftime(time, "%d-%m-%Y %H:%M:%S")
        ret.append(Game(
            id=id,
            winner=winner,
            loser=loser,
            time=time,
            submitter=submitter
        ))
        row_amount += 1
        if row_amount == maximum_amount_returned:
            break
    return ret
