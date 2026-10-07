---
title: Scoundrel Monsters
tags:
  - game-dev
  - scoundrel-balatro
  - mechanics
created: 2026-03-31
last-modified: 2026-06-16
---

# Scoundrel Monsters

This document outlines all the foundational rules regarding Monsters in the base game of Scoundrel, which serves as the core combat engine for [[Scoundrel Balatro]].

## Deck Composition & Values

In a standard Scoundrel deck, there are **26 Monsters**, represented by the black suits (**Clubs ♣** and **Spades ♠**).

A monster's damage/health is equal to its ordered face value:
- **Numbers (2-10):** Value is exactly 2 through 10.
- **Jack (J):** 11
- **Queen (Q):** 12
- **King (K):** 13
- **Ace (A):** 14

## Monster Types

Each face value corresponds to a distinct monster type with thematic identity. Types enable weapon-type interactions ([[Scoundrel Weapons#Weapon Roster|see Weapon types]]) and talisman synergies.

| Value         | Monster Type  | Tier       | Flavor                                                                                     |
| ------------- | ------------- | ---------- | ------------------------------------------------------------------------------------------ |
| 2–3           | **Zombie**    | Low        | Slow, shambling. Dead flesh absorbs punishment but falls to clean strikes.                 |
| 4–5           | **Skeleton**  | Low        | Brittle but numerous. Crumbles under blunt force; shrugs off piercing.                     |
| 6–7           | **Ghost**     | Mid        | Intangible, spectral. Passes through physical attacks. Fleeing a ghost room costs nothing. |
| 8–9           | **Elemental** | Mid        | Volatile, unpredictable. Raw elemental power. Killing one triggers an elemental burst.     |
| 10–11 (10, J) | **Demon**     | Elite      | Corrupted, aggressive. High threat with special abilities. Mid-boss tier.                  |
| 12–13 (Q, K)  | **Dragon**    | Boss       | Apex predator. Massive health, devastating attacks. Run-defining encounter.                |
| 14 (A)        | **Lich**      | Final Boss | Undead sovereign. The ultimate threat. Unique encounter mechanics.                         |

**Tier Distribution:**
- **Low (2–5):** 8 cards. Core combat loop, risk management.
- **Mid (6–9):** 8 cards. Tactical shift — ghosts and elementals demand different approaches.
- **Elite (10–J):** 4 cards. Resource check. Can you afford the damage?
- **Boss (Q–K):** 4 cards. Weapon drain. Forces hard decisions about when to fight or flee.
- **Final Boss (A):** 2 cards. Run-defining. Surviving a Lich encounter requires preparation.



### Type-Based Talisman Design Space

- **Gravekeeper:** +3 damage vs Zombies and Skeletons
- **Spirit Ward:** Ghosts deal 0 damage if you flee the room they're in
- **Elementalist:** Killing an Elemental restores 2 HP
- **Demon Hunter:** Score gained from Demon kills is doubled
- **Dragonslayer:** Dragons take +5 damage from all weapons
- **Lich Bane:** Lich value reduced by 3 for combat calculations

## Combat Mechanics

When you choose to face a Monster from the 4-card Room spread, you have two choices for how to fight it:

### 1. Barehanded Combat
If you fight a Monster barehanded, you simply subtract its full value from your Health (HP), and the Monster is moved to the discard pile. 
* *Note: In Scoundrel Balatro, fighting barehanded usually resets your Essence multiplier to 1×, but it preserves your equipped weapon for future use.*

### 2. Armed Combat (Using a Weapon)
If you have an equipped Weapon (Diamonds ♦), you can use it to fight the Monster. 
- Place the Monster card on top of the Weapon.
- Subtract the Weapon's value from the Monster's value. 
- You take damage equal to any remaining value (e.g., a 5-Weapon fighting an 11-Monster means you take 6 damage). If the Weapon value is higher than the Monster value, you take 0 damage.

## The Weapon Degradation Rule (Crucial Mechanic)
Although you retain your weapon from room to room until replaced, **once a Weapon is used on a monster, that Weapon can then only be used to slay Monsters of an equal or lower value than the previous Monster it had slain.**

- *Example 1 (Optimal):* Your 5-Weapon kills a Queen (12). You then face a 6-Monster. You **can** use the weapon on the 6, because 6 ≤ 12.
- *Example 2 (Sub-optimal):* Your 5-Weapon kills a 6-Monster. You then face a Queen (12). You **must** fight the Queen barehanded, because 12 is greater than 6. The weapon is not discarded; it is just temporarily useless against the Queen.

This forces players to try and kill Monsters in strictly descending order (14 → 13 → 12 → etc.) to maximize weapon utility.

## Room Evasion & Remaining Monsters
- **Skipping a Room:** You can avoid a full room of 4 cards, pushing them to the bottom of the deck. However, you cannot avoid two rooms in a row. 
- **Leaving One Behind:** You must only face 3 of the 4 cards in a room. If you leave a Monster behind as the 4th card, it becomes part of the *next* room. 

## Cursed Monsters (Variant Mechanics)
Monsters can occasionally appear with a **Curse Mark**.
- If a cursed monster is defeated **barehanded**, the player is afflicted with a temporary curse.
- To safely defeat a cursed monster and avoid the penalty, the player must use an equipped Weapon.
- **Example Curses:**
  - **Weakness:** -2 damage to weapon attacks for a set duration.
  - **Poison:** Lose 1 HP every turn (selecting a card counts as a turn).

---
## 🔗 Links
- [[Scoundrel Rules]]
- [[Scoundrel Balatro]]
- [[Scoundrel Economy]]