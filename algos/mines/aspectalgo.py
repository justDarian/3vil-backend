class AspectAlgo:
    def __init__(self, history, tiles):
        self.max_tiles = tiles
        self.history = history

    def predict(self):
        x = [loc for game in self.history for loc in game['mineLocations'][:self.max_tiles]]
        y = [loc for game in self.history for loc in game['uncoveredLocations'][:self.max_tiles]]
        
        board = [0] * 25
        for i in range(self.max_tiles):
            board[min(abs(x[i] - y[i]), 24)] = 1
        
        org_board = board[:]
        
        board = ["✅" if tile == 2 else "💣" if tile == 1 else "⬜" for tile in board]
        board_str = "<br>".join("".join(board[i:i + 5]) for i in range(0, 25, 5))
        
        return board_str, None, org_board

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
algo = AspectAlgo(new_history, safe_spots)
response = algo.predict()
print(json.dumps(response, indent=4))
