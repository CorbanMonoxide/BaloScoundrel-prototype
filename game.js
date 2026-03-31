let deck = [];
let currentRoom = [];
let hp = 20;
let shieldHp = 0;
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
let currentItem = null;
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
    document.getElementById('hp').innerText = hp + ' / 20' + (typeof shieldHp !== 'undefined' && shieldHp > 0 ? ' [+' + shieldHp + ']' : '');
    document.getElementById('score').innerText = score;
    document.getElementById('gold').innerText = gold;
    document.getElementById('mult').innerText = currentWeaponValue ? currentWeaponValue + 'x' : '1x';
    document.getElementById('weapon').innerText = currentWeaponValue ? '♦ ' + currentWeaponValue + ' (Max: ' + currentWeaponLimit + ')' : 'None';
    document.getElementById('item').innerText = currentItem ? currentItem.name : 'None';
    document.getElementById('deck-count').innerText = deck.length;
    const tUI = document.getElementById('talismans-ui');
    tUI.innerText = talismans.length + '/4';
    const tParent = tUI.parentElement;
    
    if (talismans.length > 0) {
        tParent.classList.add('tooltip');
        let tt = tParent.querySelector('.tooltiptext');
        if (!tt) {
            tt = document.createElement('div');
            tt.className = 'tooltiptext';
            tParent.appendChild(tt);
        }
        tt.innerHTML = talismans.map(t => `<strong style="color:#89b4fa;">${t.name}</strong><br>${t.desc}`).join('<br><br>');
    } else {
        tParent.classList.remove('tooltip');
        let tt = tParent.querySelector('.tooltiptext');
        if (tt) tt.remove();
    }
    
    document.getElementById('target').innerText = targetScore + ' (D' + currentDungeon + 'C' + currentChamber + ')';
    
    const roomDiv = document.getElementById('room');
    roomDiv.innerHTML = '';
    currentRoom.forEach((card, index) => {
        const el = document.createElement('div');
        el.className = 'card ' + suits[card.suit].type + (card.played ? ' hidden' : '');
        
        let suitColor = (card.suit === 'Hearts' || card.suit === 'Diamonds') ? '#e53935' : '#000000';
        el.innerHTML = '<div style="margin-top: 15px;"><span style="color:' + suitColor + ';">' + suits[card.suit].symbol + '</span> <span style="color:#000000;">' + card.display + '</span></div>';
        
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
            
            el.onclick = () => {
                if (!canUseWeapon) playCard(index, false);
            };
        } else {
            el.onclick = () => playCard(index, false);
        }
        
        roomDiv.appendChild(el);
    });

    document.getElementById('btn-flee').disabled = gameOver || fledLastRoom || cardsPlayedThisRoom > 0;
    document.getElementById('btn-use-item').disabled = gameOver || !currentItem;
    document.getElementById('btn-next').disabled = gameOver || currentRoom.filter(c => !c.played).length > 1;
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
    shieldHp = 0;
    talismans = [];
    extraCards = [];
    currentItem = null;
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
    
    if (unplayed.length === 1 && suits[unplayed[0].suit].type === 'monster' && !fledLastRoom && cardsPlayedThisRoom > 0) {
        if (typeof hasTalisman === 'function' && hasTalisman('t_coward')) {
            hp = Math.min(20, hp + 1);
            log("Coward's Luck: Healed 1 HP for leaving a monster behind.");
        }
    }
    
    currentRoom = [...unplayed];

    while(currentRoom.length < 4 && deck.length > 0) {
        let cardToDraw = deck.pop();
        cardToDraw.played = false;
        currentRoom.push(cardToDraw);
    }
    
    if (typeof hasTalisman === 'function' && hasTalisman('t_scary')) {
        let targetIdx = currentRoom.findIndex(c => suits[c.suit].type === 'monster' && c.value <= 8 && !c.played);
        if (targetIdx !== -1) {
            let scaredCard = currentRoom.splice(targetIdx, 1)[0];
            deck.unshift(scaredCard);
            log("Scary Aura frightened a " + scaredCard.display + " Monster to the bottom of the deck!");
        }
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
    if (currentRoom.filter(c => !c.played).length <= 1) {
        log("You must leave 1 card behind! Click Next Room.");
        return;
    }
    
    const card = currentRoom[index];
    if (card.played) return;
    
    const type = suits[card.suit].type;
    
    if (type === 'potion') {
        if (potionUsedThisTurn && !(typeof hasTalisman === 'function' && hasTalisman('m_flask'))) {
            log("Already drank a potion this room! Potion wasted.");
            // Do not return. Let it fall through to be marked as played.
        } else {
            const heal = card.value;
            if (hp + heal > 20) {
                const excess = (hp + heal) - 20;
                hp = 20;
                if (typeof hasTalisman === 'function' && hasTalisman('t_blood')) {
                    shieldHp += excess;
                    log('Blood Vial: Converted ' + excess + ' excess healing to Shield HP!');
                } else {
                    log('Drank potion. HP full.');
                }
            } else {
                hp += heal;
                log('Drank potion. Restored ' + heal + ' HP.');
            }
            potionUsedThisTurn = true;
        }
    } 
    else if (type === 'weapon') {
        currentWeaponValue = card.value;
        currentWeaponLimit = 15; 
        currentWeaponMult = card.value;
        log('Equipped Weapon ' + card.display + '.');
    } 
    else if (type === 'monster') {
        let killMult = 1;
        let dmg = 0;
        let isBarehanded = true;
        
        if (useWeaponChoice && currentWeaponValue !== null && card.value <= currentWeaponLimit) {
            isBarehanded = false;
            killMult = currentWeaponValue;
            
            let effWeaponVal = currentWeaponValue;
            if (typeof hasTalisman === 'function' && hasTalisman('t_blacksmith')) effWeaponVal += 3;
            if (typeof hasTalisman === 'function' && hasTalisman('t_silver') && card.suit === 'Clubs') effWeaponVal *= 2;
            
            dmg = Math.max(0, card.value - effWeaponVal);
            
            log('Attacked ' + card.display + ' Monster with Weapon! Base dmg: ' + dmg);
            currentWeaponLimit = card.value;
            // Multiplier no longer degrades, stays at weapon face value
        } else {
            isBarehanded = true;
            dmg = card.value;
            
            if (typeof hasTalisman === 'function' && hasTalisman('t_iron')) {
                dmg = Math.max(0, dmg - 3);
                killMult = 4;
                log('Fists of Iron! Damage reduced, Mult x4.');
            } else {
                killMult = 1;
            }
            
            if (currentWeaponValue !== null && card.value > currentWeaponLimit) {
                log('Monster (' + card.display + ') > Limit. Forced Barehanded!');
            } else if (currentWeaponValue !== null && !useWeaponChoice) {
                log('Chose barehanded against ' + card.display + '! Saved weapon.');
            } else {
                log('Fought ' + card.display + ' barehanded!');
            }
        }
        
        if (typeof hasTalisman === 'function' && hasTalisman('t_quick')) {
            dmg = Math.max(0, dmg - 2);
        }
        
        if (dmg > 0 && typeof shieldHp !== 'undefined' && shieldHp > 0) {
            let block = Math.min(shieldHp, dmg);
            shieldHp -= block;
            dmg -= block;
            log('Shield absorbed ' + block + ' dmg. (' + shieldHp + ' Shield left)');
        }
        
        hp -= dmg;
        if (dmg > 0) log('Took ' + dmg + ' damage to HP.');
        
        let earnedGold = (card.value <= 10) ? 1 : (card.value - 9);
        if (isBarehanded && typeof hasTalisman === 'function' && hasTalisman('t_pick')) { earnedGold += 2; log('Pickpocket: +2G'); }
        if (card.value >= 10 && typeof hasTalisman === 'function' && hasTalisman('t_bounty')) { earnedGold += 2; log('Bounty Hunter: +2G'); }
        
        gold += earnedGold;
        const points = (card.value * 10) * killMult;
        score += points;
        log('Defeated ' + card.display + '! Scored ' + (card.value*10) + ' x ' + killMult + ' = ' + points + ' pts. (+' + earnedGold + ' Gold)');
    }

    card.played = true;
    cardsPlayedThisRoom++;
    
    if (hp <= 0 && typeof hasTalisman === 'function' && hasTalisman('t_undying')) {
        hp = 5;
        removeTalisman('t_undying');
        log('✨ UNDYING ACTIVATED! Revived with 5 HP! ✨');
    }
    
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



let shopDb = [
    { id: 't_silver', name: 'Silver Blades', type: 'talisman', displayType: 'Common Talisman', cost: 10, desc: 'Weapons 2x Dmg vs Clubs' },
    { id: 't_quick', name: 'Quick Feet', type: 'talisman', displayType: 'Common Talisman', cost: 10, desc: 'Dodge 2 damage' },
    { id: 't_pick', name: 'Pickpocket', type: 'talisman', displayType: 'Common Talisman', cost: 10, desc: '+2G on fist kill' },
    { id: 't_coward', name: 'Cowards Luck', type: 'talisman', displayType: 'Common Talisman', cost: 10, desc: 'Heal 1 on leaving monster' },
    { id: 't_blacksmith', name: 'Expert Blacksmith', type: 'talisman', displayType: 'Uncommon Talisman', cost: 10, desc: 'Weapons +3 dmg' },
    { id: 't_scary', name: 'Scary Aura', type: 'talisman', displayType: 'Uncommon Talisman', cost: 10, desc: 'Scare monster <= 8' },
    { id: 't_bounty', name: 'Bounty Hunter', type: 'talisman', displayType: 'Uncommon Talisman', cost: 10, desc: '+2G for kills >= 10' },
    { id: 't_iron', name: 'Fists of Iron', type: 'talisman', displayType: 'Rare Talisman', cost: 10, desc: 'Fist dmg -3, Mult x4' },
    { id: 't_blood', name: 'Blood Vial', type: 'talisman', displayType: 'Rare Talisman', cost: 10, desc: 'Excess heal to Shield' },
    { id: 't_undying', name: 'Undying', type: 'talisman', displayType: 'Legendary Talisman', cost: 10, desc: 'Revive at 5HP (1 use)' },
    { id: 'c_shield', name: 'Shield', type: 'consumable', displayType: 'Uncommon Consumable', cost: 5, desc: '+5 Temp HP' },
    { id: 'c_smoke', name: 'Smokescreen', type: 'consumable', displayType: 'Uncommon Consumable', cost: 5, desc: 'Hide 1 monster' }
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
        let suitColor = (item.cardData.suit === 'Hearts' || item.cardData.suit === 'Diamonds') ? '#e53935' : '#000000';
        visualHtml = `<div class="card ${cssClass}" style="margin: 10px auto; pointer-events: none; transform: none; box-shadow: 0 4px 8px rgba(0,0,0,0.3); height: 80px; width: 60px; font-size: 1.2rem; display: flex; align-items: center; justify-content: center; background: #ffffff; border: 1px solid #ccc; border-radius: 8px;">
            <div style="margin-top: 5px;"><span style="color:${suitColor};">${symbol}</span> <span style="color:#000000;">${item.cardData.display}</span></div>
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
            shopDb = shopDb.filter(i => i.id !== item.id);
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

function hasTalisman(id) { return talismans.some(t => t.id === id); }
function removeTalisman(id) { talismans = talismans.filter(t => t.id !== id); updateUI(); }

function openSellMenu() {
    document.getElementById('sell-modal').style.display = 'flex';
    renderSellItems();
}

function closeSellMenu() {
    document.getElementById('sell-modal').style.display = 'none';
}

function renderSellItems() {
    const container = document.getElementById('sell-items');
    container.innerHTML = '';
    
    if (talismans.length === 0) {
        container.innerHTML = '<div style="color:#a6adc8; font-size:1.2rem;">No Talismans to sell.</div>';
        return;
    }
    
    talismans.forEach((t, index) => {
        const el = document.createElement('div');
        el.style = 'border: 1px solid #f38ba8; padding: 15px; border-radius: 8px; width: 140px; cursor: pointer; background: #313244; transition: 0.2s; display:flex; flex-direction:column; justify-content:space-between;';
        el.innerHTML = `<h3 style="margin-top:0; color:#89b4fa; font-size:1rem; margin-bottom:5px;">${t.name}</h3><p style="font-size:0.75rem; color:#a6adc8; margin-top:0;">${t.desc}</p><div style="color:#a6e3a1; font-weight:bold; margin-top:10px;">Sell: 5 G</div>`;
        
        el.onmouseover = () => el.style.borderColor = '#a6e3a1';
        el.onmouseout = () => el.style.borderColor = '#f38ba8';
        
        el.onclick = () => {
            gold += 5;
            talismans.splice(index, 1);
            // Put it back in the shop pool so they can buy it again later if they want
            shopDb.push(t);
            updateShopGold();
            updateUI();
            renderSellItems();
            log("Shop: Sold " + t.name + " for 5G.");
        };
        container.appendChild(el);
    });
}

function useItem() {
    if (gameOver || !currentItem) return;
    
    if (currentItem.id === 'c_shield') {
        shieldHp += 5;
        log('Used Shield! Gained 5 Temp HP.');
        currentItem = null;
        updateUI();
    } else if (currentItem.id === 'c_smoke') {
        let targetIdx = -1;
        let maxVal = -1;
        currentRoom.forEach((c, i) => {
            if (!c.played && suits[c.suit].type === 'monster' && c.value > maxVal) {
                maxVal = c.value;
                targetIdx = i;
            }
        });
        
        if (targetIdx !== -1) {
            let hiddenCard = currentRoom.splice(targetIdx, 1)[0];
            deck.unshift(hiddenCard);
            log('Used Smokescreen! Hid the ' + hiddenCard.display + ' Monster (sent to bottom of deck).');
            currentItem = null;
            updateUI();
        } else {
            log('No monsters to hide! Item not used.');
        }
    }
}
