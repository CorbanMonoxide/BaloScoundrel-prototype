with open("game.js", "r") as f:
    js = f.read()

# Fix initGame calling openShop instead of startChamber
js = js.replace("log(\"Game started. Entering Dungeon 1, Chamber 1.\");\n    openShop();", "log(\"Game started. Entering Dungeon 1, Chamber 1.\");\n    startChamber();")

# We want the shop to show up when Target Score is reached, which triggers nextChamber()
# nextChamber() already calls openShop(), BUT openShop() was defined at the bottom, and closeShop() calls startChamber().
# Let's fix nextChamber so it doesn't increment chamber/dungeon *until* closeShop is called, 
# otherwise the Shop UI says "Target Score: ... D1C2" while still shopping.
# Actually, it's fine if the log says "Moving to Dungeon X" and then shop opens.

with open("game.js", "w") as f:
    f.write(js)
