from sklearn.tree import DecisionTreeClassifier
from sklearn.preprocessing import LabelEncoder
import numpy as np

class decisionTrend:
    def __init__(self, history, tiles):
        self.max_tiles = tiles
        self.history = history
        self.model = DecisionTreeClassifier()

    def prepare_data(self):
        x_train = []
        y_train = []
    
        for record in self.history:
            uncovered = record['uncoveredLocations']
            mines = record['mineLocations']
        
            uncovered_vector = [1 if i in uncovered else 0 for i in range(25)]
        
            mines_vector = [1 if i in mines else 0 for i in range(25)]
        
            x_train.append(uncovered_vector)
            y_train.append(mines_vector)

        x_train = np.array(x_train)
        y_train = np.array(y_train)

        return x_train, y_train

    def fit_model(self):
        x_train, y_train = self.prepare_data()

        self.model.fit(x_train, y_train)

    def predict(self):
        self.fit_model()

        current_board = self.history[-1]
        uncovered = current_board['uncoveredLocations']
    
        x_test = np.array([[1 if i in uncovered else 0 for i in range(25)]])

        if x_test.shape[1] != 25:
            raise ValueError(f"x_test has {x_test.shape[1]} features, expected 25")

        y_pred = self.model.predict(x_test)
        board_pred = y_pred[0]

        board = ["💣" if x == 1 else "✅" for x in board_pred]
        board_str = "<br>".join("".join(map(str, board[i:i + 5])) for i in range(0, len(board), 5))
        accuracy = None
    
        return board_str, accuracy, board_pred
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
algo = decisionTrend(new_history, safe_spots)
response = algo.predict()
print(json.dumps(response, indent=4))
