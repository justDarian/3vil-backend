import numpy as np
from sklearn.ensemble import GradientBoostingClassifier

class CoxyMines2:
    def __init__(self, history, tiles):
        self.max_tiles = tiles
        self.history = history
        self.upper = 0

    def predict(self):
        board = [0] * 25
        y_field = [0] * 25
        index = 0

        for v in self.history:
            if index % 2 == 0:
                for i in range(len(v['uncoveredLocations'])):
                    if self.upper == self.max_tiles:
                        break
                    y_field[v['uncoveredLocations'][i]] = 1
                    self.upper += 1
            else:
                for i in range(len(v['mineLocations'])):
                    if self.upper == self.max_tiles:
                        break
                    y_field[v['mineLocations'][i]] = 1
                    self.upper += 1
            index += 1 

        x_train = np.array(y_field).reshape(-1, 1)

        gbc = GradientBoostingClassifier()
        gbc.fit(x_train, y_field)

        prediction_model = gbc.predict(x_train)
    
        board = prediction_model.tolist()

        mine_sum = sum(board)

        if mine_sum > self.max_tiles:
            ind = np.where(np.array(board) == 1)[0]
            np.random.shuffle(ind)
            board[ind[:mine_sum - self.max_tiles]] = 0
        
        accuracy = None 
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
algo = CoxyMines2(new_history, safe_spots)
response = algo.predict()
print(json.dumps(response, indent=4))
