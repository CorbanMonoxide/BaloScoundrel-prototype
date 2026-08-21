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

// Room-scoped scoring accumulators (Room = Hand)
let roomBase = 0;
let roomMult = 0;

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
let pendingBoosterPack = null;
let shopRerollCount = 0;

// Talisman effect state
let fleeCount = 0;
let temperedSteelUsed = false;
let smokeBombUsedThisChamber = false;
let evasionUsedThisChamber = false;

const suits = {
    'Spades': { symbol: '♠', type: 'monster' },
    'Clubs': { symbol: '♣', type: 'monster' },
    'Diamonds': { symbol: '♦', type: 'weapon' },
    'Hearts': { symbol: '♥', type: 'potion' }
};

function weaponType(value) {
    // Diamond weapons 2-10 (see Scoundrel Weapons.md)
    if ([6, 9, 10].includes(value)) return 'Sharp';
    if ([2, 4, 5, 8].includes(value)) return 'Blunt';
    if ([3, 7].includes(value)) return 'Piercing';
    return null;
}

function monsterType(value) {
    // Black-suit monsters 2-14 (see Scoundrel Monsters.md)
    if (value <= 3) return 'Zombie';
    if (value <= 5) return 'Skeleton';
    if (value <= 7) return 'Ghost';
    if (value <= 9) return 'Elemental';
    if (value <= 11) return 'Demon';
    if (value <= 13) return 'Dragon';
    return 'Lich';
}

function displayForValue(value) {
    if (value === 11) return 'J';
    if (value === 12) return 'Q';
    if (value === 13) return 'K';
    if (value === 14) return 'A';
    return value.toString();
}

const magicDb = [
    { id: 'm_bank', name: 'Bank Gold', type: 'magic', displayType: 'Magic Item', cost: 25, desc: 'Earn interest on gold' },
    { id: 'm_belt', name: 'Talisman Belt', type: 'magic', displayType: 'Magic Item', cost: 25, desc: '+1 Talisman Capacity' },
    { id: 'm_evasion', name: 'Evasion Tactics', type: 'magic', displayType: 'Magic Item', cost: 25, desc: 'Skip 2 rooms in a row' },
    { id: 'm_flask', name: 'Bottomless Flask', type: 'magic', displayType: 'Magic Item', cost: 25, desc: 'Drink 2 potions per room' },
    { id: 'm_key', name: 'Master Key', type: 'magic', displayType: 'Magic Item', cost: 25, desc: 'Pick 2 items from Chests' },
    { id: 'm_arcane', name: 'Arcane Supplier', type: 'magic', displayType: 'Magic Item', cost: 25, desc: 'More Rare Consumables' }
];

