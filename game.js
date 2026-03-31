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
    document.getElementById('log').innerHTML = '';
    log("Game started. Entering Dungeon 1, Chamber 1.");
    openShop();
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

initGame();

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
