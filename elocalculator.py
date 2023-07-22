from dataclasses import dataclass


@dataclass
class Player:
    elo: int
    name:str
    
    def __lt__(self, other):
     return self.elo < other.elo
    
K_FACTOR = 40





def get_new_elos(winner: Player, loser: Player):
    expected_score = 1/(10**((winner.elo - loser.elo) / 400) + 1)
    winner_new_elo = round(winner.elo + (1 - expected_score)*K_FACTOR)
    loser_new_elo = round(loser.elo + (0 - expected_score)*K_FACTOR)
    print(f"{winner.name} ({winner.elo} -> {winner_new_elo}) beat {loser.name} ({loser.elo} -> {loser_new_elo})")
    print(f"elo difference was {winner.elo - loser.elo} expected score was: {expected_score} loser elo change: {loser_new_elo - loser.elo} winner elo change: {winner_new_elo - winner.elo}")
    return (winner_new_elo, loser_new_elo)

reading_initial_values = True
players = {}
   
with open("games_in.txt") as games_in:
    for line in games_in:
        if line.startswith('*'):
            reading_initial_values = False
            print(f"initial values:")
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
    
    print(f"new ratings:")
    top_list = list(players.values())
    top_list.sort()
    top_list.reverse()
    for player in top_list:
        print(player)
    
