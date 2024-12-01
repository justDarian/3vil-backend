class TowersDroppingFreq:
    def __init__(self, history):
      self.history = history
      
    def predict(self):
        games = [row for x in self.history for row in x]
        
        board = [0] * 8

        for game in games:
            for v in range(0,game,8):
                board[index, v] += 1

        for index in range(8):
            if board[index] > 3:
                board[index] = 1
            else:
                board[index] = 0

        board_ = ["✅" if row == 1 else "❌" for row in board]
        return "<br>".join("".join(board_)), 75, board
    
import sys
import tls_client
import json
session = tls_client.Session(
    client_identifier="safari_15_6_1"
)
request = session.get("https://api.bflip.com/games/towers/history?size=6&page=0", headers={'x-auth-token': sys.argv[1], "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1"})
history = request.json().get('data', [])
new_history = history[0].get('towerLevels', [])
algo = TowersDroppingFreq(new_history)
response = algo.predict()
print(json.dumps(response, indent=4))