const shopDb = [
    // === COMMON TALISMANS ===
    { id: 't_tempered', name: 'Tempered Steel', type: 'talisman', rarity: 'common', cost: 4, desc: 'First weapon kill does not degrade it' },
    { id: 't_quick', name: 'Quick Feet', type: 'talisman', rarity: 'common', cost: 4, desc: 'Incoming damage reduced by 2' },
    { id: 't_pick', name: 'Pickpocket', type: 'talisman', rarity: 'common', cost: 4, desc: '+2G on every barehanded kill' },
    { id: 't_sharp', name: 'Sharp Blades', type: 'talisman', rarity: 'common', cost: 4, desc: 'Sharp weapons +5 mult when equipped' },
    { id: 't_heavy', name: 'Heavy Hitter', type: 'talisman', rarity: 'common', cost: 4, desc: 'Blunt weapons +5 mult when equipped' },
    { id: 't_pierce', name: 'Piercing Blows', type: 'talisman', rarity: 'common', cost: 4, desc: 'Piercing weapons +5 mult when equipped' },
    { id: 't_grave', name: 'Grave Digger', type: 'talisman', rarity: 'common', cost: 4, desc: '+10 base essence vs Zombies' },
    { id: 't_ghost', name: 'Ghost Buster', type: 'talisman', rarity: 'common', cost: 4, desc: '+10 base essence vs Ghosts & Elementals' },
    { id: 't_abom', name: 'Abomination Hater', type: 'talisman', rarity: 'common', cost: 4, desc: '+10 base essence vs Demons & Dragons' },
    { id: 't_chump', name: 'Chump Change', type: 'talisman', rarity: 'common', cost: 4, desc: '+1G for kills of strength 6 or lower' },
    { id: 't_desperate', name: 'Desperate Blows', type: 'talisman', rarity: 'common', cost: 4, desc: 'Weapons under 50% durability deal +2 dmg' },
    { id: 't_copper', name: 'Copper Talisman', type: 'talisman', rarity: 'common', cost: 4, desc: '+2x base score multiplier' },
    { id: 't_bloodmoney', name: 'Blood Money', type: 'talisman', rarity: 'common', cost: 4, desc: '+1G for each damage taken' },
    { id: 't_overkill', name: 'Overkill', type: 'talisman', rarity: 'common', cost: 4, desc: '+1G for each damage over monster strength' },
    { id: 't_strpot', name: 'Strength Potions', type: 'talisman', rarity: 'common', cost: 4, desc: 'Potions add their value to mult' },
    { id: 't_essential', name: 'Essential Talisman', type: 'talisman', rarity: 'common', cost: 4, desc: '+3 mult for each held talisman' },
    // === UNCOMMON TALISMANS ===
    { id: 't_blacksmith', name: 'Expert Blacksmith', type: 'talisman', rarity: 'uncommon', cost: 6, desc: 'All weapons deal +3 damage' },
    { id: 't_scary', name: 'Scary Aura', type: 'talisman', rarity: 'uncommon', cost: 6, desc: 'Scare 1 monster (4 or less) to bottom of deck' },
    { id: 't_bounty', name: 'Bounty Hunter', type: 'talisman', rarity: 'uncommon', cost: 6, desc: '+5G for kills of strength 10 or higher' },
    { id: 't_steel', name: 'Steel Talisman', type: 'talisman', rarity: 'uncommon', cost: 6, desc: '+2x base score multiplier' },
    { id: 't_smoke', name: 'Smoke Bomb', type: 'talisman', rarity: 'uncommon', cost: 6, desc: 'Skip a room mid-clear, once per chamber' },
    { id: 't_iron', name: 'Fists of Iron', type: 'talisman', rarity: 'uncommon', cost: 6, desc: 'Fist dmg -3, barehanded mult 10x' },
    { id: 't_intimidate', name: 'Intimidation', type: 'talisman', rarity: 'uncommon', cost: 6, desc: 'Left-behind monster loses 2 strength next room' },
    { id: 't_cowardcharm', name: "Coward's Charm", type: 'talisman', rarity: 'uncommon', cost: 6, desc: 'Fleeing grants 500 essence per flee this run' },
    { id: 't_sharp_senses', name: 'Sharp Senses', type: 'talisman', rarity: 'uncommon', cost: 6, desc: 'Sharp weapons +10 mult; dmg taken -2' },
    { id: 't_heavy_thoughts', name: 'Heavy Thoughts', type: 'talisman', rarity: 'uncommon', cost: 6, desc: 'Blunt weapons +10 mult; dmg taken -2' },
    { id: 't_pierce_screams', name: 'Piercing Screams', type: 'talisman', rarity: 'uncommon', cost: 6, desc: 'Piercing weapons +10 mult; dmg taken -2' },
    // === RARE TALISMANS ===
    { id: 't_blood', name: 'Blood Vial', type: 'talisman', rarity: 'rare', cost: 8, desc: 'Excess heal to Shield HP (cap 30)' },
    { id: 't_undying', name: 'Undying', type: 'talisman', rarity: 'rare', cost: 10, desc: 'Revive at 5 HP (destroyed on use)' },
    { id: 't_gold', name: 'Gold Talisman', type: 'talisman', rarity: 'rare', cost: 8, desc: '+4x base score multiplier' },
    { id: 't_evasion', name: 'Evasion Tactics', type: 'talisman', rarity: 'rare', cost: 8, desc: 'Flee two rooms in a row, once per chamber' },
    // === CONSUMABLES ===
    { id: 'c_shield', name: 'Shield', type: 'consumable', cost: 5, desc: 'Single-use: +5 Temp HP' },
    { id: 'c_smoke', name: 'Smokescreen', type: 'consumable', cost: 5, desc: 'Single-use: Hide 1 monster' },
    { id: 'c_heal', name: 'Healing Salve', type: 'consumable', cost: 8, desc: 'Restore 10 HP immediately' },
    { id: 'c_armor', name: 'Armor Plate', type: 'consumable', cost: 6, desc: '+5 Shield immediately' }
];

function pickWeightedShopItem() {
    // Weighted shop draft: instant health (high rate), instant armor (lower rate).
    // Talismans weighted by rarity (rare rarer, common common).
    const entries = shopDb.map(db => {
        let w = 4;
        if (db.type === 'talisman') {
            if (db.rarity === 'uncommon') w = 2;
            else if (db.rarity === 'rare') w = 1;
        }
        if (db.id === 'c_heal') w = 45;
        if (db.id === 'c_armor') w = 15;
        return { item: db, weight: w };
    });
    const total = entries.reduce((s, e) => s + e.weight, 0);
    let r = Math.random() * total;
    for (const e of entries) {
        r -= e.weight;
        if (r <= 0) return { ...e.item };
    }
    return { ...entries[entries.length - 1].item };
}

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
    document.getElementById('room-base').innerText = roomBase;
    document.getElementById('room-mult').innerText = roomMult;
    document.getElementById('weapon').innerText = currentWeaponValue ? '♦ ' + currentWeaponValue + ' ' + (weaponType(currentWeaponValue) || '') + ' (Max: ' + currentWeaponLimit + ')' : 'None';
    document.getElementById('deck-count').innerText = deck.length;
    document.getElementById('talismans-ui').innerText = talismans.length + '/4';
    const tl = document.getElementById('talisman-list');
    if (tl) tl.innerHTML = talismans.length === 0 ? '' : '💠 ' + talismans.map(t => t.name).join(' · ');
    
    document.getElementById('target').innerText = targetScore + ' (D' + currentDungeon + 'C' + currentChamber + ')';
    document.getElementById('btn-use-item').style.display = currentItem ? 'block' : 'none';
    document.getElementById('item').innerText = currentItem ? currentItem.name : 'None';
    
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

    let fleeAllowed = !gameOver;
    if (cardsPlayedThisRoom > 0) {
        fleeAllowed = hasTalisman('t_smoke') && !smokeBombUsedThisChamber;
    } else if (fledLastRoom) {
        fleeAllowed = hasTalisman('t_evasion') && !evasionUsedThisChamber;
    }
    document.getElementById('btn-flee').disabled = !fleeAllowed;
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
    fleeCount = 0;
    temperedSteelUsed = false;
    smokeBombUsedThisChamber = false;
    evasionUsedThisChamber = false;
    rollMagicItem();
    document.getElementById('log').innerHTML = '';
    log("Game started. Entering Dungeon 1, Chamber 1.");
    startChamber();
}

