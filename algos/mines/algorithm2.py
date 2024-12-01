import math

class Algorithm2:
    def __init__(self, history,tiles):
        self.max_tiles = tiles
        self.history = history
    @staticmethod
    def is_neighbor(pos1: int, pos2: int) -> bool:
        row1, col1 = divmod(pos1, 5)
        row2, col2 = divmod(pos2, 5)
        distance = math.sqrt((row2 - row1) ** 2 + (col2 - col1) ** 2)
        return False if distance >= 1 else True

    def predict(self):
        history = self.history
        maxv = 0
        board = [0] * 25
        x = [row for x in history for row in x['mineLocations']]
        for ind in range(25):
            if not Algorithm2.is_neighbor(x[ind], x[max(ind + 1, 24)]) and maxv < self.max_tiles:
                board[x[ind]] = 1
                maxv += 1
            elif maxv >= self.max_tiles:
                break
            else:
                pass
        org_board = board
        accuracy = None
        board = ["✅" if x == 1 else "💣" for x in board]
        board = "<br>".join("".join(map(str, board[i:i + 5])) for i in range(0, len(board), 5))
        return board, accuracy, org_board

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
algo = Algorithm2(new_history, safe_spots)
response = algo.predict()
print(json.dumps(response, indent=4))
