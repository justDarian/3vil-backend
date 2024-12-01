class TowersCluster:
    def __init__(self, history):
        self.history = history
      
    def predict(self):
        games = [row for x in self.history for row in x]
        board = []
        for v in range(0, len(games), 3):
            g = games[v:v + 3]
            nn = [index for index, value in enumerate(g) if value == 0]
            difference = min(abs(nn[0] - nn[1] + (g.index(1)-1)), 2)
            dd = [0] * 3
            dd[difference] = 1
            board.append(dd)
        org_board = board
        board = ["✅" if row == 1 else "❌" for x in board for row in x]
        return "<br>".join("".join(map(str, board[x:x + 3])) for x in range(0, len(board), 3)), 75, org_board

import sys
import tls_client
import json
session = tls_client.Session(
    client_identifier="safari_15_6_1"
)
request = session.get("https://api.bflip.com/games/towers/history?size=6&page=0", headers={'x-auth-token': sys.argv[1], "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1"})
history = request.json().get('data', [])
new_history = history[0].get('towerLevels', [])
algo = TowersCluster(new_history)
response = algo.predict()
print(json.dumps(response, indent=4))