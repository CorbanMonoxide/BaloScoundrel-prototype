---
title: Scoundrel Balatro
tags:
  - project
  - game-dev
  - scoundrel-balatro
status: active
priority: high
start_date: 2026-03-18
due_date:
completed_date:
created: 2026-03-18
last-modified: 2026-06-16
---

# Scoundrel Balatro

## 🎯 Objective
- Develop a roguelike dungeon crawler that fuses *Scoundrel* solitaire mechanics with *Balatro*-style modifier-driven progression and an extra rogue-like twist.
## Working Titles

- Essence
- 

### Key Results / Success Criteria
- [x] Define the core combat loop using Scoundrel card management (Health/Weapon/Monster balance).
- [x] Implement a shop system (Talismans, Consumables, Magic, Chests) in playable web prototype.
- [x] Design weapon type system (Sharp/Blunt/Piercing) and monster type system (Zombie → Lich, 7 tiers).
- [x] Design Essence progression + Boss Chamber structure.
- [x] Design Room Modifier system (doors with boon/curse slots).
- [ ] Implement all designed systems in engine.
- [ ] Begin LÖVE2D production build.

## 📝 Details & Scope
- **Scoundrel Solitaire**: 4-card room spread with weapon/monster/potion card management as the primary engine.
- **Balatro Integration**: Talismans (persistent passive modifiers) provide Essence × Multiplier scaling — the two-axis scoring system.
- **Weapon Types**: All 13 weapons named and typed (Sharp, Blunt, Piercing) with monster type matchups. See [[Scoundrel Weapons]].
- **Monster Types**: 7-tier system (Zombie → Lich) with escalating difficulty per chamber. See [[Scoundrel Monsters]].
- **Room Modifiers**: Doors between rooms offer 1–3 boon/curse slots — tactical risk/reward decisions every room transition. See [[Scoundrel Room Modifiers]].
- **Progression**: Dungeon → 3 Chambers → Boss Chamber. Room → Room (via door selection) → Essence threshold → Shop → next.

