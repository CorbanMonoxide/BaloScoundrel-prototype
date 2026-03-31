with open("game.js", "r") as f:
    js = f.read()

# Add new global variables if they don't exist
if "let currentMagicItem = null;" not in js:
    js = js.replace("let gameOver = false;", "let gameOver = false;\nlet currentMagicItem = null;\nlet magicPurchasedThisDungeon = false;")

if "rollMagicItem();" not in js:
    js = js.replace("extraCards = [];\n    document.getElementById('log')", "extraCards = [];\n    rollMagicItem();\n    document.getElementById('log')")

# Fix nextChamber to roll magic items on new dungeon
next_chamber_old = "currentDungeon++;\n        log"
next_chamber_new = "currentDungeon++;\n        rollMagicItem();\n        log"
if next_chamber_new not in js:
    js = js.replace(next_chamber_old, next_chamber_new)

# Cut everything from shopDb down
idx = js.find("const shopDb = [")
if idx != -1:
    js = js[:idx]

new_shop_code = """const shopDb = [
    { id: 't_silver', name: 'Silver Blades', type: 'talisman', displayType: 'Talisman', cost: 8, desc: '+Dmg vs Clubs (WIP)' },
    { id: 't_quick', name: 'Quick Feet', type: 'talisman', displayType: 'Talisman', cost: 8, desc: 'Dodge 2 dmg (WIP)' },
    { id: 't_pick', name: 'Pickpocket', type: 'talisman', displayType: 'Talisman', cost: 8, desc: '+2G on fist kill (WIP)' },
    { id: 't_coward', name: 'Cowards Luck', type: 'talisman', displayType: 'Talisman', cost: 8, desc: 'Heal 1 on leave (WIP)' },
    { id: 'c_shield', name: 'Shield', type: 'consumable', displayType: 'Consumable', cost: 5, desc: '+5 Temp HP (WIP)' },
    { id: 'c_smoke', name: 'Smokescreen', type: 'consumable', displayType: 'Consumable', cost: 5, desc: 'Hide 1 monster (WIP)' }
];

const magicDb = [
    { id: 'm_bank', name: 'Bank Gold', type: 'magic', displayType: 'Magic Item', cost: 30, desc: 'Earn interest on gold' },
    { id: 'm_belt', name: 'Talisman Belt', type: 'magic', displayType: 'Magic Item', cost: 30, desc: '+1 Talisman Capacity' },
    { id: 'm_evasion', name: 'Evasion Tactics', type: 'magic', displayType: 'Magic Item', cost: 30, desc: 'Skip 2 rooms in a row' },
    { id: 'm_flask', name: 'Bottomless Flask', type: 'magic', displayType: 'Magic Item', cost: 30, desc: 'Drink 2 potions per room' },
    { id: 'm_key', name: 'Master Key', type: 'magic', displayType: 'Magic Item', cost: 30, desc: 'Pick 2 items from Chests' },
    { id: 'm_arcane', name: 'Arcane Supplier', type: 'magic', displayType: 'Magic Item', cost: 30, desc: 'More Rare Consumables' }
];

function rollMagicItem() {
    currentMagicItem = magicDb[Math.floor(Math.random() * magicDb.length)];
    magicPurchasedThisDungeon = false;
}

function generateRandomShopItem() {
    let isCard = Math.random() < 0.4; 
    if (isCard) {
        let isWeapon = Math.random() < 0.5;
        let val = Math.floor(Math.random() * 9) + 2; 
        if (isWeapon) {
            return { id: 'card_w_'+val, name: 'Weapon '+val, type: 'weapon', displayType: 'Weapon', cost: Math.max(3, val - 2), desc: 'Adds to deck permanently.', cardData: { suit: 'Diamonds', value: val, display: val.toString() } };
        } else {
            return { id: 'card_p_'+val, name: 'Potion '+val, type: 'potion', displayType: 'Potion', cost: Math.max(3, val - 2), desc: 'Adds to deck permanently.', cardData: { suit: 'Hearts', value: val, display: val.toString() } };
        }
    } else {
        return {...shopDb[Math.floor(Math.random() * shopDb.length)]};
    }
}

function createItemCard(item, onClickCallback, free = false) {
    const el = document.createElement('div');
    el.style = 'border: 1px solid #cba6f7; padding: 15px; border-radius: 8px; width: 160px; cursor: pointer; background: #313244; display: flex; flex-direction: column; align-items: center; justify-content: space-between; transition: 0.2s;';
    
    let visualHtml = '';
    if (item.type === 'weapon' || item.type === 'potion') {
        let cssClass = item.type === 'weapon' ? 'weapon' : 'potion';
        let symbol = item.type === 'weapon' ? '♦' : '♥';
        visualHtml = `<div class="card ${cssClass}" style="margin: 10px auto; pointer-events: none; transform: none; box-shadow: 0 4px 8px rgba(0,0,0,0.3); height: 80px; width: 60px; font-size: 1.2rem; display: flex; align-items: center; justify-content: center;">
            <div style="margin-top: 5px;">${symbol} ${item.cardData.display}</div>
        </div>`;
    } else if (item.type === 'chest') {
         visualHtml = `<div style="font-size: 3rem; margin: 10px 0;">📦</div>`;
    } else if (item.type === 'magic') {
         visualHtml = `<div style="font-size: 3rem; margin: 10px 0; filter: hue-rotate(90deg);">🎟️</div>`;
    }
    
    let costHtml = free ? `<div style="margin-top:10px; font-weight:bold; color:#a6e3a1; font-size:1.2rem;">TAKE</div>` : `<div style="margin-top:10px; font-weight:bold; color:#f9e2af; font-size:1.2rem;">${item.cost} G</div>`;
    
    el.innerHTML = `
        <div style="width: 100%; text-align: center;">
            <h3 style="margin-top:0; margin-bottom: 2px; color:#89b4fa; font-size:1.1rem;">${item.name}</h3>
            <div style="font-size: 0.7rem; color: #f38ba8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">${item.displayType}</div>
            ${visualHtml}
            <p style="font-size:0.8rem; color:#a6adc8; margin-top:5px; margin-bottom:0;">${item.desc}</p>
        </div>
        ${costHtml}
    `;
    
    el.onmouseover = () => el.style.borderColor = '#a6e3a1';
    el.onmouseout = () => el.style.borderColor = '#cba6f7';
    el.onclick = onClickCallback;
    return el;
}

function updateShopGold() {
    document.getElementById('shop-gold').innerText = gold;
    document.getElementById('gold').innerText = gold;
}

function openShop() {
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('shop-screen').style.display = 'block';
    updateShopGold();
    
    const shopDiv = document.getElementById('shop-items');
    shopDiv.innerHTML = '';
    
    for(let i=0; i<3; i++) {
        let item = generateRandomShopItem();
        let el = createItemCard(item, () => buyItem(item, el));
        shopDiv.appendChild(el);
    }

    let specialsDiv = document.getElementById('shop-specials');
    if (!specialsDiv) {
        specialsDiv = document.createElement('div');
        specialsDiv.id = 'shop-specials';
        specialsDiv.style = 'display:flex; justify-content:center; gap: 20px; margin-top:30px; border-top: 1px solid #45475a; padding-top: 20px;';
        document.getElementById('shop-items').parentNode.insertBefore(specialsDiv, document.getElementById('shop-items').nextSibling);
    }
    specialsDiv.innerHTML = '';

    if (!magicPurchasedThisDungeon && currentMagicItem) {
        let mEl = createItemCard(currentMagicItem, () => buyMagic(currentMagicItem, mEl));
        specialsDiv.appendChild(mEl);
    }

    let chestItem = { id: 'lootbox', name: 'Mysterious Chest', type: 'chest', displayType: 'Lootbox', cost: 10, desc: 'Open to draft 1 of 3 random items.' };
    let cEl = createItemCard(chestItem, () => buyChest(chestItem, cEl));
    specialsDiv.appendChild(cEl);
}

function buyItem(item, el, free = false) {
    if (!free && gold < item.cost) {
        log("Shop: Not enough gold for " + item.name + "!");
        return;
    }
    
    if (item.type === 'talisman') {
        if (talismans.length >= 4) {
            log("Shop: Talisman slots full! (4/4)");
            return;
        }
        talismans.push(item);
    } else if (item.type === 'weapon' || item.type === 'potion') {
        extraCards.push({ suit: item.cardData.suit, value: item.cardData.value, display: item.cardData.display });
    }
    
    if (!free) {
        gold -= item.cost;
        updateShopGold();
        log("Shop: Bought " + item.name + " for " + item.cost + "G.");
    } else {
        log("Shop: Drafted " + item.name + " from Chest!");
        document.getElementById('shop-items').innerHTML = '<div style="color:#a6adc8; padding: 20px; font-size: 1.2rem;">Chest item claimed!</div>';
    }
    
    el.style.display = 'none';
    updateUI();
}

function buyMagic(item, el) {
    if (gold < item.cost) {
        log("Shop: Not enough gold for " + item.name + "!");
        return;
    }
    gold -= item.cost;
    magicPurchasedThisDungeon = true;
    updateShopGold();
    el.style.display = 'none';
    log("Shop: Purchased Magic - " + item.name + "!");
}

function buyChest(item, el) {
    if (gold < item.cost) {
        log("Shop: Not enough gold for Chest!");
        return;
    }
    gold -= item.cost;
    updateShopGold();
    el.style.display = 'none';
    log("Shop: Opened a Chest! Select 1 item.");
    
    const shopDiv = document.getElementById('shop-items');
    shopDiv.innerHTML = ''; 
    
    for(let i=0; i<3; i++) {
        let draftItem = generateRandomShopItem();
        let dEl = createItemCard(draftItem, () => buyItem(draftItem, dEl, true), true);
        shopDiv.appendChild(dEl);
    }
}

function closeShop() {
    log("Exited shop.");
    document.getElementById('shop-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    
    let specialsDiv = document.getElementById('shop-specials');
    if (specialsDiv) specialsDiv.remove();

    startChamber();
}
"""

with open("game.js", "w") as f:
    f.write(js + new_shop_code)
