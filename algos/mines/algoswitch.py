class AlgoSwitch:
    def __init__(self, history, tiles):
        self.max_tiles = tiles
        self.history = history

    def predict(self):
        history = self.history
        board = [0] * 25
        n = 0

        def assign_tile(position):
            nonlocal n
            if n < self.max_tiles:
                if board[position] == 0:
                    board[position] = 1
                    n += 1
                else:
                    while position < len(board) and board[position] == 1:
                        position += 1
                    if position < len(board):
                        board[position] = 1
                        n += 1

        for record in history:
            uncovered = record['uncoveredLocations']
            mines = record['mineLocations']

            for uncovered_tile, mine_tile in zip(uncovered, mines):
                if n >= self.max_tiles:
                    break

                distance = abs(uncovered_tile - mine_tile) + 1
                assign_tile(distance)

        org_board = board[:]

        visual_board = ["✅" if x == 1 else "💣" for x in board]
        board_str = "<br>".join("".join(map(str, visual_board[i:i + 5])) for i in range(0, len(visual_board), 5))

        accuracy = None
        
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
algo = AlgoSwitch(new_history, safe_spots)
response = algo.predict()
print(json.dumps(response, indent=4))
