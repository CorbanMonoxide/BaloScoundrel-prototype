import re

with open("index.html", "r") as f:
    html = f.read()

# CSS changes: apply #stats styles to .stats-bar class
html = html.replace("#stats { display: flex;", ".stats-bar { display: flex;")
html = html.replace('<div id="stats">', '<div id="top-stats" class="stats-bar">')

# Split the stats divs
old_stats = """        <div class="stat"><span class="label">Target Score</span><span id="target">5000</span></div>
        <div class="stat"><span class="label">Score</span><span id="score">0</span></div>
        <div class="stat"><span class="label">Multiplier</span><span id="mult">1x</span></div>
        <div class="stat"><span class="label">Weapon</span><span id="weapon">None</span></div>
        <div class="stat"><span class="label">HP</span><span id="hp">20 / 20</span></div>
        <div class="stat"><span class="label">Gold</span><span id="gold">0</span></div>
        <div class="stat"><span class="label">Deck</span><span id="deck-count">44</span></div>
        <div class="stat"><span class="label">Talismans</span><span id="talismans-ui">0/4</span></div>"""

new_top = """        <div class="stat"><span class="label">Target Score</span><span id="target">5000</span></div>
        <div class="stat"><span class="label">Score</span><span id="score">0</span></div>
        <div class="stat"><span class="label">Multiplier</span><span id="mult">1x</span></div>
        <div class="stat"><span class="label">Gold</span><span id="gold">0</span></div>
        <div class="stat"><span class="label">Deck</span><span id="deck-count">44</span></div>"""

html = html.replace(old_stats, new_top)

new_bottom = """
    <div id="bottom-stats" class="stats-bar" style="margin-top: 40px; margin-bottom: 0;">
        <div class="stat"><span class="label">Weapon</span><span id="weapon">None</span></div>
        <div class="stat"><span class="label">Item</span><span id="item">None</span></div>
        <div class="stat"><span class="label">Talismans</span><span id="talismans-ui">0/4</span></div>
        <div class="stat"><span class="label">HP</span><span id="hp">20 / 20</span></div>
    </div>
"""

# Insert bottom stats after controls
html = html.replace('</div>\n    </div>\n\n    \n    <div id="shop-screen"', 
                    '</div>\n' + new_bottom + '    </div>\n\n    \n    <div id="shop-screen"')

with open("index.html", "w") as f:
    f.write(html)
