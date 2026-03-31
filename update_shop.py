with open("game.js", "r") as f:
    js = f.read()

# Split the file right before shopDb is defined
parts = js.split("const shopDb = [")
prefix = parts[0]

new_shop_code = """const shopDb = [
    { id: 't_silver', name: 'Silver Blades', type: 'talisman', displayType: 'Talisman', cost: 8, desc: '+Dmg vs Clubs (WIP)' },
    { id: 't_quick', name: 'Quick Feet', type: 'talisman', displayType: 'Talisman', cost: 8, desc: 'Dodge 2 dmg (WIP)' },
    { id: 't_pick', name: 'Pickpocket', type: 'talisman', displayType: 'Talisman', cost: 8, desc: '+2G on fist kill (WIP)' },
    { id: 't_coward', name: 'Cowards Luck', type: 'talisman', displayType: 'Talisman', cost: 8, desc: 'Heal 1 on leave (WIP)' },
    { id: 'm_bank', name: 'Bank Gold', type: 'magic', displayType: 'Magic Item', cost: 30, desc: 'Earn interest on gold (WIP)' },
    { id: 'c_shield', name: 'Shield', type: 'consumable', displayType: 'Consumable', cost: 5, desc: '+5 Temp HP (WIP)' },
    { id: 'c_smoke', name: 'Smokescreen', type: 'consumable', displayType: 'Consumable', cost: 5, desc: 'Hide 1 monster (WIP)' }
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
        let isCard = Math.random() < 0.4; // 40% chance to be a card (Weapon/Potion)
        if (isCard) {
            let isWeapon = Math.random() < 0.5;
            let val = Math.floor(Math.random() * 9) + 2; // Value 2 to 10
            if (isWeapon) {
                items.push({
                    id: 'card_w_' + val,
                    name: 'Weapon ' + val,
                    type: 'weapon',
                    displayType: 'Weapon',
                    cost: Math.max(3, val - 2), // Roughly scaling cost
                    desc: 'Adds to your deck permanently.',
                    cardData: { suit: 'Diamonds', value: val, display: val.toString() }
                });
            } else {
                items.push({
                    id: 'card_p_' + val,
                    name: 'Potion ' + val,
                    type: 'potion',
                    displayType: 'Potion',
                    cost: Math.max(3, val - 2),
                    desc: 'Adds to your deck permanently.',
                    cardData: { suit: 'Hearts', value: val, display: val.toString() }
                });
            }
        } else {
            let dbItem = shopDb[Math.floor(Math.random() * shopDb.length)];
            items.push({...dbItem}); // Deep copy
        }
    }
    
    items.forEach((item, index) => {
        const el = document.createElement('div');
        el.style = 'border: 1px solid #cba6f7; padding: 15px; border-radius: 8px; width: 160px; cursor: pointer; background: #313244; display: flex; flex-direction: column; align-items: center; justify-content: space-between; transition: 0.2s;';
        
        let visualHtml = '';
        if (item.type === 'weapon' || item.type === 'potion') {
            let cssClass = item.type === 'weapon' ? 'weapon' : 'potion';
            let symbol = item.type === 'weapon' ? '♦' : '♥';
            visualHtml = `<div class="card ${cssClass}" style="margin: 10px auto; pointer-events: none; transform: none; box-shadow: 0 4px 8px rgba(0,0,0,0.3);">
                <div style="margin-top: 15px;">${symbol} ${item.cardData.display}</div>
            </div>`;
        }
        
        el.innerHTML = `
            <div style="width: 100%; text-align: center;">
                <h3 style="margin-top:0; margin-bottom: 2px; color:#89b4fa; font-size:1.1rem;">${item.name}</h3>
                <div style="font-size: 0.7rem; color: #f38ba8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">${item.displayType}</div>
                ${visualHtml}
                <p style="font-size:0.8rem; color:#a6adc8; margin-top:5px; margin-bottom:0;">${item.desc}</p>
            </div>
            <div style="margin-top:10px; font-weight:bold; color:#f9e2af; font-size:1.2rem;">${item.cost} G</div>
        `;
        
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
        } else if (item.type === 'weapon' || item.type === 'potion') {
            extraCards.push({ suit: item.cardData.suit, value: item.cardData.value, display: item.cardData.display });
        }
        
        gold -= item.cost;
        document.getElementById('shop-gold').innerText = gold;
        document.getElementById('gold').innerText = gold;
        el.style.display = 'none'; // remove from shop visually
        log("Shop: Bought " + item.name + " for " + item.cost + "G.");
        updateUI(); // refresh UI stats
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

with open("game.js", "w") as f:
    f.write(prefix + new_shop_code)
