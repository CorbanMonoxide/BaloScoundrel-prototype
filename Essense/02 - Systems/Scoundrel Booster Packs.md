---
title: Scoundrel Booster Packs
tags:
  - game-dev
  - scoundrel-balatro
  - shop-system
  - progression
created: 2026-05-06
last-modified: 2026-05-06
status: design
---

# Scoundrel Booster Packs

## Overview

Before accessing the standard shop, players choose one of two randomly-selected **Booster Packs**. Each pack contains 5 cards/items with weighted spawn rates by pack type. Opening a pack adds deck cards immediately and offers talisman/item selections to the player's loadout.

**Progression Flow:**
```
Chamber Start → Booster Pack Choice (Pick 1 of 2) → Open Pack → Standard Shop → Combat
```

---

## Pack Types & Spawn Weights

### Pack 1: **Love Pack** (Potion-Focused)
- **Theme:** Healing & recovery focus
- **Rarity:** Common
- **Appearance Rate:** High (baseline)

**Spawn Weights (per slot):**
| Type | Weight | Notes |
|------|--------|-------|
| Health Potion (♥ 2-10) | 50% | Primary focus |
| Monster (♠♣) | 20% | Filler |
| Weapon (♦) | 20% | Rare |
| Talisman (Health-themed) | 5% | Quick Feet, Blood Vial, Undying |
| Item | 5% | Very rare |

**Typical Contents:** 3-4 potions + 1 monster + maybe 1 heal talisman

---

### Pack 2: **Monster Booster** (Combat-Focused)
- **Theme:** Dense combat encounters
- **Rarity:** Common
- **Appearance Rate:** High (baseline)

**Spawn Weights (per slot):**
| Type | Weight | Notes |
|------|--------|-------|
| Monster (♠♣) | 50% | Primary focus |
| Health Potion (♥) | 20% | Sustain |
| Weapon (♦) | 20% | Combat enabler |
| Talisman (Combat-themed) | 5% | Fists of Iron, Intimidation, etc. |
| Item | 5% | Very rare |

**Typical Contents:** 3-4 monsters + 1-2 weapons + maybe 1 combat talisman

---

### Pack 3: **Builders Box** (Item-Focused)
- **Theme:** Economy & utility items
- **Rarity:** Uncommon
- **Appearance Rate:** Medium

**Spawn Weights (per slot):**
| Type | Weight | Notes |
|------|--------|-------|
| Item (consumable/magic) | 50% | Shield, Smokescreen, Magic vouchers |
| Talisman (Economy-themed) | 20% | Pickpocket, Chump Change, Copper, etc. |
| Monster (♠♣) | 20% | Filler |
| Weapon (♦) | 5% | Filler |
| Health Potion (♥) | 5% | Rare |

**Typical Contents:** 2-3 items/consumables + 1-2 talismans + 1 filler card

---

### Pack 4: **Armory Pack** (Weapon-Focused)
- **Theme:** Weapon diversity & scaling
- **Rarity:** Uncommon
- **Appearance Rate:** Medium

**Spawn Weights (per slot):**
| Type | Weight | Notes |
|------|--------|-------|
| Weapon (♦) | 50% | Primary focus |
| Talisman (Weapon-themed) | 20% | Tempered Steel, Expert Blacksmith, etc. |
| Monster (♠♣) | 20% | Filler |
| Health Potion (♥) | 5% | Sustain |
| Item | 5% | Very rare |

**Typical Contents:** 2-3 weapons + 1 weapon talisman + 1-2 filler

---

### Pack 5: **Shiny Booster** (Legendary-Focused)
- **Theme:** Ultra-rare, game-changing modifiers
- **Rarity:** Rare (2-3% appearance rate per chamber)
- **Appearance Rate:** Low (must hit rare spawn)
- **Guaranteed:** Exactly 1 Legendary Talisman

**Spawn Weights (per slot):**
| Type | Weight | Notes |
|------|--------|-------|
| **Legendary Talisman** | 50% (Slot 1 guaranteed) | Always in first position |
| Rare Talisman | 20% (Slots 2-5) | Rare talisman pool |
| Uncommon Talisman | 20% | Uncommon pool |
| Monster (♠♣) | 5% | Filler |
| Weapon (♦) | 5% | Filler |

**Typical Contents:** 1 Legendary + 2-3 rare/uncommon talismans + filler

---

## Booster Pack UI Flow

