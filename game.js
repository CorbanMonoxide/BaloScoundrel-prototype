let deck = [];
let currentRoom = [];
let hp = 20;
let score = 0;
let gold = 0;

let currentDungeon = 1;
let currentChamber = 1;
let targetScore = 3000; // Will scale

// Weapon state
let currentWeaponValue = null;
let currentWeaponLimit = null; 
let currentWeaponMult = 1;     

let cardsPlayedThisRoom = 0;
let fledLastRoom = false;
let potionUsedThisTurn = false;
let gameOver = false;
let currentMagicItem = null;
let magicPurchasedThisDungeon = false;
let currentChestCost = 5;
let talismans = [];
let extraCards = [];

const suits = {
    'Spades': { symbol: '♠', type: 'monster' },
    'Clubs': { symbol: '♣', type: 'monster' },
    'Diamonds': { symbol: '♦', type: 'weapon' },
    'Hearts': { symbol: '♥', type: 'potion' }
};

function log(msg) {
    const logDiv = document.getElementById('log');
    const entry = document.createElement('div');
    entry.innerText = '> ' + msg;
    logDiv.prepend(entry);
}

function updateUI() {
    document.getElementById('hp').innerText = hp + ' / 20';
    document.getElementById('score').innerText = score;
    document.getElementById('gold').innerText = gold;
    document.getElementById('mult').innerText = currentWeaponValue ? currentWeaponMult + 'x' : '1x';
    document.getElementById('weapon').innerText = currentWeaponValue ? '♦ ' + currentWeaponValue + ' (Max: ' + currentWeaponLimit + ')' : 'None';
    document.getElementById('deck-count').innerText = deck.length;
    document.getElementById('talismans-ui').innerText = talismans.length + '/4';
    
    document.getElementById('target').innerText = targetScore + ' (D' + currentDungeon + 'C' + currentChamber + ')';
    
    const roomDiv = document.getElementById('room');
    roomDiv.innerHTML = '';
    currentRoom.forEach((card, index) => {
        const el = document.createElement('div');
        el.className = 'card ' + suits[card.suit].type + (card.played ? ' hidden' : '');
        
        el.innerHTML = '<div style="margin-top: 15px;">' + suits[card.suit].symbol + ' ' + card.display + '</div>';
        
        if (suits[card.suit].type === 'monster') {
            const canUseWeapon = currentWeaponValue !== null && card.value <= currentWeaponLimit;
            const actions = document.createElement('div');
            actions.className = 'actions';
            
            let htmlStr = '';
            if (canUseWeapon) {
                htmlStr += '<button class="act-btn weapon-btn" onclick="event.stopPropagation(); playCard(' + index + ', true)">Weapon</button>';
            }
            htmlStr += '<button class="act-btn fist-btn" onclick="event.stopPropagation(); playCard(' + index + ', false)">Fists</button>';
            
            actions.innerHTML = htmlStr;
            el.appendChild(actions);
            
            // If clicking the card itself (not a button)
            el.onclick = () => {
                if (!canUseWeapon) playCard(index, false);
            };
        } else {
            el.onclick = () => playCard(index, false);
        }
        
        roomDiv.appendChild(el);
    });

    document.getElementById('btn-flee').disabled = gameOver || fledLastRoom || cardsPlayedThisRoom > 0;
    document.getElementById('btn-next').disabled = gameOver || cardsPlayedThisRoom < 3;
}

