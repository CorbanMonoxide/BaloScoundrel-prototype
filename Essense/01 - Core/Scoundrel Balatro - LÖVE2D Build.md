---
title: Scoundrel Balatro - LÖVE2D Build
tags:
  - game-dev
  - scoundrel-balatro
  - love2d
  - implementation
status: active
priority: high
start_date: 2026-05-06
created: 2026-05-06
last-modified: 2026-05-06
---

# Scoundrel Balatro - LÖVE2D Build

## 🎯 Objective
Port the Scoundrel Balatro prototype from JavaScript/HTML into **LÖVE 2D** (the same engine powering Balatro itself). This is the production-ready implementation.

**Engine:** LÖVE 2D (Lua-based, 2D-focused game framework)  
**Target Platform:** Desktop (Windows, macOS, Linux)  
**Reference:** Balatro's architecture & design patterns

---

## 📋 Project Structure

```
scoundrel-balatro-love2d/
├── main.lua                    # Entry point
├── conf.lua                    # LÖVE config (window, version)
├── src/
│   ├── gamestate.lua           # Core game state object
│   ├── gameflow.lua            # Chamber/room progression
│   ├── combat.lua              # Combat math & weapon degradation
│   ├── shop.lua                # Shop system (talismans, consumables, magic)
│   ├── ui.lua                  # UI rendering layer (HUD, cards, buttons)
│   ├── cards.lua               # Card data & rendering
│   ├── talismans.lua           # Talisman definitions & effects
│   ├── consumables.lua         # Consumable definitions
│   ├── magic.lua               # Magic/Voucher definitions
│   ├── deck.lua                # Deck generation & shuffling
│   ├── input.lua               # Input handling (mouse, keyboard)
│   └── utils.lua               # Helper functions (math, RNG, etc.)
├── assets/
│   ├── sprites/
│   │   ├── cards/              # Card face artwork (pixel art)
│   │   ├── ui/                 # UI elements (buttons, frames, icons)
│   │   ├── talismans/          # Talisman icons
│   │   └── character/          # Character face (HUD reaction sprite)
│   ├── fonts/
│   │   └── monospace.ttf       # Game font
│   └── sfx/                    # Sound effects (optional, phase 2)
└── README.md
```

---

## 🔧 Core Modules

### 1. **gamestate.lua** (State Container)
Encapsulates all game state as a single Lua table. Mirrors the JS `gameState` object.

```lua
GameState = {
  -- Progression
  dungeon = 1,
  chamber = 1,
  targetScore = 3000,
  
  -- Health & Resources
  hp = 20,
  shieldHp = 0,
  score = 0,
  gold = 0,
  
  -- Deck & Room
  deck = {},
  currentRoom = {},
  talismans = {},
  extraCards = {},
  
  -- Weapon State
  weaponValue = nil,
  weaponLimit = nil,
  weaponMult = 1,
  weaponUseCount = 0,
  
  -- Items & Modifiers
  currentItem = nil,
  currentMagicItem = nil,
  chestCost = 5,
  magicBought = false,
  
  -- Flags
  gameOver = false,
  potionUsedThisTurn = false,
  fledLastRoom = false,
  cardsPlayedThisRoom = 0,
  
  -- Methods
  reset = function(self) ... end,
  takeDamage = function(self, dmg) ... end,
  gainGold = function(self, amt) ... end,
  addScore = function(self, pts) ... end,
}
```

**Responsibilities:**
- Store all game state
- Provide mutation methods (takeDamage, addScore, reset)
- Expose state query functions

---

### 2. **combat.lua** (Battle Logic)
Handles weapon degradation, damage calculation, gold generation, and scoring.

**Key Functions:**
```lua
function CombatSystem.fightWithWeapon(gamestate, monster)
  -- Returns: { damage, goldEarned, scoreEarned, weaponDegraded }
end

function CombatSystem.fightBarehanded(gamestate, monster)
  -- Returns: { damage, goldEarned, scoreEarned, multiplier }
end

function CombatSystem.calculateMultiplier(gamestate)
  -- Returns: multiplier with talisman bonuses
end

function CombatSystem.applyTalismanEffects(gamestate, eventType, ...)
  -- Apply passive talisman effects on combat events
end
```

