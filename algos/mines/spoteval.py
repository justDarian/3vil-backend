import numpy as np

class SpotEval:
    def __init__(self, history, tiles):
        self.max_tiles = tiles
        self.history = history

    def predict(self):
        history = self.history

        grid = [0] * 25  # Keep it as a 1D list
        distance_threshold = 2.0

        for x in range(5):
            for y in range(5):
                for rdc in history:
                    if (x, y) not in rdc['mineLocations'] and (x, y) not in rdc['uncoveredLocations']:
                        distances = []

                        for mx, my in rdc['mineLocations']:
                            distance = np.sqrt((x - mx) ** 2 + (y - my) ** 2)
                            distances.append(distance)

                        if distances:
                            average_distance = np.mean(distances)

                    if average_distance > distance_threshold:
                        grid[x * 5 + y] = 1  # Calculate the index for 1D list

        accuracy = None
        org_board = grid

        board = ["✅" if x == 1 else "💣" for x in grid]
        board_str = "<br>".join("".join(map(str, board[i:i + 5])) for i in range(0, len(board), 5))
        return board_str, accuracy, org_board
import sys
import tls_client
import json

session = tls_client.Session(
    client_identifier="safari_15_6_1"
)
request = session.get("https://api.bflip.com/games/mines/history?size=24&page=0", headers={'x-auth-token': sys.argv[1], "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1"})
history = request.json().get('data', [])
new_history = [{
    'mineLocations': d['mineLocations'],
    'uncoveredLocations': d['uncoveredLocations']
} for d in history]
safe_spots = int(sys.argv[2])
algo = SpotEval(new_history, safe_spots)
response = algo.predict()
print(json.dumps(response, indent=4))
