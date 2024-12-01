class SpotSpy2:
    def __init__(self, history, tiles):
        self.max_tiles = tiles
        self.history = history

    def predict(self):
        mineLocations = [y for x in self.history for y in x['mineLocations']][:self.max_tiles]
        uncoveredLocations = [y for x in self.history for y in x['uncoveredLocations']][:self.max_tiles]
        board = [0] * 25
        n = 0
        for i in range(self.max_tiles):
            mine = mineLocations[i] - 1
            spot = uncoveredLocations[i] - 1
            get_spot = min(abs(mine - spot),24)
            if board[get_spot] == 1:
                continue
            else:
                board[get_spot] = 1
                n += 1

        accuracy = len(set(mineLocations).intersection(set(uncoveredLocations))) / len(uncoveredLocations) if len(uncoveredLocations) > 0 else 0
        org_board = board[:]
        board = ["✅" if x == 1 else "💣" for x in board]
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
algo = SpotSpy2(new_history, safe_spots)
response = algo.predict()
print(json.dumps(response, indent=4))