function startChamber() {
    // Exponential target scaling (Balatro-style): geometric across dungeons,
    // fixed multipliers within a dungeon (chambers 1/2/3).
    // G = 3 is a placeholder growth rate — needs playtesting once talismans land.
    const chamberMult = [1, 1.5, 2];
    const G = 3;
    const dungeonBase = 1000 * Math.pow(G, currentDungeon - 1);
    targetScore = Math.round(dungeonBase * chamberMult[currentChamber - 1]);
    buildDeck();
    score = 0; 
    currentWeaponValue = null;
    currentWeaponLimit = null;
    currentWeaponMult = 1;
    roomBase = 0;
    roomMult = 0;
    fledLastRoom = false;
    smokeBombUsedThisChamber = false;
    evasionUsedThisChamber = false;
    currentRoom = [];
    gameOver = false;
    
    log('--- Dungeon ' + currentDungeon + ' Chamber ' + currentChamber + ' ---');
    log('Target Score: ' + targetScore);
    drawRoom();
}

function drawRoom() {
    if (gameOver) return;
    document.getElementById('room-result').style.display = 'none';

    if (deck.length === 0 && currentRoom.filter(c => !c.played).length === 0) {
        gameOver = true;
        log("Out of cards! You failed the Chamber.");
        updateUI();
        return;
    }
    
    const unplayed = currentRoom.filter(c => !c.played);
    
    // Check if this is a room completion (all cards cleared, not end of deck)
    const roomCompleted = unplayed.length === 0 && deck.length > 0;
    
    if (unplayed.length === 1 && suits[unplayed[0].suit].type === 'monster' && !fledLastRoom && cardsPlayedThisRoom > 0) {
        if (hasTalisman('t_intimidate') && !unplayed[0].intimidated) {
            const m = unplayed[0];
            const old = m.display;
            m.value = Math.max(2, m.value - 2);
            m.display = displayForValue(m.value);
            m.intimidated = true;
            log('Intimidation: the ' + old + ' Monster weakens to ' + m.display + ' for next room.');
        }
    }
    
    currentRoom = [...unplayed];

    while(currentRoom.length < 4 && deck.length > 0) {
        let cardToDraw = deck.pop();
        cardToDraw.played = false;
        currentRoom.push(cardToDraw);
    }
    
    if (hasTalisman('t_scary')) {
        let targetIdx = currentRoom.findIndex(c => suits[c.suit].type === 'monster' && c.value <= 4 && !c.played);
        if (targetIdx !== -1) {
            let scaredCard = currentRoom.splice(targetIdx, 1)[0];
            deck.unshift(scaredCard);
            log("Scary Aura frightened a " + scaredCard.display + " Monster to the bottom of the deck!");
        }
    }
    
    cardsPlayedThisRoom = 0;
    potionUsedThisTurn = false;
    updateUI();
}

function fleeRoom() {
    if (gameOver) return;
    
    // Smoke Bomb: allows skipping a room even mid-clear, once per chamber.
    let usingSmoke = false;
    if (cardsPlayedThisRoom > 0) {
        if (hasTalisman('t_smoke') && !smokeBombUsedThisChamber) {
            usingSmoke = true;
            smokeBombUsedThisChamber = true;
        } else {
            return;
        }
    }
    
    // Evasion Tactics: allows fleeing two rooms in a row, once per chamber.
    if (fledLastRoom) {
        if (hasTalisman('t_evasion') && !evasionUsedThisChamber) {
            evasionUsedThisChamber = true;
        } else {
            return;
        }
    }
    
    log(usingSmoke ? "Smoke Bomb! Skipped the room, scooping all cards to the bottom." : "Fled the room! Scooped all cards to the bottom of the deck.");
    currentRoom.forEach(c => deck.unshift(c)); 
    currentRoom = [];
    fledLastRoom = true;
    fleeCount++;
    
    if (hasTalisman('t_cowardcharm')) {
        const essence = 500 * fleeCount;
        score += essence;
        log("Coward's Charm: +" + essence + " essence (flee #" + fleeCount + ").");
    }
    
    drawRoom();
}

