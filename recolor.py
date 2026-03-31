import re

with open("index.html", "r") as f:
    html = f.read()

# Update CSS for .card
# Remove the old specific background colors
html = re.sub(r'\.card\.monster \{[^\}]*\}', '', html)
html = re.sub(r'\.card\.weapon \{[^\}]*\}', '', html)
html = re.sub(r'\.card\.potion \{[^\}]*\}', '', html)

# Replace .card base styles
old_card_style = r'\.card \{ width: 100px; height: 140px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: bold; color: #11111b; cursor: pointer; border: 2px solid transparent; transition: 0.2s; user-select: none; position: relative; \}'
new_card_style = '.card { width: 100px; height: 140px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: bold; background: #ffffff; color: #000000; cursor: pointer; border: 2px solid #ccc; transition: 0.2s; user-select: none; position: relative; }'

if re.search(old_card_style, html):
    html = re.sub(old_card_style, new_card_style, html)
else:
    # Just in case the exact string match fails, replace the color and background if they exist, or just append
    html = html.replace("color: #11111b;", "color: #000000; background: #ffffff; border: 2px solid #ccc;")

with open("index.html", "w") as f:
    f.write(html)


with open("game.js", "r") as f:
    js = f.read()

# Replace rendering in updateUI()
old_room_render = "el.innerHTML = '<div style=\"margin-top: 15px;\">' + suits[card.suit].symbol + ' ' + card.display + '</div>';"
new_room_render = """let suitColor = (card.suit === 'Hearts' || card.suit === 'Diamonds') ? '#e53935' : '#000000';
        el.innerHTML = '<div style="margin-top: 15px;"><span style="color:' + suitColor + ';">' + suits[card.suit].symbol + '</span> <span style="color:#000000;">' + card.display + '</span></div>';"""
js = js.replace(old_room_render, new_room_render)

# Replace rendering in createItemCard() for the shop
old_shop_render = """visualHtml = `<div class="card ${cssClass}" style="margin: 10px auto; pointer-events: none; transform: none; box-shadow: 0 4px 8px rgba(0,0,0,0.3); height: 80px; width: 60px; font-size: 1.2rem; display: flex; align-items: center; justify-content: center;">
            <div style="margin-top: 5px;">${symbol} ${item.cardData.display}</div>
        </div>`;"""

new_shop_render = """let suitColor = (item.cardData.suit === 'Hearts' || item.cardData.suit === 'Diamonds') ? '#e53935' : '#000000';
        visualHtml = `<div class="card ${cssClass}" style="margin: 10px auto; pointer-events: none; transform: none; box-shadow: 0 4px 8px rgba(0,0,0,0.3); height: 80px; width: 60px; font-size: 1.2rem; display: flex; align-items: center; justify-content: center; background: #ffffff; border: 1px solid #ccc; border-radius: 8px;">
            <div style="margin-top: 5px;"><span style="color:${suitColor};">${symbol}</span> <span style="color:#000000;">${item.cardData.display}</span></div>
        </div>`;"""
js = js.replace(old_shop_render, new_shop_render)

with open("game.js", "w") as f:
    f.write(js)