### 1. **Pack Selection Screen**
```
┌─────────────────────────────────────────┐
│     BOOSTER PACK CHOICE                 │
│     Choose one to continue...           │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────┐    ┌──────────────┐  │
│  │ [Pack Icon]  │    │ [Pack Icon]  │  │
│  │  Pack Name   │    │  Pack Name   │  │
│  │  Description │    │  Description │  │
│  │              │    │              │  │
│  │   [Open]     │    │   [Open]     │  │
│  └──────────────┘    └──────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

**Logic:**
- Randomly select 2 of 5 pack types (weighted: Shiny Booster is rare)
- Display pack name, theme description, and icon
- Player clicks "Open" to choose a pack

---

### 2. **Pack Opening Animation**
```
┌─────────────────────────────────────────┐
│     OPENING [PACK NAME]                 │
├─────────────────────────────────────────┤
│                                         │
│  ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐             │
│  │  │ │  │ │  │ │  │ │  │  Opening... │
│  └──┘ └──┘ └──┘ └──┘ └──┘             │
│                                         │
└─────────────────────────────────────────┘
```

**Animation:** Flip/reveal 5 cards one by one with brief pause

---

### 3. **Pack Contents & Selection**
```
┌─────────────────────────────────────────┐
│     PACK CONTENTS                       │
├─────────────────────────────────────────┤
│                                         │
│  🃏 5♥ Potion        → [+Deck] (auto)  │
│  🃏 6♥ Potion        → [+Deck] (auto)  │
│  🃏 2♠ Monster       → [+Deck] (auto)  │
│  🎁 Quick Feet       → [+Talisman] ✓   │
│  🎁 Undying          → [+Talisman] ✓   │
│                                         │
│              [Continue to Shop]         │
│                                         │
└─────────────────────────────────────────┘
```

**Logic:**
- **Deck Cards** (Monsters, Weapons, Potions): Auto-add to deck, display "✓ Added"
- **Talismans**: Show with checkbox; player ticks to add to loadout
- **Items** (Consumables): Show with checkbox; player ticks to add to inventory
- Once all choices made, proceed to standard shop

---

## Item Spawn Probabilities

### Deck Cards (Auto-Add)
| Card | Base Chance |
|------|-------------|
| 2♥-10♥ (Potions) | 15% per pack slot |
| 2♠-14♠ (Monsters) | 18% per pack slot |
| 2♣-14♣ (Monsters) | 18% per pack slot |
| 2♦-10♦ (Weapons) | 8% per pack slot |

### Talismans (Optional-Add)
| Talisman | Base Chance | Rarity |
|----------|-------------|--------|
| Tempered Steel | 4% | Common (appears in 1-2 packs) |
| Quick Feet | 4% | Common |
| Pickpocket | 4% | Common |
| Intimidation | 4% | Common |
| Chump Change | 3% | Common |
| Copper Talisman | 3% | Common |
| Fists of Iron | 3% | Common |
| Smoke Bomb | 2% | Uncommon |
| Expert Blacksmith | 2% | Uncommon |
| Scary Aura | 2% | Uncommon |
| Bounty Hunter | 2% | Uncommon |
| Steel Talisman | 1.5% | Uncommon |
| Blood Vial | 0.8% | Rare |
| Undying | 0.8% | Rare |
| Gold Talisman | 0.8% | Rare |
| Legendary Talismans | 0.1% | Legendary |

### Consumables/Magic (Optional-Add)
| Item | Base Chance | Notes |
|------|-------------|-------|
| Shield | 2% | 5G equivalent |
| Smokescreen | 2% | 5G equivalent |
| Bank Gold | 1% | 25G equivalent |
| Talisman Belt | 1% | 25G equivalent |
| Evasion Tactics | 1% | 25G equivalent |
| Bottomless Flask | 0.5% | 25G equivalent |
| Master Key | 0.5% | 25G equivalent |
| Arcane Supplier | 0.5% | 25G equivalent |

---

## Implementation Roadmap

### Phase 1: Core Pack System (Week 1)
- [ ] Define `BoosterPack` object structure
- [ ] Implement pack type definitions (5 types)
- [ ] Create pack selection UI (2 random packs)
- [ ] Create pack opening animation
- [ ] Implement deck card auto-add logic

### Phase 2: Item Selection (Week 2)
- [ ] Add talisman/item selection UI
- [ ] Implement checkbox logic
- [ ] Add "Continue to Shop" button
- [ ] Test integration with existing shop

### Phase 3: Spawn Weighting (Week 3)
- [ ] Implement weighted random selection
- [ ] Tune spawn probabilities per pack
- [ ] Test distribution (run 100+ simulations)
- [ ] Balance against shop economy

### Phase 4: Polish & Balance (Week 4)
- [ ] Add animations & visual feedback
- [ ] Implement audio cues (optional)
- [ ] Playtesting & tuning
- [ ] Document final probabilities

---

## Design Decisions

### Why Booster Packs?
1. **Thematic:** Echoes Balatro's shop/reward system with a roguelike twist
2. **Deck Scaling:** Naturally injects variety without gold cost overhead
3. **Choice:** Player agency (2-pack choice) mirrors Balatro's forced decisions
4. **Engagement:** Opening packs is satisfying (psychological reward)

### Why 2 Packs Per Offer?
- Forces binary choice (easier than 3+)
- Maintains risk/reward tension
- Fits screen real estate in most layouts

### Why Auto-Deck vs. Optional?
- **Auto:** Monsters, Weapons, Potions go straight into deck (no inventory burden)
- **Optional:** Talismans & consumables require explicit selection (player commits)
- **Rationale:** Keeps UI simple; heavy items are "active" choices

### Why 5 Pack Types?
- 3 common types (baseline)
- 2 uncommon types (strategic diversity)
- Shiny Booster adds chase/dream element

---

## Future Extensions

- **Cursed Packs:** Negative effects (monsters with higher stats, debuffs)
- **Seasonal Packs:** Limited-time themed boosters
- **Pack Synergy:** "Opening 2 Love Packs grants +1 HP healing" bonuses
- **Legendary Mechanics:** Each legendary talisman unlocks unique pack interactions

---

## 🔗 Links
- [[Scoundrel Balatro]]
- [[Scoundrel Shop]]
- [[Scoundrel Talismans]]
- [[Scoundrel Consumables]]
