---
title: Scoundrel Mult & Retrigger
tags:
  - game-dev
  - scoundrel-balatro
  - talismans
  - scoring
created: 2026-08-12
last-modified: 2026-08-12
status: design
---

# Scoundrel Balatro — ×Mult & Retrigger Layer

> **Superseded by [[Scoundrel Scoring]].** The scoring model moved from per-kill to per-room (room = hand). The +Mult/×Mult/retrigger layering below still applies, but the *timing* is now room-scoped — see the canonical page.

## The Problem

Current scoring is a single line:

```
points = (monster_value × 10) × killMult
```

where `killMult` = weapon value (2–10) or 4 barehanded (Fists of Iron). Max per kill ≈ 1400, and the only lever is "get a bigger weapon." No stack, no compound, no engine. Numbers don't go big.

## The Fix: Two New Layers

```
points = monster_value × 10 × (+Mult) × (×Mult) × (retriggers)
```

- **+Mult** = weapon value + flat talisman bonuses (Sharp Blades, Expert Blacksmith). *Additive.*
- **×Mult** = the NEW multiplicative layer. Starts at 1. ×Mult talismans **multiply each other** (×2 × ×3 = ×6). *This is the explosion.*
- **retriggers** = how many times the kill's score applies. A retrigger talisman scores the same kill twice.

The `×10` is a constant. The three player-facing levers are:
1. **monster_value** (2–14) — what you target
2. **weapon_value + flat** — the +Mult you build
3. **×Mult stack** — the multiplicative engine you assemble

Retrigger multiplies the *whole result*, so it's the strongest single multiplier — and it's what turns ×Mult from "nice" into "parabolic."

---

## ×Mult Talismans

Conditions hook into Scoundrel's native tensions (degradation, the "leave 1" decision, the 3-plays-per-room rhythm, barehanded choice).

### Common
| Talisman | Effect | Condition |
|----------|--------|-----------|
| **Opening Gambit** | ×2 mult | First kill of each room |
| **Finisher** | ×2 mult | 3rd (final) kill of each room |
| **Glass Jaw** | ×1.5 mult | Barehanded kills |

### Uncommon
| Talisman | Effect | Condition |
|----------|--------|-----------|
| **Momentum** | ×2, ×3, ×4 mult | 1st, 2nd, 3rd kill in a room (scales within the room) |
| **Predator** | ×3 mult | Kill the highest-value monster in the room |
| **Last Stand** | ×2 mult | All kills while HP ≤ 5 |

### Rare
| Talisman | Effect | Condition |
|----------|--------|-----------|
| **Glass Cannon** | ×3 mult | Weapon kills — but weapon degrades 2 extra |
| **Overkill** | ×4 mult | Single kill exceeds the room's target score |

### Legendary
| Talisman | Effect | Condition |
|----------|--------|-----------|
| **Ascension** | ×Mult = number of talismans held | Passive, always |
| **Nova** | ×5 mult | All kills — but max HP locked at 1 |

---

## Retrigger Talismans

Retrigger = score the same kill a second time. It stacks *with* ×Mult (a ×3 kill retriggered = ×6 effective).

| Talisman | Rarity | Effect |
|----------|--------|--------|
| **Echo Blade** | Uncommon | Weapon kills score twice (degrade once) |
| **Second Wind** | Uncommon | Barehanded kills score twice |
| **Blood Echo** | Rare | First kill of each room re-scores at room end |
| **Phantom Strike** | Rare | Every 3rd kill scores twice |

Retriggering **does not** give extra plays — it doubles the *score* of existing plays. The "play 3, leave 1" solitaire skeleton stays intact. Retrigger is purely a scoring multiplier.

---

## Combo Map (the run-variety engine)

Each combo = a distinct build with a different play pattern.

### 1. Momentum Engine (the flagship "number go big")
**Momentum** (scaling ×Mult) + **Finisher** (×2 last kill) + **Echo Blade** (weapon retrigger)
- Kill 3: ×4 (Momentum) × 2 (Finisher) × 2 (retrigger) = **16×**
- Feels like a combo chain building to a payoff every room.

