from datetime import datetime
from database import Sports, session, Players, RecentGames, Statistics
from data_types import PlayerData, Result, NewSport, Game
import elocalculator


def get_last_10(last10: str) -> list[int, int]:
    wins = 0
    for g in last10:
        if g == "w":
            wins += 1
    return [wins, len(last10) - wins]


def get_leaderboard(sport_name: str) -> list[PlayerData]:
    ret = []
    statistics = session.query(Statistics).filter_by(sport=sport_name)
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


def get_sports() -> list[str]:
    ret = []
    sports = session.query(Sports)
    for s in sports:
        ret.append(s.name)
    return ret


def get_players(sport_name: str) -> list[str]:
    ret = []
    players = session.query(Players).filter_by(sport=sport_name)
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


def add_player(sport: str, player: str):
    name = player
    sport = sport
    p = Players(name=name, sport=sport)
    p.save()


def add_result(result: Result):
    sport = result.sport
    winner = result.winner
    loser = result.loser
    time = str(datetime.now())
    submitter = result.submitter

    w = session.query(Statistics).filter_by(sport=sport, name=winner).one_or_none()
    if not w:
        w = Statistics(sport=sport, name=winner, elo=1000, wins=0, losses=0, last10="")
        add_player(sport, winner)
    w.wins += 1
    w.last10 = handle_recent_win(w.last10)

    l = session.query(Statistics).filter_by(sport=sport, name=loser).one_or_none()
    if not l:
        l = Statistics(sport=sport, name=loser, elo=1000, wins=0, losses=0, last10="")
        add_player(sport, loser)
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

    w.save()
    l.save()

    recent_game = RecentGames(sport=sport, winner=winner, loser=loser, time=time, submitter=submitter, elochange_winner=diff_w_elo, elochange_loser=diff_l_elo)
    recent_game.save()


def delete_result(id: int):
    result = session.query(RecentGames).filter_by(id=id).first()

    winner = result.winner
    loser = result.loser

    w_obj = session.query(Statistics).filter_by(name=winner).first()
    w_obj.elo -= result.elochange_winner
    w_obj.wins -= 1
    w_obj.last10 = w_obj.last10[:-1]

    l_obj = session.query(Statistics).filter_by(name=loser).first()
    l_obj.elo -= result.elochange_loser
    l_obj.losses -= 1
    l_obj.last10 = l_obj.last10[:-1]

    w_obj.save()
    l_obj.save()

    session.delete(result)
    session.commit()


def add_sport(new_sport: NewSport):
    sport = new_sport.sport
    s = Sports(name=sport)
    s.save()


def get_recent_games(sport_name: str) -> list[Game]:
    ret = []
    row_amount = 0
    maximum_amount_returned = 20
    recent_games = session.query(RecentGames).filter_by(sport=sport_name)
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
