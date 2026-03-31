import os

with open("index.html", "r") as f:
    html = f.read()

if "shop-screen" not in html:
    # 1. Wrap game UI
    html = html.replace('<div id="stats">', '<div id="game-screen">\n    <div id="stats">')
    
    # Locate the end of the controls div and close the game-screen wrap
    controls_end = html.find('</div>', html.find('<div id="controls">')) + 6
    html = html[:controls_end] + '\n    </div>' + html[controls_end:]
    
    # 2. Add Talismans to stats
    html = html.replace('<div class="stat"><span class="label">Deck</span><span id="deck-count">44</span></div>', 
                        '<div class="stat"><span class="label">Deck</span><span id="deck-count">44</span></div>\n        <div class="stat"><span class="label">Talismans</span><span id="talismans-ui">0/4</span></div>')

    # 3. Add Shop UI before log
    shop_ui = """
    <div id="shop-screen" style="display:none; background: #181825; border: 2px solid #cba6f7; border-radius: 8px; padding: 20px; margin-bottom: 20px; margin-top: 20px;">
        <h2 style="margin-top: 0; color: #f9e2af;">Scoundrel Shop</h2>
        <div style="margin-bottom: 20px; font-size: 1.2rem;">Gold: <span id="shop-gold" style="color: #f9e2af; font-weight: bold;">0</span></div>
        <div id="shop-items" style="display:flex; justify-content:center; gap: 20px; margin-bottom:20px; flex-wrap: wrap;"></div>
        <button onclick="closeShop()" style="background: #a6e3a1;">Next Chamber</button>
    </div>
    """
    html = html.replace('<div id="log"></div>', shop_ui + '\n    <div id="log"></div>')

    with open("index.html", "w") as f:
        f.write(html)

with open("game.js", "r") as f:
    js = f.read()

if "function openShop" not in js:
    js = js.replace("let gameOver = false;", "let gameOver = false;\nlet talismans = [];\nlet extraCards = [];")
    js = js.replace("gold = 0;\n    document.getElementById", "gold = 0;\n    talismans = [];\n    extraCards = [];\n    document.getElementById")
    js = js.replace("for (let i = deck.length - 1; i > 0; i--) {", "extraCards.forEach(c => deck.push({...c}));\n    \n    for (let i = deck.length - 1; i > 0; i--) {")
    js = js.replace("document.getElementById('deck-count').innerText = deck.length;", "document.getElementById('deck-count').innerText = deck.length;\n    document.getElementById('talismans-ui').innerText = talismans.length + '/4';")
    js = js.replace("startChamber();\n}", "openShop();\n}")
    
    shop_funcs = """
const shopDb = [
    { id: 't_silver', name: 'Silver Blades', type: 'talisman', cost: 8, desc: 'Common: +Dmg vs Clubs (WIP)' },
    { id: 't_quick', name: 'Quick Feet', type: 'talisman', cost: 8, desc: 'Common: Dodge 2 dmg (WIP)' },
    { id: 't_pick', name: 'Pickpocket', type: 'talisman', cost: 8, desc: 'Common: +2G on fist kill (WIP)' },
    { id: 't_coward', name: 'Cowards Luck', type: 'talisman', cost: 8, desc: 'Common: Heal 1 on leave (WIP)' },
    { id: 'c_potion', name: 'Extra Potion', type: 'consumable', cost: 3, desc: 'Common: Adds +1 Potion to deck permanently' },
    { id: 'c_shield', name: 'Shield', type: 'consumable', cost: 5, desc: 'Uncommon: +5 Temp HP (WIP)' }
];

function openShop() {
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('shop-screen').style.display = 'block';
    document.getElementById('shop-gold').innerText = gold;
    
    const shopDiv = document.getElementById('shop-items');
    shopDiv.innerHTML = '';
    
    // Draft 3 random items
    let items = [];
    for(let i=0; i<3; i++) {
        items.push(shopDb[Math.floor(Math.random() * shopDb.length)]);
    }
    
    items.forEach((item, index) => {
        const el = document.createElement('div');
        el.style = 'border: 1px solid #cba6f7; padding: 15px; border-radius: 8px; width: 160px; cursor: pointer; background: #313244; display: flex; flex-direction: column; justify-content: space-between; transition: 0.2s;';
        el.innerHTML = `<div><h3 style="margin-top:0; margin-bottom: 5px; color:#89b4fa; font-size:1.1rem;">${item.name}</h3><p style="font-size:0.8rem; color:#a6adc8; margin-top:0;">${item.desc}</p></div><div style="margin-top:10px; font-weight:bold; color:#f9e2af; font-size:1.2rem;">${item.cost} G</div>`;
        
        el.onmouseover = () => el.style.borderColor = '#a6e3a1';
        el.onmouseout = () => el.style.borderColor = '#cba6f7';
        
        el.onclick = () => buyItem(item, index, el);
        shopDiv.appendChild(el);
    });
}

function buyItem(item, index, el) {
    if (gold >= item.cost) {
        if (item.type === 'talisman') {
            if (talismans.length >= 4) {
                log("Shop: Talisman slots full! (4/4)");
                return;
            }
            talismans.push(item);
        } else if (item.id === 'c_potion') {
            extraCards.push({ suit: 'Hearts', value: 10, display: '10' }); // Standard Potion is 10
        }
        gold -= item.cost;
        document.getElementById('shop-gold').innerText = gold;
        document.getElementById('gold').innerText = gold;
        el.style.display = 'none'; // remove from shop visually
        log("Shop: Bought " + item.name + " for " + item.cost + "G.");
        updateUI(); // refresh talismans count
    } else {
        log("Shop: Not enough gold for " + item.name + "!");
    }
}

function closeShop() {
    log("Exited shop.");
    document.getElementById('shop-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    startChamber();
}
"""
    js += shop_funcs
    with open("game.js", "w") as f:
        f.write(js)