// ============================================================================
// BOOSTER PACK SYSTEM - Complete Implementation
// ============================================================================

// Pack type definitions
const boosterPackTypes = [
    {
        id: 'love',
        name: 'Love Pack',
        desc: 'Healing & Recovery Focus',
        weights: { potion: 50, monster: 20, weapon: 20, talisman: 5, item: 5 },
        rarity: 'common'
    },
    {
        id: 'monster',
        name: 'Monster Booster',
        desc: 'Dense Combat Encounters',
        weights: { monster: 50, potion: 20, weapon: 20, talisman: 5, item: 5 },
        rarity: 'common'
    },
    {
        id: 'builders',
        name: 'Builders Box',
        desc: 'Economy & Utility Items',
        weights: { item: 50, talisman: 20, monster: 20, weapon: 5, potion: 5 },
        rarity: 'uncommon'
    },
    {
        id: 'armory',
        name: 'Armory Pack',
        desc: 'Weapon Diversity & Scaling',
        weights: { weapon: 50, talisman: 20, monster: 20, potion: 5, item: 5 },
        rarity: 'uncommon'
    },
    {
        id: 'shiny',
        name: 'Shiny Booster',
        desc: 'Ultra-Rare Game-Changers',
        weights: { legendary: 50, rare: 20, uncommon: 20, monster: 5, weapon: 5 },
        rarity: 'rare'
    }
];

let pendingBoosterPacks = null;
let selectedPackContents = null;

// Select a random pack type (weighted by rarity)
function selectRandomPackType() {
    let rand = Math.random() * 100;
    let cumulative = 0;
    
    for (let pack of boosterPackTypes) {
        let weight = pack.rarity === 'common' ? 40 : pack.rarity === 'uncommon' ? 20 : 2;
        cumulative += weight;
        if (rand < cumulative) return pack;
    }
    return boosterPackTypes[0];
}

// Generate 2 random packs for player to choose from
function generateBoosterPacks() {
    pendingBoosterPacks = [selectRandomPackType(), selectRandomPackType()];
}

// Show pack selection UI (2 packs side-by-side)
function showPackSelectionUI() {
    document.getElementById('game-screen').style.display = 'none';
    
    let screen = document.getElementById('booster-pack-screen');
    if (!screen) {
        screen = document.createElement('div');
        screen.id = 'booster-pack-screen';
        document.body.appendChild(screen);
    }
    
    let html = '<div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.95);display:flex;align-items:center;justify-content:center;z-index:1000;">';
    html += '<div style="background:#1e1e2e;border:3px solid #f9e2af;border-radius:10px;padding:40px;max-width:900px;text-align:center;">';
    html += '<h2 style="margin-top:0;color:#f9e2af;font-family:monospace;font-size:1.5rem;">🎁 CHOOSE A BOOSTER PACK</h2>';
    html += '<p style="color:#a6adc8;font-family:monospace;margin-bottom:30px;">Pick one to continue...</p>';
    html += '<div style="display:flex;gap:40px;justify-content:center;margin:30px 0;">';
    
    for (let i = 0; i < pendingBoosterPacks.length; i++) {
        let pack = pendingBoosterPacks[i];
        html += '<div style="border:2px solid #a6adc8;border-radius:8px;padding:25px;flex:1;cursor:pointer;transition:all 0.2s;font-family:monospace;background:#181825;" ';
        html += 'onmouseover="this.style.borderColor=\'#cba6f7\';this.style.background=\'#313244\';" ';
        html += 'onmouseout="this.style.borderColor=\'#a6adc8\';this.style.background=\'#181825\';" ';
        html += 'onclick="selectPackType(' + i + ')">';
        html += '<h3 style="margin:0 0 10px 0;color:#f9e2af;">' + pack.name + '</h3>';
        html += '<p style="margin:0 0 20px 0;color:#a6adc8;font-size:0.9rem;">' + pack.desc + '</p>';
        html += '<button style="padding:12px 30px;background:#cba6f7;color:#1e1e2e;border:none;border-radius:4px;cursor:pointer;font-weight:bold;font-family:monospace;font-size:1rem;">OPEN</button>';
        html += '</div>';
    }
    
    html += '</div></div></div>';
    screen.innerHTML = html;
    screen.style.display = 'block';
}

// Generate 5 items based on pack weights
function generatePackContents(packType) {
    let contents = [];
    let weights = packType.weights;
    
    for (let i = 0; i < 5; i++) {
        let item = selectItemByWeight(weights);
        contents.push(item);
    }
    
    return contents;
}

// Select an item based on weights
function selectItemByWeight(weights) {
    let totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
    let rand = Math.random() * totalWeight;
    let cumulative = 0;
    
    for (let [type, weight] of Object.entries(weights)) {
        cumulative += weight;
        if (rand < cumulative) {
            return generateItemOfType(type);
        }
    }
    
    return generateItemOfType('monster');
}

