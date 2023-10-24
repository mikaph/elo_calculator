from dataclasses import dataclass
import logging

logger = logging.getLogger("Elocalculator")
logging.basicConfig(level=logging.INFO)

K_FACTOR = 50  # Maximum elo change per game
COUNT_WINRATE = True


@dataclass
class Player:
    name: str
    elo: int = 1000
    played_games: int = 0

    # for debug / testing
    skill: int = 0
    won_games: int = 0

    def __str__(self):
        if self.played_games:
            return f"{self.name} ({self.elo}) {self.played_games} games played with" \
                   f" {round(100 * (self.won_games / self.played_games))}% winrate"
        else:
            return f"{self.name} ({self.elo})"

    def __lt__(self, other):
        return self.elo < other.elo

    def change_elo(self, new_elo):
        self.elo = new_elo


def set_new_elos(winner: Player, loser: Player):
    winner_new_elo, loser_new_elo = get_new_elos(winner, loser)
    winner.change_elo(winner_new_elo)
    loser.change_elo(loser_new_elo)


def get_expected_score(winner_elo: int, loser_elo: int):
    return 1 / (1 + (10**((loser_elo - winner_elo) / 400)))


def get_K_factor(player: Player, opponent: Player):
    if player.played_games < 10:
        return K_FACTOR * 2
    elif opponent.played_games < 10:
        return 0
    else:
        return K_FACTOR


def get_new_elos(winner: Player, loser: Player):
    expected_score = get_expected_score(winner.elo, loser.elo)
    winner_new_elo = round(winner.elo + (1 - expected_score) * get_K_factor(winner, loser))
    loser_new_elo = round(loser.elo + (0 - 1 + expected_score) * get_K_factor(loser, winner))
    logger.debug(f"{winner.name} ({winner.elo} -> {winner_new_elo}) beat {loser.name} ({loser.elo} -> {loser_new_elo})")
    logger.debug(f"elo difference was {winner.elo - loser.elo} expected score was: {expected_score} "
                 f"loser elo change: {loser_new_elo - loser.elo} winner elo change: {winner_new_elo - winner.elo}")
    return winner_new_elo, loser_new_elo


if __name__ == "__main__":
    reading_initial_values = True
    players = {}

    with open("games_in.txt") as games_in:
        for line in games_in:
            if line.startswith('*'):
                reading_initial_values = False
                print("initial values:")
                for player in players.values():
                    print(player)
                continue
            if reading_initial_values:
                new_player = [x.strip().lower() for x in line.split(':')]
                players[new_player[0]] = Player(name=new_player[0], elo=1000)
            else:
                players_in_this_game = [x.strip().lower() for x in line.split('-')]
                game_winner = players[players_in_this_game[0]]
                game_loser = players[players_in_this_game[1]]

                new_elos = get_new_elos(winner=game_winner, loser=game_loser)
                players[game_winner.name].elo = new_elos[0]
                players[game_loser.name].elo = new_elos[1]

                if COUNT_WINRATE:
                    players[game_winner.name].played_games += 1
                    players[game_winner.name].won_games += 1
                    players[game_loser.name].played_games += 1

        print("****new ratings:*****")
        top_list = list(players.values())
        top_list.sort()
        top_list.reverse()
        for player in [x for x in top_list if x.played_games >= 10]:
            print(player)

        print("****players with less than 10 games:****")
        for player in [x for x in top_list if x.played_games < 10]:
            print(player)
