---
title: Scoundrel Scoring
tags:
  - game-dev
  - scoundrel-balatro
  - scoring
  - design
created: 2026-08-19
last-modified: 2026-08-19
status: design
---

# Scoundrel Balatro — Scoring Paradigm

> **The breakthrough:** scoring is no longer per-kill. It resolves **once per room**, after 3 cards have been cleared and the player progresses to the next room. **Room = hand.**

This is the canonical scoring model. It supersedes the per-kill model in [[Scoundrel Mult & Retrigger]].

---

## Core Loop

> Player enters a room with **0 essence and 0 mult**. Player can clear cards by equipping weapons, drinking potions, or fighting monsters. When a weapon or potion is equipped, the game checks for talismans that can affect doing so. When a monster is killed, base essence and mult are added and the game checks for talisman triggers. Once 3 cards are cleared, the 4th card disappears and the score is calculated and added to the total — retriggers can occur. Then the player progresses to the next room and the next 4 cards are dealt. This continues until the player hits the target score, is killed, or runs out of cards.

### Room Phases

1. **Setup phase** — equip weapons, drink potions. No scoring yet.
2. **Kill phase** — fight monsters. Each kill adds base essence and mult, and fires **on-kill** talisman triggers.
3. **Score phase** — after the 3rd clear, the 4th card leaves, the room's score resolves, and **on-scoring** talisman triggers fire. This is where retriggers happen.

---

## Two-Axis Scoring

The score is a Balatro-style two-axis product:

- **Base essence** = the "chips." Passive — it's the monster's face value (no ×10 scaling), summed over the room's kills.
- **Mult** = the "mult." Active — it's what your kills and talismans build.

### The Formula

```
base      = Σ(monster face value)                 over the 3 kills
mult_raw  = Σ(weapon value per kill) + Σ(+mult talismans)
mult      = mult_raw × Π(×mult talismans)
score     = base × mult
```

- **+Mult** = additive. Weapon value at each kill + flat talisman bonuses.
- **×Mult** = multiplicative. Starts at 1. Each ×Mult talisman multiplies the tallied mult.

**Worked example** — weapon 14, room has {14, 8, 3}, descending play:

```
kill 14 → mult += 14, weapon stays 14
kill 8  → mult += 14, weapon → 8
kill 3  → mult += 8,  weapon → 3

base = 14 + 8 + 3 = 25
mult = 14 + 14 + 8 = 36
score = 900
```

**Talisman example:**

```
Talisman (+4 mult) + Lone Blade (×3 mult)
mult = (mult from kills + 4) × 3
```

The `+4` is inside the parens, the `×3` is outside — **+mult resolves before ×mult.**

---

## Trigger Windows

Talismans fire in two windows, determined by the talisman itself:

1. **On-kill** (specified) — fires per kill, during the room. Output is added *into* mult before scoring. These are the **+mult** tools.
2. **On-scoring** (the default) — fires once at room-end. These scale what's already built. These are the **×mult** tools.

This timing naturally enforces additive-before-multiplicative: on-kill adds happen during the room, on-scoring multiplies happen after.

### Retriggers

A retrigger re-fires a talisman's effect:
- **On-kill retrigger** → re-fires the additive talisman (double-dip the +mult).
- **On-scoring retrigger** → re-fires the multiplicative talisman (double-dip the ×mult).

Retriggers can occur in the score phase.

---

## Talisman Ordering

**Talisman ordering is preserved** (Balatro-style left-to-right / joker-slot order). A ×mult can fire *mid-tally* rather than strictly "additive then multiplicative" — order is a player-managed property, not a hard rule.

**Why this matters — copy/positional effects:** a talisman whose effect depends on *position* or *neighbors* becomes possible. The flagship example is the Balatro **Blueprint** analog — a talisman that **copies the ability of the adjacent talisman** in the trigger order. This is the class of card that makes ordering a genuine strategic axis.

> Open design note: reconcile "ordering is positional" with the two trigger windows. Proposal: *within* a window, talismans resolve in slot order; the window itself (kill vs. scoring) is a fixed property of each talisman. This gives both automatic +/× separation *and* positional copy effects.

---

## The 4th Card (Left Behind)

Because scoring resolves at the room boundary, **the card you leave behind becomes a strategic decision**:

- Leave a **high monster** → preserve your weapon multiplier for the next room (you didn't kill down to it).
- Leave a **low monster** → small essence hit now, clean multiplier next room.
- Leave a **potion** → sacrificed healing to score more.
- Leave a **weapon** → chose not to upgrade.

Every room offers 4-choose-1, and the state carried forward is shaped by what was ditched. This is the replayable decision.

---

## Rarity Gradient

- **+mult talismans** → common. Add to the mult box.
- **×mult talismans** → rare. Multiply the whole tallied mult — and because they compound every +mult and kill before them, they must stay scarce. This is what makes rare cards feel rare and worth chasing.

---

## Chamber Target Scaling

Targets scale **exponentially** (Balatro-style), because the mult engine compounds — linear targets get trivialized once ×mult talismans and retriggers exist.

```
dungeonBase = 1000 × G^(dungeon - 1)     // G = 3 (placeholder growth rate)
chamberMult = [1, 1.5, 2]                // chamber 1 / 2 / 3
target      = dungeonBase × chamberMult[chamber - 1]
```

- **Dungeon 1:** 1,000 / 1,500 / 2,000
- **Dungeon 2:** 3,000 / 4,500 / 6,000
- **Dungeon 3:** 9,000 / 13,500 / 18,000

- **Within a dungeon:** fixed multipliers (×1 / ×1.5 / ×2).
- **Between dungeons:** geometric, ×3 per dungeon.
- **`G` is the tunable constant** — it assumes score-per-room compounds ~3× per dungeon, which only holds once the talisman engine lands. Re-tune against playtest data.
- **Difficulty levers:** `base` (1,000), `G` (3), and `chamberMult` are the three constants. Higher difficulties raise `G` or `base`; lower ones flatten `G`. Keep the *shape* identical and vary the constants — this is what the chamber mult of [1, 1.5, 2] is for.

---

## Key Consequences

1. **Weapon value is the independent mult term.** Since the weapon degrades to monster value, the monsters echo into mult — the *only* free numbers are the starting weapon value and talismans. Weapons/talismans are the mult axis; monsters are the base axis.
2. **Equipment/potions are a score tax.** Only kills add base and mult. A room cleared as "kill + equip + drink" scores on one kill's worth; "kill × 3" scores on three. Survival utility secretly costs score — a dial for chamber target balancing.
3. **"0 mult at room start"** means "0 accumulated *this* room." The equipped weapon carries over and seeds the next room's first kill.
4. **×mult applies to mult, not to `base × mult`.** Keeps the curve sane; a rare "× on the whole score" can be a legendary/boss modifier.

---

## Open Questions

1. **Ordering vs. windows** — does the positional order live *within* each window (recommended), or globally across all talismans?
2. **Copy/Blueprint analog** — what's the exact copy rule (adjacent slot? same window? same type)?
3. **×mult display** — show current ×mult in the HUD (Balatro-style "×6") so players see it climb?
4. **Retrigger target** — retrigger-the-talisman (additive, clean) vs. retrigger-the-kill (explosive, multiplies base too). Start with the former.
5. **Self-retrigger protection** — a talisman must not retrigger itself or create infinite chains (finite chain cap).

---

## 🔗 Links
- [[Scoundrel Balatro]]
- [[Scoundrel Mult & Retrigger]]
- [[Scoundrel Talismans]]
- [[Scoundrel Rules]]
- [[Scoundrel Weapons]]
- [[Scoundrel Economy]]