// Generate a specific item type
function generateItemOfType(type) {
    switch(type) {
        case 'potion': {
            let val = Math.floor(Math.random() * 9) + 2;
            return {
                suit: 'Hearts',
                value: val,
                display: val,
                name: 'Potion ' + val,
                type: 'potion',
                auto: true
            };
        }
        case 'weapon': {
            let val = Math.floor(Math.random() * 9) + 2;
            return {
                suit: 'Diamonds',
                value: val,
                display: val,
                name: 'Weapon ' + val,
                type: 'weapon',
                auto: true
            };
        }
        case 'monster': {
            let val = Math.floor(Math.random() * 13) + 2;
            let suit = Math.random() < 0.5 ? 'Spades' : 'Clubs';
            let display = val;
            if (val === 11) display = 'J';
            if (val === 12) display = 'Q';
            if (val === 13) display = 'K';
            if (val === 14) display = 'A';
            return {
                suit: suit,
                value: val,
                display: display,
                name: display + suits[suit].symbol,
                type: 'monster',
                auto: true
            };
        }
        case 'talisman': {
            let talismans = shopDb.filter(t => t.type === 'talisman' && t.rarity === 'common');
            let tal = talismans[Math.floor(Math.random() * talismans.length)];
            return { ...tal, auto: false };
        }
        case 'item': {
            let items = shopDb.filter(t => t.type === 'consumable' || t.type === 'magic');
            let itm = items[Math.floor(Math.random() * items.length)];
            return { ...itm, auto: false };
        }
        case 'rare': {
            let talismans = shopDb.filter(t => t.type === 'talisman' && t.rarity === 'rare');
            let tal = talismans[Math.floor(Math.random() * talismans.length)];
            return { ...tal, auto: false };
        }
        case 'uncommon': {
            let talismans = shopDb.filter(t => t.type === 'talisman' && t.rarity === 'uncommon');
            let tal = talismans[Math.floor(Math.random() * talismans.length)];
            return { ...tal, auto: false };
        }
        case 'legendary': {
            let talismans = shopDb.filter(t => t.type === 'talisman' && t.rarity === 'rare');
            let tal = talismans[Math.floor(Math.random() * talismans.length)];
            return { ...tal, auto: false };
        }
        default:
            return generateItemOfType('monster');
    }
}

// Open the selected pack and show its contents
function selectPackType(index) {
    if (!pendingBoosterPacks || index < 0 || index >= pendingBoosterPacks.length) return;
    
    let selectedPack = pendingBoosterPacks[index];
    selectedPackContents = generatePackContents(selectedPack);
    
    document.getElementById('booster-pack-screen').style.display = 'none';
    showPackContentsUI(selectedPack, selectedPackContents);
}

// Show the pack contents with auto/optional indicators
function showPackContentsUI(packType, contents) {
    let screen = document.getElementById('booster-contents-screen');
    if (!screen) {
        screen = document.createElement('div');
        screen.id = 'booster-contents-screen';
        document.body.appendChild(screen);
    }
    
    let html = '<div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.95);display:flex;align-items:center;justify-content:center;z-index:1001;">';
    html += '<div style="background:#1e1e2e;border:3px solid #cba6f7;border-radius:10px;padding:40px;max-width:700px;font-family:monospace;max-height:80vh;overflow-y:auto;">';
    html += '<h2 style="margin-top:0;text-align:center;color:#f9e2af;">✨ ' + packType.name.toUpperCase() + ' ✨</h2>';
    html += '<div style="background:#313244;border-radius:6px;padding:20px;margin:30px 0;">';
    
    for (let i = 0; i < contents.length; i++) {
        let item = contents[i];
        let symbol = item.suit ? suits[item.suit].symbol : '🎁';
        let color = (item.suit === 'Hearts' || item.suit === 'Diamonds') ? '#e53935' : '#a6adc8';
        let display = item.display || item.name;
        let status = item.auto ? '✓ Added' : '☐ Optional';
        let statusColor = item.auto ? '#a6e3a1' : '#cba6f7';
        
        html += '<div style="margin-bottom:15px;padding:12px;background:#181825;border-radius:4px;display:flex;justify-content:space-between;align-items:center;border-left:3px solid ' + (item.auto ? '#a6e3a1' : '#cba6f7') + ';">';
        html += '<span style="color:' + color + ';"><strong>' + symbol + ' ' + display + '</strong></span>';
        html += '<span style="color:' + statusColor + ';font-size:0.9rem;">' + status + '</span>';
        html += '</div>';
    }
    
    html += '</div>';
    html += '<div style="text-align:center;">';
    html += '<button onclick="confirmPackSelection()" style="padding:15px 40px;background:#a6e3a1;color:#1e1e2e;border:none;border-radius:4px;cursor:pointer;font-weight:bold;font-family:monospace;font-size:1rem;">CONTINUE TO SHOP</button>';
    html += '</div>';
    html += '</div></div>';
    
    screen.innerHTML = html;
    screen.style.display = 'block';
}

