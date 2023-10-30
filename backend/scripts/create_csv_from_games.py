"""
Creates a CSV file from games received by calling /api/all_games/ and merges it with the file
games_in.txt. Games in the file are marked as just 'winner-loser'.
"""
import requests

# URL = "http://localhost:8000/api/all_games/Ping%20pong"
URL = "https://elo-calculator.northeurope.cloudapp.azure.com/api/all_games/Ping%20pong"


def run():
    games = requests.get(URL).json()
    games = [f"{game['winner']}-{game['loser']}\n" for game in games]
    with open("games_in.txt", "r") as f:
        games_in = list(f.readlines())
        games = games + games_in
        with open("all_games.csv", "w") as f:
            f.writelines(games)


if __name__ == "__main__":
    run()
