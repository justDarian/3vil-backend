from collections import Counter

class RecentTrendPlus:
    def __init__(self, history, tiles):
        self.max_tiles = tiles
        self.history = history

    def predict(self):
        mine_locations = [location for entry in self.history for location in entry['mineLocations']]
        ground_truth = None

        mine_mapping = Counter(mine_locations)

        recent_spots = [location for location, _ in mine_mapping.most_common(self.max_tiles)]

        board = [1 if i in recent_spots else 0 for i in range(25)]
        board_str = "<br>".join("".join(["✅" if x == 1 else "💣" for x in board[i:i + 5]]) for i in range(0, len(board), 5))

        accuracy = None
        if ground_truth is not None:
            true_positives = len(set(recent_spots) & set(ground_truth))
            accuracy = true_positives / len(ground_truth) if ground_truth else 0.0

        return board_str, accuracy, board

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
algo = RecentTrendPlus(new_history, safe_spots)
response = algo.predict()
print(json.dumps(response, indent=4))
