"""
Script reads the file games_in.txt and adds the results to the database by making POST requests to
the backend.
"""
import requests
import json
import concurrent.futures
import secrets

URL = "http://localhost:8000/api/add_result/"
# URL = "https://elo-calculator.northeurope.cloudapp.azure.com/api/add_result/"


def post_result(game):
    game = game.strip()
    if not game:
        return
    winner, loser = game.split("-")
    sport = "Ping pong"

    data = {
        "winner": winner,
        "loser": loser,
        "sport": sport,
        "submitter": "palisuli"
    }
    headers = {
        "Authorization": f"Bearer {secrets.bearer_token}",
    }
    requests.post(URL, data=json.dumps(data), headers=headers)


def run():
    with open("games_in.txt", "r") as f:
        games = f.readlines()
        for game in games:
            post_result(game)


if __name__ == "__main__":
    run()
