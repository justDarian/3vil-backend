class TowersPathfinding:
    def __init__(self, history):
      self.history = history
      
    def predict(self):
        games = self.history
        board = []
        for i in range(len(games)-1):
            x = games[i].index(1)
            b = games[i+1].index(0)
            n = min(x+b,2)
            ex = [0] * 3
            ex[n] = 1
            board.append(ex)
        board.append(games[7])
        org_board = board
        board = ["✅" if row == 1 else "❌" for x in board for row in x]
        return "<br>".join("".join(map(str, board[x:x + 3])) for x in range(0, len(board), 3)), 80, org_board

import sys
import tls_client
import json
session = tls_client.Session(
    client_identifier="safari_15_6_1"
)
request = session.get("https://api.bflip.com/games/towers/history?size=6&page=0", headers={'x-auth-token': sys.argv[1], "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1"})
history = request.json().get('data', [])
new_history = history[0].get('towerLevels', [])
algo = TowersPathfinding(new_history)
response = algo.predict()
print(json.dumps(response, indent=4))