**Core Math:**
- Weapon kill: `dmg = max(0, monsterVal - weaponVal)`
- Degradation: `weaponLimit = monsterVal` (after kill)
- Scoring: `(monsterVal * 10) * multiplier`
- Gold: `baseGold + overkillBonus`

---

### 3. **gameflow.lua** (Progression)
Manages chamber/room transitions, deck building, and win/loss conditions.

**Key Functions:**
```lua
function GameFlow.initGame(gamestate)
  -- Full reset to Dungeon 1, Chamber 1
end

function GameFlow.startChamber(gamestate)
  -- Build deck, set target score, draw first room
end

function GameFlow.drawRoom(gamestate)
  -- Pop 4 cards from deck, populate currentRoom
end

function GameFlow.fleeRoom(gamestate)
  -- Scoop currentRoom cards to bottom of deck, re-draw
end

function GameFlow.nextChamber(gamestate)
  -- Advance to next chamber or next dungeon if chamber 3 complete
end

function GameFlow.checkWinLoss(gamestate)
  -- Return: 'won', 'lost', or 'active'
end
```

**Target Score Scaling:**
```lua
targetScore = 3000 + ((chamber - 1) * 2500) + ((dungeon - 1) * 10000)
```

---

### 4. **shop.lua** (Shop System)
Handles talismans, consumables, magic, and chest drafting.

**Key Functions:**
```lua
function Shop.openShop(gamestate)
  -- Populate shop with 3 random items + magic + chest
  -- Return: shopState = { talismans, consumables, magic, chest, pool }
end

function Shop.buyItem(gamestate, item)
  -- Deduct gold, add item to inventory
end

function Shop.buyChest(gamestate)
  -- Draft 3 random items for selection
end

function Shop.generateRandomShopItem()
  -- Return: random talisman, consumable, or card (weighted 40% cards)
end
```

**Shop Tiers:**
- Common Talismans: 4G
- Uncommon Talismans: 6G
- Rare Talismans: 8-10G
- Consumables: 5G
- Magic: 25G
- Chest: 5G + 5 per reopen

---

### 5. **ui.lua** (Rendering)
Draws all UI elements: cards, HUD, shop, talismans, log.

**Key Render Functions:**
```lua
function UI.drawGameScreen(gamestate)
  -- Draw: HUD (top), room (center), controls (bottom)
end

function UI.drawCard(card, x, y, scale)
  -- Render single card with suit symbol & value
end

function UI.drawShopScreen(gamestate, shopState)
  -- Draw: shop gold, item slots, magic, chest
end

function UI.drawTalismanBar(gamestate)
  -- Draw active talismans with tooltips
end

function UI.drawLog(messages)
  -- Draw scrolling log (last 10 messages)
end

function UI.drawHUD(gamestate)
  -- Draw: HP, Score, Gold, Target, Weapon, Talisman count
end
```

**Visual Design:**
- Pixel art aesthetic (16-32px card sprites)
- First-person HUD inspired by Doom
- Character face reacts to events (damage, kill, heal)
- Monospace font for readability

---

### 6. **cards.lua** (Card Data)
Defines card suits, values, and rendering properties.

```lua
SUITS = {
  spades = { symbol = '♠', type = 'monster', color = 'black' },
  clubs = { symbol = '♣', type = 'monster', color = 'black' },
  diamonds = { symbol = '♦', type = 'weapon', color = 'red' },
  hearts = { symbol = '♥', type = 'potion', color = 'red' },
}

CARD_VALUES = {
  [2] = 2, [3] = 3, ..., [10] = 10,
  J = 11, Q = 12, K = 13, A = 14,
}

Card = {
  suit = 'spades',
  value = 5,
  display = '5',
  played = false,
}
```

---

### 7. **talismans.lua** (Modifier Definitions)
Complete talisman database with effects and descriptions.

