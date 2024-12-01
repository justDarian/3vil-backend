import numpy as np

class Probabilities:
    def __init__(self, history, tiles):
        self.history = history
        self.max_tiles= tiles

    def find_safe_spots(self):
        safe_tiles = set()

        for game in self.history:
            mine_locations = set(game['mineLocations'])
            uncovered_locations = set(game['uncoveredLocations'])
            
            for tile in uncovered_locations:
                neighbors = self.get_neighbors(tile)

                if all(neighbor in uncovered_locations or neighbor in mine_locations for neighbor in neighbors):
                    for neighbor in neighbors:
                        if neighbor not in mine_locations:
                            safe_tiles.add(neighbor)

        return list(safe_tiles)[:self.max_tiles]

    def get_neighbors(self, tile):
        row, col = divmod(tile, 5)
        neighbors = []

        for dr in [-1, 0, 1]:
            for dc in [-1, 0, 1]:
                if dr == 0 and dc == 0:
                    continue
                new_row = row + dr
                new_col = col + dc
                if 0 <= new_row < 5 and 0 <= new_col < 5:
                    neighbors.append(new_row * 5 + new_col)

        return neighbors

    def predict(self):
        board = [0] * 25
        safe_tiles = self.find_safe_spots()

        for tile in safe_tiles:
            if 0 <= tile < len(board):
                board[tile] = 1
        
        org_board = board[:]

        boards = ["✅" if safe_tiles == 2 else "💣" if safe_tiles == 1 else "⬜" for safe_tiles in safe_tiles]
        board_str = "<br>".join("".join(boards[i:i + 5]) for i in range(0, 25, 5))

        return board_str, safe_tiles
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
algo = Probabilities(new_history, safe_spots)
response = algo.predict()
print(json.dumps(response, indent=4))
