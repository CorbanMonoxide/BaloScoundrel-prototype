with open("game.js", "r") as f:
    js = f.read()

# Replace the first `initGame();` that causes the crash.
# We will just split and reconstruct or regex it.
js = js.replace("\ninitGame();\n", "\n", 1)

with open("game.js", "w") as f:
    f.write(js)