```lua
TALISMANS = {
  t_steel = {
    id = 't_steel',
    name = 'Tempered Steel',
    type = 'talisman',
    rarity = 'common',
    cost = 4,
    desc = 'First weapon kill no degradation',
    effect = function(gamestate) ... end,
  },
  -- ... more talismans
}

function Talismans.hasTalisman(gamestate, id)
  return gamestate.talismans[id] ~= nil
end

function Talismans.removeTalisman(gamestate, id)
  gamestate.talismans[id] = nil
end
```

---

### 8. **input.lua** (Input Handling)
Maps mouse/keyboard input to game actions.

**Key Functions:**
```lua
function Input.mousepressed(x, y, button)
  -- Handle card clicks, button presses (weapon/fists/flee/next)
end

function Input.keypressed(key)
  -- Handle keyboard shortcuts (R=restart, ESC=menu, etc.)
end

function Input.update(dt)
  -- Frame-by-frame input polling
end
```

---

## 🎮 Game Loop (main.lua)

```lua
function love.load()
  gamestate = GameState:new()
  gameflow = GameFlow:new(gamestate)
  ui = UI:new()
  input = Input:new()
  
  gameflow:initGame()
end

function love.update(dt)
  input:update(dt)
  -- Update animations, timers, etc.
end

function love.draw()
  ui:drawGameScreen(gamestate)
end

function love.mousepressed(x, y, button)
  input:mousepressed(x, y, button)
end

function love.keypressed(key)
  input:keypressed(key)
end
```

---

## 📊 State Transitions

```
[Init] 
  ↓
[Chamber Start] → Build Deck
  ↓
[Draw Room] → 4 cards in currentRoom
  ↓
[Play Card] → Weapon/Potion/Monster
  ↓
[Check Win] → Score >= targetScore?
  ├─ YES → [Next Chamber] → [Shop] → [Chamber Start]
  └─ NO → [Draw Room] (repeat)

[Game Over] (HP ≤ 0 or deck exhausted)
  ↓
[Restart] → [Init]
```

---

## 🛠️ Development Phases

### Phase 1: Core Loop (Weeks 1-2)
- [x] Project scaffolding
- [ ] GameState + basic render
- [ ] BuildDeck + DrawRoom
- [ ] Combat (weapon & barehanded)
- [ ] Room UI (cards + buttons)
- [ ] Win/loss detection

### Phase 2: Shop System (Weeks 3-4)
- [ ] Shop screen layout
- [ ] Talisman purchasing
- [ ] Consumable system
- [ ] Magic/Voucher system
- [ ] Chest drafting

### Phase 3: Polish & Effects (Weeks 5-6)
- [ ] Animations (card entry, combat hit, level up)
- [ ] Sound effects (combat, purchase, level clear)
- [ ] Character face reactions
- [ ] Particle effects (gold drops, kills)
- [ ] Screenshake on impact

### Phase 4: Balance & Content (Weeks 7+)
- [ ] Playtesting & difficulty tuning
- [ ] Additional talismans (if needed)
- [ ] Cursed monsters (optional)
- [ ] Dungeons 2-3 balance
- [ ] Save/load system

---

## 🔗 References
- [[Scoundrel Balatro]] (Design doc)
- [[Scoundrel Rules]] (Official ruleset)
- [[Scoundrel Talismans]] (Modifier list)
- LÖVE 2D: https://love2d.org/
- Balatro: Study UI/animation patterns

---

## 📝 Notes
- **Lua Idioms:** Use tables for objects, metatables for OOP if needed
- **RNG:** Use `math.random()` with explicit seeds for reproducible runs
- **Performance:** Keep update/draw frames under 60fps; LÖVE is fast enough for this scope
- **UI Framework:** Consider **ImGui** bindings or build custom retained-mode UI
- **Asset Pipeline:** Aseprite → PNG spritesheet → atlas for cards & UI

---

## 🔄 Links
- [[Scoundrel Balatro]]
- [[Scoundrel Chamber Playtesting]]