function buildDeck() {
    deck = [];
    for (let val = 2; val <= 14; val++) {
        let display = val;
        if (val === 11) display = 'J';
        if (val === 12) display = 'Q';
        if (val === 13) display = 'K';
        if (val === 14) display = 'A';

        deck.push({ suit: 'Spades', value: val, display: display });
        deck.push({ suit: 'Clubs', value: val, display: display });
        
        if (val <= 10) {
            deck.push({ suit: 'Diamonds', value: val, display: display });
            deck.push({ suit: 'Hearts', value: val, display: display });
        }
    }
    
    extraCards.forEach(c => deck.push({...c}));
    
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function initGame() {
    currentDungeon = 1;
    currentChamber = 1;
    hp = 20;
    score = 0;
    gold = 0;
    talismans = [];
    extraCards = [];
    rollMagicItem();
    document.getElementById('log').innerHTML = '';
    log("Game started. Entering Dungeon 1, Chamber 1.");
    startChamber();
}

function startChamber() {
    targetScore = 3000 + ((currentChamber - 1) * 2500) + ((currentDungeon - 1) * 10000);
    buildDeck();
    score = 0; 
    hp = 20; 
    currentWeaponValue = null;
    currentWeaponLimit = null;
    currentWeaponMult = 1;
    fledLastRoom = false;
    currentRoom = [];
    gameOver = false;
    
    log('--- Dungeon ' + currentDungeon + ' Chamber ' + currentChamber + ' ---');
    log('Target Score: ' + targetScore);
    drawRoom();
}

function drawRoom() {
    if (gameOver) return;

    if (deck.length === 0 && currentRoom.filter(c => !c.played).length === 0) {
        gameOver = true;
        log("Out of cards! You failed the Chamber.");
        updateUI();
        return;
    }
    
    const unplayed = currentRoom.filter(c => !c.played);
    currentRoom = [...unplayed];

    while(currentRoom.length < 4 && deck.length > 0) {
        let cardToDraw = deck.pop();
        cardToDraw.played = false;
        currentRoom.push(cardToDraw);
    }
    
    cardsPlayedThisRoom = 0;
    potionUsedThisTurn = false;
    fledLastRoom = false;
    updateUI();
}

function fleeRoom() {
    if (gameOver || fledLastRoom || cardsPlayedThisRoom > 0) return;
    log("Fled the room! Scooped all cards to the bottom of the deck.");
    currentRoom.forEach(c => deck.unshift(c)); 
    currentRoom = [];
    fledLastRoom = true;
    drawRoom();
}

function nextChamber() {
    currentChamber++;
    if (currentChamber > 3) {
        currentChamber = 1;
        currentDungeon++;
        rollMagicItem();
        log('🎉 DUNGEON CLEARED! Moving to Dungeon ' + currentDungeon);
    }
    openShop();
}

function playCard(index, useWeaponChoice = false) {
    if (gameOver) return;
    if (cardsPlayedThisRoom >= 3) {
        log("You've already played 3 cards this room! Click Next Room.");
        return;
    }
    
    const card = currentRoom[index];
    if (card.played) return;
    
    const type = suits[card.suit].type;
    
    if (type === 'potion') {
        if (potionUsedThisTurn) {
            log("Already drank a potion this room! Ignoring.");
            card.played = true;
            cardsPlayedThisRoom++;
            updateUI();
            return;
        }
        const heal = Math.min(20 - hp, card.value);
        hp += heal;
        potionUsedThisTurn = true;
        log('Drank potion. Restored ' + heal + ' HP.');
    } 
    else if (type === 'weapon') {
        currentWeaponValue = card.value;
        currentWeaponLimit = 15; 
        currentWeaponMult = card.value;
        log('Equipped Weapon ' + card.value + '.');
    } 
    else if (type === 'monster') {
        let killMult = 1;
        
        if (useWeaponChoice && currentWeaponValue !== null && card.value <= currentWeaponLimit) {
            killMult = currentWeaponMult;
            let dmg = Math.max(0, card.value - currentWeaponValue);
            hp -= dmg;
            
            log('Attacked ' + card.value + ' Monster with Weapon! Took ' + dmg + ' dmg.');
            
            currentWeaponLimit = card.value;
            currentWeaponMult = card.value;
        } else {
            if (currentWeaponValue !== null && card.value > currentWeaponLimit) {
                log('Monster (' + card.value + ') > Limit. Forced Barehanded! Mult 1x.');
            } else if (currentWeaponValue !== null && !useWeaponChoice) {
                log('Chose barehanded against ' + card.value + '! Saved weapon. Took ' + card.value + ' dmg.');
            } else {
                log('Fought ' + card.value + ' barehanded! Took ' + card.value + ' dmg.');
            }
            hp -= card.value;
            killMult = 1;
        }
        
        let earnedGold = (card.value <= 10) ? 1 : (card.value - 9);
        gold += earnedGold;
        const points = (card.value * 10) * killMult;
        score += points;
        log('Defeated ' + card.value + '! Scored ' + (card.value*10) + ' x ' + killMult + ' = ' + points + ' pts. (+' + earnedGold + ' Gold)');
    }

    card.played = true;
    cardsPlayedThisRoom++;
    
    if (hp <= 0) {
        log("You died! Game Over.");
        hp = 0;
        gameOver = true;
        currentRoom.forEach(c => c.played = true);
    } else if (score >= targetScore) {
        log('🎉 TARGET SCORE REACHED! (' + score + '/' + targetScore + ') 🎉');
        gameOver = true;
        currentRoom.forEach(c => c.played = true);
        
        setTimeout(() => {
            nextChamber();
        }, 1500);
    }

    updateUI();
}


const shopDb = [
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
    currentChestCost = 5;
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

    let chestItem = { id: 'lootbox', name: 'Mysterious Chest', type: 'chest', displayType: 'Lootbox', cost: currentChestCost, desc: 'Open to draft 1 of 3 random items.' };
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
    if (gold < currentChestCost) {
        log("Shop: Not enough gold for Chest!");
        return;
    }
    gold -= currentChestCost;
    currentChestCost += 5;
    item.cost = currentChestCost;
    updateShopGold();
    
    el.lastElementChild.innerText = currentChestCost + ' G';
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

initGame();
