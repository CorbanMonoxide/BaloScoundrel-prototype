---
title: Scoundrel Shop
tags:
  - game-dev
  - scoundrel-balatro
  - mechanics
created: 2026-03-31
last-modified: 2026-03-31
---

# Scoundrel Shop

The Shop round occurs between **Chambers** (sub-dungeons), giving players a chance to spend their earned Gold to upgrade their run before the next map phase. 

The shop is divided into four distinct sections: **Talismans**, **Consumables**, **Magic**, and **Chests**.

## 1. Talismans (The "Jokers")
Talismans are persistent modifiers that remain active for the duration of the run. They fundamentally alter scoring, combat math, or the economy. See [[Scoundrel Talismans]] for the running list. 
*   *Visuals & UI*: Represented as rectangular slabs. They appear in the UI along the bottom left of the screen.
*   *Capacity*: A player can hold up to 4 Talismans at a time (unless increased by additional Magic/Voucher modifiers).
*   *Role*: Build-defining passive items.

## 2. Consumables
Single-use or temporary items that offer immediate tactical advantages or survival utility. See [[Scoundrel Consumables]] for the full list of items and their rarities.

**Instant recovery purchases** (the Gold → survival sink, added with HP-persistence):
- **Healing Salve** (instant): Restore 10 HP immediately. High shop appearance rate.
- **Armor Plate** (instant): +5 Shield immediately. Lower shop appearance rate.

## 3. Magic (The "Vouchers")
Magic purchases alter foundational rules and aspects of the game run itself. Like Vouchers in Balatro, their effects are permanent for the rest of the dungeon run.
*   **Bank Gold**: Gives interest on unspent gold after each round/chamber.
*   **Talisman Belt**: Increases your maximum Talisman capacity from 4 to 5.
*   **Evasion Tactics**: Allows you to skip *two* rooms in a row without penalty, instead of just one.
*   **Bottomless Flask**: You may consume up to two Health Potions per room (overriding the base rule of 1 per turn).
*   **Master Key**: When opening a Chest, you may select 2 items to keep instead of 1.
*   **Arcane Supplier**: Significantly increases the shop and chest appearance rate of the extremely rare Transformation Consumables.

## 4. Chests (The "Booster Packs")
Players can pay gold to open a Chest, which reveals a random assortment of three items (a mix of Talismans, Weapons, or Consumables). The player then gets to choose one item from the selection to keep for their run. This introduces a drafted RNG element to shop rounds.
*   **Pricing & Rerolling**: A Chest costs 5 Gold initially. Each time a Chest is purchased during the same shop visit, its cost increases by 5 Gold (5G → 10G → 15G, etc.). This cost resets back to 5 Gold the next time the player visits the shop. This replaces the standard reroll mechanic by allowing players to buy subsequent chests if they want a different set of draft options, at a scaling premium.

---
## 🔗 Links
- [[Scoundrel Balatro]]