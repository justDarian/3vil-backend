class TowersSafeSpots:
    def __init__(self, history):
        self.history = history
      
    def predict(self):
        board = []
        for v in self.history:
            lol = [index for index, _ in enumerate(v)]
            n = min((v.index(1) + lol[0]), 2) - lol[1]
            n = max(0, min(n, 2))
            ss = []
            ss[n] = 1
            board.append(ss)
        org_board = board.copy()
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
algo = TowersSafeSpots(new_history)
response = algo.predict()
print(json.dumps(response, indent=4))