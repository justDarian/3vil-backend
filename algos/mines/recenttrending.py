class RecentTrend:
    def __init__(self, history,tiles):
        self.max_tiles = tiles
        self.history = history

    def predict(self):
        mineLocations = [y for x in self.history for y in x['mineLocations']]
        n = 0
        mine_mapping = {}
        for m in range(len(mineLocations)-1):
            if m in mine_mapping:
                mine_mapping[m] += 1
            else:
                mine_mapping[m] = 1
        recentSpots = sorted(mine_mapping,key=lambda x: mine_mapping[x],reverse=True)
        board = [1 if i in recentSpots[:self.max_tiles] else 0 for i in range(25)]
        accuracy = None
        org_board = board
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
algo = RecentTrend(new_history, safe_spots)
response = algo.predict()
print(json.dumps(response, indent=4))