### 2. Barehanded Berserker
**Fists of Iron** (10× base, -3 dmg) + **Glass Jaw** (×1.5 barehanded) + **Pickpocket** (+2G)
- Never touch weapons. Punch everything, farm gold, ×15 effective on barehanded.
- **Second Wind** upgrades this to ×30.

### 3. Degrade Gambler
**Glass Cannon** (×3, +2 degrade) + **Tempered Steel** (first kill no degrade) + **Echo Blade** (retrigger)
- First kill: ×3 × 2 = 6× with zero degrade. After that, the weapon melts — so you cycle weapons aggressively.

### 4. Last Stand
**Last Stand** (×2 ≤5HP) + **Undying** (revive) + **Blood Vial** (shield)
- Deliberately hover low HP for the bonus. Undying is the safety net, Blood Vial soaks chip damage.

### 5. The Hunter
**Predator** (×3 highest monster) + **Bounty Hunter** (+gold ≥10) + **Finisher** (×2 last kill)
- Target the scariest card in the room. ×6 on the apex kill, plus gold.

### 6. Ascension Endgame
**Ascension** (×Mult = talisman count) + **Talisman Belt** (magic, +1 slot)
- A 5th slot means ×5 baseline. Stacking any other ×Mult on top compounds it. The "I got the legendary" run.

---

## Dungeon & Boss Scaling

Structure (per the simplified model):
- **2 chambers**, then a **boss**, per dungeon (3 stages total).
- Chamber target scores scale linearly: `3000 → 5500`.
- **Boss** target is ~2× the chamber 2 score (e.g., 11000), and it's the run-defining check.

Why this pairs with ×Mult/retrigger:
- Requirements scale **linearly**. Player output scales **multiplicatively**.
- Mid-run, a good engine starts overshooting targets by 10–50×. The *gap* (overkill) is where the dopamine lives — exactly Balatro's curve.

**Boss as build-check:** a boss is a single apex monster (Ace = 14) that must be killed **barehanded** (no weapon allowed). This forces a build that's strong *without* weapons — so a pure weapon-degradation build that coasted through chambers 1–2 gets humbled unless it also has a barehanded or ×Mult engine. Different dungeons' bosses could have different rules (e.g., "heals +2 per room," "shields 3 damage," "must be overkilled by 2×").

---

## Code Impact

In `game.js`, the kill branch currently does:

```
points = (card.value * 10) * killMult
```

Changes needed:
1. Compute `+Mult` (weapon value + flat bonuses) and `×Mult` (product of active ×Mult talismans) separately.
2. `points = (card.value * 10) * plusMult * xMult`
3. Apply retrigger: `if (retriggered) points *= 2` (or sum a second score).
4. Add a `xMult` (and `retriggerCount`) field to the talisman object schema, plus a `hasXMult(id)` / `getXMult()` helper.

This is a scoring-layer refactor, not a rewrite. The solitaire skeleton, room flow, and shop all stay put.

---

## Open Questions

1. **×Mult floor vs. display** — does the HUD show the current ×Mult (e.g., "×6") like Balatro? (Yes, almost certainly — seeing it climb *is* the payoff.)
2. **Boss count** — confirmed: 2 chambers + boss = 3 stages per dungeon.
3. **Retrigger on barehanded vs. weapon** — should Second Wind and Echo Blade be distinct, or one generic "retrigger" talisman? (Split them — the *choice* between them is what creates builds.)
4. **Do ×Mult talismans stack with the same talisman?** (No — one copy each, Balatro-style. Duplicates in shop just refresh the shop.)

---

## 🔗 Links
- [[Scoundrel Scoring]]
- [[Scoundrel Balatro]]
- [[Scoundrel Talismans]]
- [[Scoundrel Rules]]
- [[Scoundrel Shop]]
