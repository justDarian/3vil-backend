class Algorithm:
    def __init__(self,history,tiles):
        self.max_tiles = tiles
        self.history = history
    def predict(self):
        history = self.history

        board = [0] * 25
        n = 0

        def get_spot(a, b):
            nonlocal n
            for val in (abs(first_value - second_value)+1 for first_value, second_value in zip(a, b)):
                if n < self.max_tiles:
                    if board[val] == 0:
                        board[val] = 1
                        n += 1
                    elif board[val+1] == 0:
                        board[val+1] = 1
                        n += 1
                else:
                    break

        for v in history:
            if n < self.max_tiles:
                get_spot(v['uncoveredLocations'], v['mineLocations'])
            else:
                break
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
algo = Algorithm(new_history, safe_spots)
response = algo.predict()
print(json.dumps(response, indent=4))
