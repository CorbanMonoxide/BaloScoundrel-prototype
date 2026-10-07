---
title: Scoundrel Room Modifiers
tags:
  - game-dev
  - scoundrel-balatro
  - room-modifiers
  - difficulty
  - boons
  - curses
created: 2026-06-16
last-modified: 2026-06-16
status: design
aliases:
  - Scoundrel Curses
---

# Scoundrel Room Modifiers

Room Modifiers are temporary effects — both positive (Boons) and negative (Curses) — that apply to a single room. After clearing a room, the player must choose a door to proceed. Each door has 1–3 modifier slots, and each slot independently rolls a modifier.

The decision isn't just "pick the least bad curse" — it's "weigh a door with one curse against a door with two curses and a boon."

## The Door Mechanic

After the 4th (left-behind) card is swept away, doors appear at the back of the room. Each door displays 1–3 modifier icons. The player picks one door and its modifiers apply to the next room.

| Chamber | Doors Shown | Slots Per Door | Slot Rarities |
|---------|------------|----------------|---------------|
| 1 | 2 | 1–2 | Common only |
| 2 | 2 | 1–2 | Common, Uncommon |
| 3 | 3 | 1–3 | Common, Uncommon, Rare |
| Boss | 2 | 2–3 | All (including Legendary) |

**Slot distribution per chamber (approximate):**
- Chamber 1: ~70% boon / 30% curse
- Chamber 2: ~60% boon / 40% curse
- Chamber 3: ~50% boon / 50% curse
- Boss: ~40% boon / 60% curse

**The choice is mandatory.** You can't skip doors — you must pick one to advance to the next room.

### Curse Duration

All room modifiers apply **only to the next room.** Once that room is cleared, the modifiers expire and a new set of doors appears. Boss chamber modifiers last the entire boss chamber.

### Fleeing & Modifiers

If you flee a room before clearing it, you still pass through a door — the modifiers apply to the next room as normal. No free escape.

### Modifier Stacking

All modifiers on a chosen door apply simultaneously for the room. Modifiers from the same category (boon/curse) stack additively.

---

## Boon Roster

---

### Common Boons

1. **Blessed**: +25% base Essence from all kills this room.
2. **Treasure Room**: +4 Gold per kill this room.
3. **Armory**: First weapon picked up this room has +2 value.
4. **Weakened Monsters**: All monsters in this room deal 1 less dmg
5. **Bloodlust**: First kill this room restores 2 HP.

---

### Uncommon Boons

9. **Double Essence**: +2 mult this room
10. **Sharpened**: All weapons deal +3 damage this room.
11. **Healer's Touch**: All potion values are +2 this room.

---

### Rare Boons

16. **Golden Room**: +5 mult this room
17. **Invulnerable**: The first instance of damage this room is negated entirely.
18. **Armorer's Gift**: All weapons that spawn get +3 strength
19. **Phoenix**: If you would die this room, revive with 1 HP (once).
20. **Midas Touch**: Every kill this room grants +5 bonus Gold.
21. **Essence Fountain**: Start this room with +20% of the chamber Essence target already filled.

---

### Legendary Boons

22. **God Room**: Double Essence AND double Gold from all kills this room.
23. **Perfect Armory**: All weapons this room use maximum value (14) for damage calculations. Degradation still applies normally.
24. **Vault**: All 4 chest types from the shop appear as free picks at the end of this room.
25. **Second Wind**: Clear this room and gain a full HP restore AND +1 permanent Max HP.

---

## Curse Roster

---

### Common Curses

1. **Weakness**: Weapon attacks deal -2 damage. Barehanded attacks unaffected.
2. **Rust**: Each weapon picked up this room has -1 value.
3. **Light Pockets**: Monsters drop 1 less Gold than normal this room (minimum 0).
4. **Crowded Room**: One additional monster card appears in this room's spread.
5. **Fatigue**: Start this room with -2 HP.
6. **Blunted**: Barehanded attacks deal +1 damage taken this room.
7. **Slippery**: Potions heal for -2 this room.

---

### Uncommon Curses

8. **Rapid Degradation**: Weapons degrade by an additional 1 value after each kill (monster value + 1 instead of monster value).
9. **Haunted**: A Ghost (6-7) appears as an additional card in this room.
10. **Coward's Brand**: Fleeing this room deals 3 damage.
11. **Thin Blood**: Potions heal for 50% of their value (rounded down).
12. **Clumsy**: Lose 1 HP at the start of each turn this room.
13. **Darkness**: Face values of monsters are hidden until you choose to fight them.
14. **Pacifist's Burden**: Gain 0 Gold from kills of value 8+ this room.

---

### Rare Curses

15. **Cursed Loadout**: Disable 1 Talisman slot for this room.
16. **Merchant's Grudge**: The shop after this room offers only 2 items instead of 3.
17. **Decay**: At the start of this room, the highest-value card in your deck is destroyed (removed permanently).
18. **Curse of the Necromancer**: Three Zombies (2-3) appear as additional cards in this room.
19. **Void Touched**: Every other kill this room grants 0 Essence.
20. **Fragile**: Shield HP disabled entirely for this room.

---

### Legendary Curses

21. **Death March**: Potions damage you for their value instead of healing. **Monster kills grant +50% Essence.**
22. **Dragon's Den**: A Dragon (Q-K) is guaranteed to appear in this room. **Killing it grants 3× Essence.**
23. **Bare Knuckles**: Weapons cannot be equipped this room (barehanded only). **Barehanded multiplier is 5×.**
24. **Lich's Gambit**: A Lich (A) spawns in this room. **If killed: remove all curses and gain +2 permanent Max HP.**

---

## Door Selection Strategy

Players evaluate doors holistically — a door isn't just the sum of its modifiers, it's how those modifiers interact with their build:

- A **Sharp build** might take a door with Weakness (-2 weapon damage) if it also has Sharpened (+3 weapon damage) — net +1.
- A **Berserker (unarmed)** build laughs at Weakness entirely and can absorb Cursed Loadout with less pain.
- A **low-HP run** might take a door with two curses if it also has Sanctuary (+5 Shield) as a buffer.
- **Fleet Footed + Coward's Brand** on the same door is a trap — you can flee freely but it costs 3 HP.

The system creates moments of "this door is terrible for anyone but perfect for me" — the essence of roguelike decision-making.

---

## Boss Chamber Modifiers

Boss chamber doors have 2-3 slots, can roll any rarity, and their modifiers last the entire chamber (not just one room).

---

## 🔗 Links
- [[Scoundrel Balatro]]
- [[Scoundrel Talismans]]
- [[Scoundrel Monsters]]
- [[Scoundrel Rules]]
