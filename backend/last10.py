from pprint import pprint

if __name__ == "__main__":
    last10 = dict()
    with open("games_in.txt") as games_in:
        for g in games_in:
            winner = g.split("-")[0].rstrip("\n")
            loser = g.split("-")[1].rstrip("\n")
            if winner not in last10:
                last10[winner] = "w"
            else:
                last10[winner] += "w"
                if len(last10[winner]) > 10:
                    last10[winner] = last10[winner][1:]
            if loser not in last10:
                last10[loser] = "l"
            else:
                last10[loser] += "l"
                if len(last10[loser]) > 10:
                    last10[loser] = last10[loser][1:]
    pprint(last10)