## 📋 Action Items
- [x] Draft core rules for Scoundrel-based combat.
- [x] Brainstorm the first talismans (16 designed, ~8 implemented in prototype).
- [x] Prototype room/deck layout (playable web prototype at https://github.com/CorbanMonoxide/BaloScoundrel-prototype).
- [ ] Implement weapon type system (Sharp/Blunt/Piercing) in engine.
- [ ] Implement monster type system with spawn weights.
- [ ] Add Boss Chamber mechanic.
- [ ] Implement weapon degradation system.
- [ ] Implement remaining talismans (Sharp Blades, Heavy Hitter, Piercing Blows, etc.).
- [ ] Balance gold economy with overkill bonus.
- [ ] Design and implement card removal/deck thinning mechanics.
- [ ] Begin LÖVE2D production build (Lua).
- [ ] Design boss-specific monster abilities.

## 🏰 Level Structure & Progression

The game is structured hierarchically: **Dungeon > Chamber > Room.**

- **Dungeon (Level):** A complete run segment consisting of 3 Chambers + 1 Boss Chamber.
- **Chamber:** A deck run with an Essence target. Clear rooms to reach the threshold.
- **Room:** The 4-card spread the player interacts with at any given moment.

### Essence System

Each monster kill grants **Essence** — the core progression resource.

- **Base Essence:** Monster face value (e.g., 2 to 14), modified by your current weapon multiplier (or 1× barehanded).
- **Threshold:** Each chamber requires escalating Essence to complete. Hit the target to advance.
- **Gold is separate:** Monsters also drop Gold (based on value) for the shop. Essence is for chamber progression; Gold is for spending.

### Chamber Structure

```
Dungeon
├── Chamber 1  (Essence target: 1,000)
│   ├── Room → Room → Room → ...
│   └── Target reached → Shop
├── Chamber 2  (Essence target: 1,500)
│   ├── Room → Room → Room → ...
│   └── Target reached → Shop
├── Chamber 3  (Essence target: 2,000)
│   ├── Room → Room → Room → ...
│   └── Target reached → Shop
└── Boss Chamber (Essence target: 3,000+)
    ├── Room → Room → Room → ...
    ├── Boss encounter (guaranteed high-value monsters)
    └── Target reached → Dungeon Complete
```

> Targets are **Dungeon 1** values. They scale exponentially — ×3 per dungeon, with fixed within-dungeon multipliers (×1 / ×1.5 / ×2). See [[Scoundrel Scoring]] for the formula.

**Chamber Win/Loss Conditions:**
- **Success:** Essence hits the target threshold → proceed to Shop, then Booster Pack, then next Chamber (or Boss Chamber if Chamber 3 is cleared).
- **Failure:** HP drops to 0, **OR** run out of cards in the deck before reaching the target.
- **Boss Chamber:** After clearing Chamber 3, the Boss Chamber appears. Higher Essence target, guaranteed elite/boss-tier monsters from the monster type pool.
- **Dungeon Complete:** Clearing the Boss Chamber completes the dungeon. Full HP restore, keep gold/talismans, escalate to next dungeon.
- **HP persists** across chambers within a dungeon — it only refills to full at the dungeon boundary (Dungeon Complete). Shield resets there too. Healing is a dungeon-scoped resource; buy it with Gold in the shop.

- Cannot avoid two Rooms in a row (base rule; modifier-interactable).

## 🗺️ Room Transitions (Doors)

Between rooms, the player chooses from 1–3 doors — each with 1–3 modifier slots. Modifiers can be Boons (positive) or Curses (negative) and apply only to the next room. See [[Scoundrel Room Modifiers]] for full mechanics.

- **Early chambers:** Favorable boon/curse ratio, fewer slots. More doors = more choice.
- **Late chambers:** More curses, more slots per door. Harder decisions.
- **Boss chamber:** Doors lean curse-heavy with legendary modifiers possible.

## 🗺️ Between Chambers (Map Phase)
Between chambers (after the shop), the player is presented with a map screen.
- **You Are Here:** The current, completed chamber is drawn as a square.
- **Branching Paths:** The player can choose from 1 to 3 directional paths leading to the next chamber.
- **Foreshadowing:** The map reveals the exact 4 cards that will be in the *first room* of each selectable path, allowing players to plan their starting combo or safety net.
- **The "Leftover" Path:** One of the selectable chambers will specifically be seeded with the remaining cards that were left behind (the 4th, unplayed card) from the previous chamber's rooms.

## 🎴 Deck Mechanics
See [[Scoundrel Deck Mechanics]] for how the deck evolves.
- Start with 44 cards (26 Monsters, 9 Weapons, 9 Potions).
- Deckbuilding is secondary to survival; new cards are added through the shop (Weapons/Potions) or by the game between Dungeons (Monsters).
- Transformation Consumables alter cards mid-run rather than safe shop removals.

## 💰 Economy
See [[Scoundrel Economy]] for full rules on gold generation and monster payouts.
- **Currency:** Gold
- **Base Gold:** Scaling based on monster face value (2-10 = 1G, Jack = 2G, Queen = 3G, King = 4G, Ace = 5G).
- **Overkill bonus:** `Gold += max(0, Weapon value − Monster value)` — e.g. 5-Weapon vs 2-Monster = 3 bonus gold.

## 🃏 Modifier Systems

**Scoring paradigm (canonical):** Scoring resolves per room (room = hand), not per kill. See [[Scoundrel Scoring]] for the two-axis base/mult model, trigger windows, talisman ordering, and the left-behind card decision.

Modifiers are broken into four categories spanning run, chamber, and room scope:

1. **Talismans** (Run-persistent) — Equipped in 4 slots. Provide Essence, Multiplier, Gold, and combat bonuses. See [[Scoundrel Talismans]].
2. **Room Modifiers** (Room-scope) — Doors between rooms. Boons and curses for one room only. See [[Scoundrel Room Modifiers]].
3. **Consumables** (Single-use) — Shield, Smokescreen. One carry slot.
4. **Magic** (Dungeon-scope) — Voucher equivalents that alter shop/rules for the current dungeon.

Shop is visited between chambers. See [[Scoundrel Shop]] for full mechanics.

### Build Archetypes

The weapon type + monster type + talisman systems create distinct builds:
- **Berserker (Unarmed):** Fists of Iron, Quick Feet, Undying — never equip a weapon.
- **Swordsman (Sharp):** Sharp Blades, Tempered Steel, Expert Blacksmith — precision descending-order kills.
- **Brute (Blunt):** Heavy Hitter, Desperate Blows — smash through Skeletons and Elementals.
- **Duelist (Piercing):** Piercing Blows, Intimidation, Evasion Tactics — bypass Demon hide, find Dragon gaps.
- **Merchant (Economy):** Pickpocket, Bounty Hunter, Chump Change — buy out every shop.
- **Ghost (Evasion):** Evasion Tactics, Smoke Bomb, Spirit Ward, Scary Aura — flee your way to victory.

## Base Essence and Multiplier

Each kill contributes Essence toward the chamber target:
- **Base Essence:** Monster face value (e.g., 2 to 14) when killed.
- **Multiplier:** Your equipped Weapon's current effective value.

**The Degrading Multiplier (Core Balance):**
Following standard Scoundrel rules, when you kill a monster with a weapon, the weapon's multiplier degrades to that monster's value.
- `Essence Gained = (Monster Value) × (Current Weapon Multiplier)`
- After the kill, your Multiplier drops to the value of the monster you just killed.
- **Barehanded:** If you fight a monster barehanded (taking damage to HP), your Multiplier for that kill is **1×**.

This heavily incentivizes perfect Scoundrel play: killing monsters in strictly descending order (e.g., 14 → 13 → 12) to milk the highest possible multiplier at every step before the weapon degrades.

## 🎨 Visual Design
- **Aesthetic:** Pixel art style.
- **Perspective:** First-person, inspired by OG *Doom*. Includes a dynamic character face in the HUD (reacting to damage, kills, and heals) and visible first-person weapon equipping animations.
- **Room Entry (The Reveal):**
  - **Monsters:** Monster cards are fully decorated and animated into the room environment (e.g., zombie cards crawl out of the ground, magic cards zap into existence).
  - **Loot (Weapons & Potions):** Spawn as treasure chests in the room environment, which instantly snap open to reveal the Weapon or Potion card inside.
- **Room Clear (The "Left Behind" Card):**
  - After facing 3 out of the 4 cards in a room, the remaining 1 card must organically leave the scene.
  - **Monsters left behind:** Turn and flee through a dungeon door in the background.
  - **Loot left behind:** A treasure chest materializes around the Weapon or Potion, snaps shut, and vanishes with a magical particle effect.

## 🔗 Resources & References
- [[Scoundrel Scoring]]
- [[Scoundrel Rules]]
- [[Scoundrel Talismans]]
- [[Scoundrel Weapons]]
- [[Scoundrel Monsters]]
- [[Scoundrel Room Modifiers]]
- [[Scoundrel Shop]]
- [[Scoundrel Economy]]
- [[Scoundrel Deck Mechanics]]
- [[Scoundrel Consumables]]
- [[Scoundrel Booster Packs]]
- [[Balatro]]

## 📅 Log & Updates
- **2026-06-16**: Major design expansion.
    - **Essence**: Renamed Score to Essence for thematic consistency. Gold decoupled from Essence — monsters drop both.
    - **Boss Chamber**: Added after Chamber 3 — guaranteed elite/boss monsters, higher target. Clearing it completes the dungeon.
    - **Monster Types**: Designed full 7-tier type system (Zombie → Lich) with weapon type interactions (Sharp/Blunt/Piercing).
    - **Weapon Types**: All 13 weapons named and typed (Blunt/Piercing/Sharp).
    - **Room Modifiers**: Door-based room transition system — 1–3 doors with 1–3 mixed boon/curse slots. 25 boons, 24 curses across all rarities.
    - **Talisman Roster**: Expanded to 16 talismans across Common/Uncommon/Rare tiers. Weapon-type talismans (Sharp Blades, Heavy Hitter, Piercing Blows) designed.
    - **Build Archetypes**: 6 distinct builds identified (Berserker, Swordsman, Brute, Duelist, Merchant, Ghost).
- **2026-04-14**: Updated Talisman suite and mechanics.
    - **Refined Mechanics**: Decoupled Weapon Multiplier from Durability. Multiplier remains at the weapon's face value, while Durability (threshold) degrades.
    - **Potion Update**: Allowed consumption of multiple potions per room (only the first heals) to prevent soft-locks.
    - **Talisman UI**: Implemented a dedicated "Active Talisman" bar with hover tooltips in the demo.
    - **Talisman Roster Update**: Added Tempered Steel, Intimidation, Chump Change, and the additive Copper/Steel/Gold multiplier suite. Capped Blood Vial at 30 Shield HP.
