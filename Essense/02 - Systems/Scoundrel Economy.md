---
title: Scoundrel Economy
tags:
  - game-dev
  - scoundrel-balatro
  - economy
created: 2026-03-31
last-modified: 2026-03-31
---

# Scoundrel Economy

Gold is the primary currency in [[Scoundrel Balatro]], earned by defeating monsters during chambers and spent in the [[Scoundrel Shop]] between rounds to acquire Talismans, Consumables, and Magic.

## Monster Gold Values

Each monster drops a specific amount of base gold when defeated. The amount of gold dropped scales with the face value of the monster card:

- **2 through 10:** 1 Gold
- **Jack:** 2 Gold
- **Queen:** 3 Gold
- **King:** 4 Gold
- **Ace:** 5 Gold

## Additional Gold Generation

Base monster values are only one way to generate economy. Other sources of gold include:

- **Overkill Bonus:** `Gold += max(0, Weapon value − Monster value)`. Using high-value weapons to kill weak monsters yields the difference as bonus gold (e.g., a 5-Weapon killing a 2-Monster yields 3 bonus gold).
- **Talismans:** Modifiers (such as "Pickpocket" or "Bounty Hunter") can increase specific gold payouts.
- **Magic/Vouchers:** Permanent run upgrades (e.g., "Bank Gold") can provide compounding interest on unspent gold after each chamber.

---

## 🔗 Links
- [[Scoundrel Balatro]]
- [[Scoundrel Shop]]
- [[Scoundrel Talismans]]