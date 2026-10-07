# BaloScoundrel

A **Balatro-style roguelike deckbuilder** built on the **Scoundrel solitaire** card game. Draw from a standard 52-card deck, manage weapon degradation, collect talismans, and fight through ever-harder dungeons.

## Core Mechanics

**Scoundrel at its heart** — 4 cards per room, must play 3. Leave exactly 1 behind.

| Card | Suit | Role |
|------|------|------|
| Monsters | ♠ ♣ | Defeat with weapons or fists |
| Weapons | ♦ | Equip to set damage and multiplier |
| Potions | ♥ | Heal HP (1 per room) |

**Weapon Degradation** — after a kill, your weapon's effective value drops to the monster's value. You can't kill anything higher than your weapon's current limit. This is the core tension engine.

**Scoring** → `(Monster Value × 10) × Weapon Multiplier`

## Roguelike Layer (The "Balatro" Part)

- **Talismans** — persistent Joker-equivalents (4 slots). Silver Blades, Quick Feet, Blood Vial, Undying, and more.
- **Magic Items** — permanent upgrades per dungeon run (Bank Gold, Talisman Belt, Bottomless Flask, Evasion Tactics)
- **Consumables** — single-use items (Shield, Smokescreen)
- **Gold Economy** — earn gold per kill, spend in shops between chambers
- **Dungeon Scaling** — the deck grows per chamber, injecting fresh monsters

## Talismans

| Name | Effect |
|------|--------|
| Silver Blades | Weapons 2× damage vs Clubs |
| Quick Feet | Dodge 2 damage per attack |
| Pickpocket | +2G on barehanded kills |
| Bounty Hunter | +2 Gold for kills ≥ 10 |
| Fists of Iron | Fist damage -3, Multiplier ×4 |
| Blood Vial | Excess healing → Shield HP |
| Undying | Revive at 5HP (destroyed on use) |

...and more to come.

## Prototype

This is the **web prototype** (HTML/JavaScript). Open `index.html` in a browser to play.

A production build in **LÖVE 2D** (Lua) is planned — same engine as Balatro.

## Roadmap

- [x] Core Scoundrel loop (rooms, combat, weapon degradation)
- [x] Shop system (Talismans, Consumables, Magic, Chests)
- [x] Gold economy and scoring
- [x] Dungeon/chamber progression with scaling
- [ ] Booster packs (draft cards between chambers)
- [ ] LÖVE 2D production build
- [ ] Additional talismans, enemies, and dungeon modifiers
