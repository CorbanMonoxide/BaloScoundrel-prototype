with open("game.js", "r") as f:
    js = f.read()

print(js.find("initGame()"))
print(js.count("initGame();"))
