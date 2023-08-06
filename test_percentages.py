import random
from elocalculator import Player, get_new_elos,set_new_elos



def get_game_strength(skill_number):
    number = (10 + pow((skill_number/30),4) ) * random.randint(1, 100)

    return number


def play_a_game(p_one, p_two):
    p_one.played_games +=1
    p_two.played_games += 1
    if get_game_strength(p_one.skill) > get_game_strength(p_two.skill):
        set_new_elos(winner=p_one,loser=p_two)
    else:
        set_new_elos(winner=p_two,loser=p_one)

if __name__== "__main__":
    PELIMAARA = 1000
    player_list= [Player(name="Matti", elo=100, skill=10), Player(name="Kalle", elo=100, skill=43),
                  Player(name="Seppo", elo=100, skill=74), Player(name="Juhani", elo=100, skill=23),
                  Player(name="Marja", elo=100, skill=97), Player(name="Liisa", elo=100, skill=42),
                  Player(name="aa", elo=100, skill=7),Player(name="fsdf", elo=100, skill=53),
                  Player(name="VEVE", elo=100, skill=77),Player(name="sdfe", elo=100, skill=87),
                  Player(name="hjjytj", elo=100, skill=23),Player(name="sefsd", elo=100, skill=63),
                  Player(name="jtrbb", elo=100, skill=73),Player(name="sefseree", elo=100, skill=64),
                  Player(name="ERTERT", elo=100, skill=65),Player(name="thrhr", elo=100, skill=3)]

    try:
        for i in range(PELIMAARA):
            players=random.sample(player_list,2)
            play_a_game(players[0],players[1])
    except OverflowError as e:
        print(e)
        print(f"pelatut pelit yhteensä {i}")
    player_list.sort(reverse=True)
    yhtelo = 0
    for p in player_list:
        print(f"{p.name} ELO: {p.elo}, pelatut pelit: {p.played_games}")
        yhtelo +=p.elo
    keskielo = yhtelo/len(player_list)
    TEOREETTINEN_ELOMAX = len(player_list) * 100
    print(f"Keskimääräinen eloluku pelien jälkeen {keskielo }")
    print(f"Ylimääräinen ELO {yhtelo - TEOREETTINEN_ELOMAX}")
    print(f"Ylimääräinen ELO per peli {(yhtelo - TEOREETTINEN_ELOMAX)/PELIMAARA}")

