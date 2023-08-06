import unittest
import random
from elocalculator import Player, get_new_elos, set_new_elos


class TestEloAlgorithm(unittest.TestCase):

    def test_simply_getting_elo(self):
        """
        winner should get elo and loser should lose elo
        """
        elos_to_test = [-2000, -100, -20, 1, 0, 1, 10, 100, 2000]

        for loser_old_elo in elos_to_test:
            for winner_old_elo in elos_to_test:
                winner_new_elo, loser_new_elo = get_new_elos(Player(name="winner", elo=winner_old_elo),
                                                             Player(name="loser", elo=loser_old_elo))
                self.assertLessEqual(loser_new_elo - loser_old_elo, winner_new_elo - winner_old_elo)
                self.assertLessEqual(loser_new_elo, loser_old_elo)
                self.assertGreaterEqual(winner_new_elo, winner_old_elo)

    def test_elo_difference_effect(self):
        """
        If winner was favourite to win, based on elo, winner should get less elo
        and loser lose less elo. Opposite should also be true
        """

        elos_to_test = [400, 500, 600, 700, 800, 900, 1000, 1100, 1200]
        for i in range(len(elos_to_test)):
            winner_elo_changes = []
            loser_elo_changes = []
            for j in range(len(elos_to_test)):
                winner_new_elo, loser_new_elo = get_new_elos(Player(name="winner", elo=elos_to_test[i]),
                                                             Player(name="loser", elo=elos_to_test[j]))
                winner_elo_changes.append(winner_new_elo - elos_to_test[i])
                loser_elo_changes.append(loser_new_elo - elos_to_test[j])
            loser_elo_changes.reverse()
            self.assertEqual(winner_elo_changes, sorted(winner_elo_changes))
            self.assertEqual(loser_elo_changes, sorted(loser_elo_changes))

    def test_simple_series(self):
        """
        Two players with very different skill levels play multiple games.
        """
        better = Player(name="better", skill=10)
        worse = Player(name="worse", skill=3)

        for i in range(100):
            if better.skill + random.randint(0, 10) > worse.skill + random.randint(0, 10):
                set_new_elos(better, worse)
            else:
                set_new_elos(worse, better)
        self.assertGreater(better.elo, worse.elo)

    def test_group_series(self):
        """
        Multiple players play series of games to determine order of skills
        The players should be in skill order. Average elo should not decay or
        inflate too much

        TODO: remove debug prints when not needed anymore
        """
        NUM_GAMES_PER_PLAYER = 3000

        def simulate_game(p1, p2):
            p1_skill_roll = 0
            p2_skill_roll = 0

            while p1_skill_roll == p2_skill_roll:
                p1_skill_roll = random.randint(0, 10) + p1.skill
                p2_skill_roll = random.randint(0, 10) + p2.skill
            if p1_skill_roll > p2_skill_roll:
                return p1, p2
            else:
                return p2, p1

        players_list = [Player(name=str(x), skill=x, elo=1000) for x in range(10)]
        print(players_list)

        for player in players_list:
            for i in range(NUM_GAMES_PER_PLAYER):
                opponent = player
                while opponent.name == player.name:
                    opponent = random.choice(players_list)
                winner, loser = simulate_game(player, opponent)
                set_new_elos(winner, loser)
                winner.played_games += 1
                winner.won_games += 1
                loser.played_games += 1

        players_list.sort()
        for player in players_list:
            print(player)

        print(f"For some reason, winrate gives better indication of skill than the current elo algorithm.🤷")

        average_elo = sum([x.elo for x in players_list])/len(players_list)
        self.assertAlmostEqual(1000, average_elo, delta=100)
        print(f"average elo: {average_elo}")


if __name__ == '__main__':
    unittest.main()
