---
title: Scoundrel Rules (Official)
tags:
  - reference
  - game-dev
  - scoundrel
created: 2026-03-27
last-modified: 2026-03-27
source: http://stfj.net/art/2011/Scoundrel.pdf
---

# Scoundrel Rules

## 🗺️ Nav's Summary

Scoundrel is a solitaire roguelike played with a 44-card deck (standard 52 minus Jokers, Red Face Cards, and Red Aces). You start with 20 HP and work through a shuffled dungeon, flipping 4-card Rooms and choosing 3 to face each turn.

### Card Types at a Glance
| Type | Suits | Count | Effect |
|------|-------|-------|--------|
| 🗡️ Monsters | ♣ ♠ | 26 | Deal damage equal to value (J=11, Q=12, K=13, A=14) |
| ⚔️ Weapons | ♦ | 9 | Reduce monster damage; must equip on pickup |
| ❤️ Potions | ♥ | 9 | Restore HP equal to value; 1 per turn; cap at 20 |

### Core Loop
1. Flip 4 cards → form a Room
2. Face 3 of 4 (leave 1 for next Room) — or skip the whole Room (but never two in a row)
3. For each card: equip weapons, drink potions, fight monsters (barehanded or with weapon)
4. Survive the full dungeon to win

### The Key Strategic Tension: Weapon Degradation
Once you use a weapon on a monster, **it can only be used on monsters of equal or lesser value going forward.** This means *order matters*: fighting weak monsters first locks your weapon out of bigger threats. The weapon isn't discarded — it just becomes increasingly limited.

> Example: 5-Weapon used on a 6-Monster → still usable on ≤6 monsters.
> 5-Weapon used on a Queen (12) → still usable on ≤12 monsters.

### Scoring
- **Win:** Score = remaining HP (bonus if last card was a potion and HP was at 20)
- **Lose:** Score = HP − sum of all remaining monsters in deck (negative)

---
> *Full verbatim rules from the original PDF below.*

---

# Scoundrel - version 1.0 August 15th, 2011

*A Single Player Rogue-like Card Game by Zach Gage and Kurt Bieg*

---

## Setup

Scoundrel is played with a standard deck of playing cards.

Search through the deck and remove all Jokers, Red Face Cards and Red Aces. Place them off to the side, they are not used in this game.

Shuffle the remaining cards and place the pile face down on your left. This deck is called the Dungeon.

Take out a piece of paper and pen (or use your memory). Mark down 20 on the piece of paper, this is your starting Health.

---

## Rules

The 26 Clubs and Spades in the deck are **Monsters**. Their damage is equal to their ordered value. (e.g. 10 is 10, Jack is 11, Queen is 12, King is 13, and Ace is 14)

The 9 Diamonds in the deck are **Weapons**. Each weapon does as much damage as its value. All weapons in Scoundrel are binding, meaning if you pick one up, you must equip it, and discard your previous weapon.

The 9 Hearts in the deck are **Health Potions**. You may only use one health potion each turn, even if you pull two. The second potion you pull is simply discarded. You may not restore your life beyond your starting 20 health.

You may locate the discard deck (any discarded cards) anywhere you wish, though I recommend to the right of the Room. Cards are discarded face down.

The Game ends when either your life reaches 0 or you make your way through the entire Dungeon.

---

## Scoring

- If your life has reached zero, find all the remaining monsters in the Dungeon, and subtract their values from your life, this negative value is your score.
- If you have made your way through the entire dungeon, your score is your positive life, or if your life is 20, and your last card was a health potion, your life + the value of that potion.

---

## Gameplay

On your first and every turn, flip over cards off the top of the deck, one by one, until you have 4 cards face up in front of you to make a Room.

You may avoid the Room if you wish. If you chose to do so, scoop up all four cards in one motion and place them at the bottom of the Dungeon. While you may avoid as many Rooms as you want, you may not avoid two Rooms in a row.

If you choose not to avoid the Room, one by one, you must face 3 of the four cards it contains. Take them one at a time.

**If you chose a Weapon...**
You must equip it. Do this by placing it face up between you and the remaining Room cards. If you had a previous Weapon equipped, move it and any Monsters on it to the discard deck.

**If you chose a Health Potion...**
Add its number to your health, and then discard it. Your health may not exceed 20, and you may not use more than one Health Potion per turn. If you take two Health Potions on a single turn, the second is simply discarded, adding nothing to your health.

**If you chose a Monster...**
You may either fight it barehanded or with an equipped Weapon.

Once you have chosen 3 cards (such that only one remains), your turn is complete. Leave the fourth card face up in front of you as part of the next Room.

---

## Combat

- If you choose to fight the Monster **barehanded**, subtract its full value from your Health, and move the Monster to the discard deck.

- If you choose to fight the Monster **with your equipped Weapon**, place the monster face up on top of the weapon (and on top of any other Monsters on the Weapon). Be sure to stagger the placement of the Monster so that the Weapon's number is still showing. Subtract the Weapon's value from the Monster's value and subtract any remaining value from your health.

  - *For example, if your Weapon is a 5, and you place a 3 Monster on it, you take no damage. (3 − 5 < 0)*
  - *If your Weapon is a 5 and you place a Jack Monster on it, you take 6 damage. (11 − 5 = 6 dmg)*

It is important to note that although you retain your weapons until they are replaced, once a Weapon is used on a monster, **the Weapon can then only be used to slay Monsters of a lower value (less than or equal) than the previous Monster it had slain.**

  - *For example, if your 5 Weapon has killed a Queen Monster and you then choose a 6 Monster, you may use your Weapon on the 6 Monster, as 6 is less than 12.*
  - *But, if you have used your 5 Weapon on a 6 Monster, and you then choose a Queen Monster, you must fight the Queen barehanded as Queen (12) is greater than 6. Despite this, the Weapon is not discarded, as it could still be used again against Monsters weaker than a 6.*

---

## Table Layout

```
[ Dungeon ] [ Room ] [ Discard ]   [ Equipped Weapon / Monsters slain by this Weapon ]
```

---

© 2011, Zach Gage and Kurt Bieg

---

## Related
- [[Scoundrel Balatro]]