// Confirm selection and add cards to deck
function confirmPackSelection() {
    if (!selectedPackContents) return;
    
    // Add all deck cards (auto=true) to extraCards
    selectedPackContents.forEach(item => {
        if (item.auto) {
            extraCards.push({ ...item });
            log('⭐ Added ' + item.name + ' from Booster Pack!');
        }
    });
    
    // Hide booster screens
    let boosterScreen = document.getElementById('booster-pack-screen');
    let contentsScreen = document.getElementById('booster-contents-screen');
    if (boosterScreen) boosterScreen.style.display = 'none';
    if (contentsScreen) contentsScreen.style.display = 'none';
    
    document.getElementById('game-screen').style.display = 'block';
    pendingBoosterPacks = null;
    selectedPackContents = null;
    
    // Proceed to shop
    nextChamber();
}

// Bridge function: show booster pack after score reached, before next chamber
function showBoosterPackBetweenRooms() {
    generateBoosterPacks();
    showPackSelectionUI();
}

function nextChamber() {
    currentChamber++;
    if (currentChamber > 3) {
        currentChamber = 1;
        currentDungeon++;
        hp = 20;
        shieldHp = 0;
        rollMagicItem();
        log('🎉 DUNGEON CLEARED! Full heal. Moving to Dungeon ' + currentDungeon);
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
        // Only heal if no potion used yet (unless you have Bottomless Flask)
        if (!potionUsedThisTurn || hasTalisman('m_flask')) {
            const heal = card.value;
            if (hp + heal > 20) {
                const excess = (hp + heal) - 20;
                hp = 20;
                if (hasTalisman('t_blood')) {
                    shieldHp = Math.min(30, shieldHp + excess);
                    log('Blood Vial: Converted ' + excess + ' excess healing to Shield HP! (capped at 30)');
                } else {
                    log('Drank potion. HP full.');
                }
            } else {
                hp += heal;
                log('Drank potion. Restored ' + heal + ' HP.');
            }
            // Strength Potions: potion value adds to mult
            if (hasTalisman('t_strpot')) {
                roomMult += card.value;
                log('Strength Potions: +' + card.value + ' mult.');
            }
        }
        // Silently discard if already used a potion this room
        potionUsedThisTurn = true;
    } 
    else if (type === 'weapon') {
        currentWeaponValue = card.value;
        currentWeaponLimit = 15; 
        currentWeaponMult = card.value;
        temperedSteelUsed = false; // reset per weapon equip
        
        const wtype = weaponType(card.value);
        let multBonus = 0;
        if (wtype === 'Sharp') {
            if (hasTalisman('t_sharp')) multBonus += 5;
            if (hasTalisman('t_sharp_senses')) multBonus += 10;
        } else if (wtype === 'Blunt') {
            if (hasTalisman('t_heavy')) multBonus += 5;
            if (hasTalisman('t_heavy_thoughts')) multBonus += 10;
        } else if (wtype === 'Piercing') {
            if (hasTalisman('t_pierce')) multBonus += 5;
            if (hasTalisman('t_pierce_screams')) multBonus += 10;
        }
        currentWeaponMult += multBonus;
        
        log('Equipped ' + (wtype || '?') + ' Weapon ' + card.display + (multBonus > 0 ? ' (+' + multBonus + ' mult)' : '') + '.');
    } 
    else if (type === 'monster') {
        const mtype = monsterType(card.value);
        let killMult = 1;
        let dmg = 0;
        let isBarehanded = true;
        let effWeaponVal = currentWeaponValue;
        
        if (useWeaponChoice && currentWeaponValue !== null && card.value <= currentWeaponLimit) {
            isBarehanded = false;
            killMult = currentWeaponMult;
            effWeaponVal = currentWeaponValue;
            
            if (hasTalisman('t_blacksmith')) effWeaponVal += 3;
            if (hasTalisman('t_desperate') && currentWeaponLimit < currentWeaponValue / 2) {
                effWeaponVal += 2;
                log('Desperate Blows: weapon under 50% durability, +2 dmg.');
            }
            
            dmg = Math.max(0, card.value - effWeaponVal);
            
            log('Attacked ' + card.display + ' ' + mtype + ' with Weapon!');
            
            // Tempered Steel: first kill with this weapon does not degrade it.
            if (hasTalisman('t_tempered') && !temperedSteelUsed) {
                temperedSteelUsed = true;
                log('Tempered Steel: weapon did not degrade.');
            } else {
                currentWeaponLimit = card.value;
                currentWeaponMult = card.value;
            }
        } else {
            isBarehanded = true;
            dmg = card.value;
            
            if (hasTalisman('t_iron')) {
                dmg = Math.max(0, dmg - 3);
                killMult = 10;
                log('Fists of Iron! Damage reduced, Mult 10x.');
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
        
        // Flat mult bonuses (Copper / Steel / Gold / Essential).
        if (hasTalisman('t_copper')) killMult += 2;
        if (hasTalisman('t_steel')) killMult += 2;
        if (hasTalisman('t_gold')) killMult += 4;
        if (hasTalisman('t_essential')) killMult += 3 * talismans.length;
        
        // Damage reduction (Quick Feet + Sharp Senses / Heavy Thoughts / Piercing Screams).
        let dmgReduction = 0;
        if (hasTalisman('t_quick')) dmgReduction += 2;
        if (hasTalisman('t_sharp_senses')) dmgReduction += 2;
        if (hasTalisman('t_heavy_thoughts')) dmgReduction += 2;
        if (hasTalisman('t_pierce_screams')) dmgReduction += 2;
        if (dmgReduction > 0) dmg = Math.max(0, dmg - dmgReduction);
        
        if (dmg > 0 && typeof shieldHp !== 'undefined' && shieldHp > 0) {
            let block = Math.min(shieldHp, dmg);
            shieldHp -= block;
            dmg -= block;
            log('Shield absorbed ' + block + ' dmg. (' + shieldHp + ' Shield left)');
        }
        
        hp -= dmg;
        if (dmg > 0) log('Took ' + dmg + ' damage to HP.');
        
        let earnedGold = (card.value <= 10) ? 1 : (card.value - 9);
        if (isBarehanded && hasTalisman('t_pick')) { earnedGold += 2; log('Pickpocket: +2G'); }
        if (card.value >= 10 && hasTalisman('t_bounty')) { earnedGold += 5; log('Bounty Hunter: +5G'); }
        if (card.value <= 6 && hasTalisman('t_chump')) { earnedGold += 1; log('Chump Change: +1G'); }
        if (hasTalisman('t_bloodmoney') && dmg > 0) { earnedGold += dmg; log('Blood Money: +' + dmg + 'G from damage taken'); }
        if (!isBarehanded && hasTalisman('t_overkill') && effWeaponVal > card.value) {
            const over = effWeaponVal - card.value;
            earnedGold += over;
            log('Overkill: +' + over + 'G');
        }
        
        gold += earnedGold;
        roomBase += card.value;
        // Monster-type base essence bonuses.
        if (hasTalisman('t_grave') && mtype === 'Zombie') { roomBase += 10; log('Grave Digger: +10 base vs ' + mtype); }
        if (hasTalisman('t_ghost') && (mtype === 'Ghost' || mtype === 'Elemental')) { roomBase += 10; log('Ghost Buster: +10 base vs ' + mtype); }
        if (hasTalisman('t_abom') && (mtype === 'Demon' || mtype === 'Dragon')) { roomBase += 10; log('Abomination Hater: +10 base vs ' + mtype); }
        roomMult += killMult;
        log('Defeated ' + card.display + ' ' + mtype + '! +' + card.value + ' base, +' + killMult + ' mult. (+' + earnedGold + ' Gold)');
    }

    card.played = true;
    cardsPlayedThisRoom++;
    fledLastRoom = false;
    
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
    } else if (cardsPlayedThisRoom >= 3) {
        // Room = hand: resolve the room score once 3 cards are cleared.
        resolveRoom();
    }

    updateUI();
}






// ============================================================================
// ROOM-SCOPED SCORING (Room = Hand)
// ============================================================================

function resolveRoom() {
    if (roomBase === 0) {
        // No monsters cleared this room (potions/weapons only) — no score.
        log('Room resolved: no monsters, no score.');
        roomBase = 0;
        roomMult = 0;
        return;
    }
    const prevScore = score;
    const base = roomBase;
    const mult = roomMult;
    const roomScore = base * mult;
    score += roomScore;
    roomBase = 0;
    roomMult = 0;

    showRoomResult(base, mult, roomScore, prevScore, score);
    log('🏠 Room resolved: ' + base + ' base × ' + mult + ' mult = ' + roomScore + ' pts (Total: ' + score + ')');

    if (score >= targetScore) {
        log('🎉 TARGET SCORE REACHED! (' + score + '/' + targetScore + ') 🎉');
        gameOver = true;
        currentRoom.forEach(c => c.played = true);
        setTimeout(() => {
            showBoosterPackBetweenRooms();
        }, 1500);
    }
}

function showRoomResult(base, mult, roomScore, prevScore, total) {
    const banner = document.getElementById('room-result');
    banner.innerHTML =
        '<div class="room-formula">Room Cleared: ' + base + ' Base × ' + mult + ' Mult</div>' +
        '<div class="room-total">+' + roomScore + ' pts</div>';
    banner.style.display = 'block';
    // Retrigger the pulse animation on every room.
    banner.style.animation = 'none';
    void banner.offsetWidth;
    banner.style.animation = 'roomPulse 0.4s ease-out';

    // Count the score up to the new total.
    const scoreEl = document.getElementById('score');
    const duration = 600;
    const startTime = performance.now();
    function step(now) {
        const t = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        scoreEl.innerText = Math.round(prevScore + (total - prevScore) * eased);
        if (t < 1) requestAnimationFrame(step);
        else scoreEl.innerText = total;
    }
    requestAnimationFrame(step);
}

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
    } else if (item.type === 'talisman') {
         visualHtml = `<div style="height: 75px; width: 50px; background: #45475a; border: 2px solid #89b4fa; border-radius: 6px; margin: 10px auto; display: flex; align-items: center; justify-content: center; font-size: 2rem; box-shadow: inset 0px 0px 8px rgba(0,0,0,0.8), 0 4px 6px rgba(0,0,0,0.3);">💠</div>`;
    } else if (item.type === 'chest') {
         visualHtml = `<div style="font-size: 3rem; margin: 10px 0;">📦</div>`;
    } else if (item.type === 'magic') {
         visualHtml = `<div style="font-size: 3rem; margin: 10px 0; filter: hue-rotate(90deg);">🎟️</div>`;
    }
    
    let costHtml = free ? `<div style="margin-top:10px; font-weight:bold; color:#a6e3a1; font-size:1.2rem;">TAKE</div>` : `<div style="margin-top:10px; font-weight:bold; color:#f9e2af; font-size:1.2rem;">${item.cost} G</div>`;
    
    el.innerHTML = `
        <div style="width: 100%; text-align: center;">
            <h3 style="margin-top:0; margin-bottom: 2px; color:#89b4fa; font-size:1.1rem;">${item.name}</h3><span style='font-size:0.7rem; color:#f5c2e7;'>${item.rarity ? item.rarity.toUpperCase() : ''}</span>
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

    let divider = document.createElement('div');
    divider.style = 'width: 2px; background-color: #45475a; align-self: stretch;';
    specialsDiv.appendChild(divider);

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
        el.innerHTML = `<h3 style="margin-top:0; color:#89b4fa; font-size:1rem; margin-bottom:5px;">${t.name}</h3><p style="font-size:0.75rem; color:#a6adc8; margin-top:0;">${t.desc}</p><div style="color:#a6e3a1; font-weight:bold; margin-top:10px;">Sell: ${Math.floor(t.cost / 2)} G</div>`;
        
        el.onmouseover = () => el.style.borderColor = '#a6e3a1';
        el.onmouseout = () => el.style.borderColor = '#f38ba8';
        
        el.onclick = () => {
            gold += Math.floor(t.cost / 2);
            talismans.splice(index, 1);
            // Put it back in the shop pool so they can buy it again later if they want
            shopDb.push(t);
            updateShopGold();
            updateUI();
            renderSellItems();
            log("Shop: Sold " + t.name + " for " + Math.floor(t.cost / 2) + "G.");
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

function openShop() {
    shopRerollCount = 0;
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('shop-screen').style.display = 'block';
    document.getElementById('shop-gold').innerText = gold;
    renderShopItems();
}

function getRerollCost() {
    // Each reroll within a shop visit costs more: 5G, 10G, 15G, ...
    return 5 + shopRerollCount * 5;
}

function renderShopItems() {
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
            items.push(pickWeightedShopItem());
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
                <h3 style="margin-top:0; margin-bottom: 2px; color:#89b4fa; font-size:1.1rem;">${item.name}</h3><span style='font-size:0.7rem; color:#f5c2e7;'>${item.rarity ? item.rarity.toUpperCase() : ''}</span>
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
    
    updateRerollButton();
}

function rerollShop() {
    const cost = getRerollCost();
    if (gold < cost) {
        log("Shop: Not enough gold to reroll (" + cost + "G)!");
        return;
    }
    gold -= cost;
    shopRerollCount++;
    log("Shop: Rerolled for " + cost + "G.");
    document.getElementById('shop-gold').innerText = gold;
    document.getElementById('gold').innerText = gold;
    renderShopItems();
    updateUI();
}

function updateRerollButton() {
    const btn = document.getElementById('btn-reroll');
    if (!btn) return;
    const cost = getRerollCost();
    btn.innerHTML = 'Reroll Shop (' + cost + 'G)';
    btn.disabled = gold < cost;
}

function buyItem(item, index, el) {
    if (gold >= item.cost) {
        if (item.type === 'talisman') {
            if (talismans.length >= 4) {
                log("Shop: Talisman slots full! (4/4)");
                return;
            }
            if (talismans.some(t => t.id === item.id)) {
                log("Shop: You already have " + item.name + "!");
                return;
            }
            talismans.push(item);
        } else if (item.type === 'weapon' || item.type === 'potion') {
            extraCards.push({ suit: item.cardData.suit, value: item.cardData.value, display: item.cardData.display });
        } else if (item.type === 'consumable') {
            if (item.id === 'c_heal') {
                hp = Math.min(20, hp + 10);
                log("Shop: Healing Salve restored 10 HP.");
            } else if (item.id === 'c_armor') {
                shieldHp += 5;
                log("Shop: Armor Plate added 5 Shield.");
            } else {
                currentItem = item;
                log("Shop: " + item.name + " ready to use.");
            }
        }
        
        gold -= item.cost;
        document.getElementById('shop-gold').innerText = gold;
        document.getElementById('gold').innerText = gold;
        el.style.display = 'none'; // remove from shop visually
        log("Shop: Bought " + item.name + " for " + item.cost + "G.");
        updateUI(); // refresh UI stats
        updateRerollButton();
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

// ============================================================================
// DEV / TESTING TOOLS
// ============================================================================

function devSkipChamber() {
    if (gameOver) {
        log("Dev: Game over — restart first.");
        return;
    }
    log("Dev: Skipping to the next chamber's shop.");
    nextChamber();
}

function devGiveGold() {
    gold += 100;
    updateUI();
    const sg = document.getElementById('shop-gold');
    if (sg) sg.innerText = gold;
    log("Dev: +100 Gold.");
}
