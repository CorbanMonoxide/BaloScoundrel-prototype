---
title: "2026-03-27 - Nav Conversation - Scoundrel Balatro Game Flow"
tags:
  - conversation
  - nav
  - game-dev
  - scoundrel-balatro
  - brainstorming
created: 2026-03-27
last-modified: 2026-03-27
---

# Conversation with Nav - 2026-03-27

## 📌 Summary
Brainstorming session focused on establishing the high-level game flow for [[Scoundrel Balatro]]. Defined chamber progression, the Gold economy, modifier tiers, and death state. Rules for the original [[Scoundrel Rules|Scoundrel]] solitaire game were reviewed and a reference note was created.

## 💬 Dialogue Highlights
> [!abstract] Key Points
> - Chamber progression: small deck → larger deck per chamber, with a shop screen between chambers.
> - Deck size and composition are **changeable variables** (affected by modifiers and chamber scaling).
> - Currency is **Gold**, earned by killing monsters.
> - Overkill gold formula: `Gold bonus = max(0, Weapon value − Monster value)`.
> - Three modifier tiers: Persistent (Joker-style), Consumables, and Deck Modifications.
> - Death mid-chamber = **lose the entire run**.
> - The "no skip two rooms in a row" rule can be interacted with by a modifier.

## 🛠️ Actions & Decisions
- [x] Created [[Scoundrel Rules]] reference note with full ruleset.
- [x] Updated [[Scoundrel Balatro]] project note with chamber progression, economy, and modifier tier decisions.
- [x] Committed and pushed both notes to GitHub.
- [ ] Define deck composition per chamber (card counts, monster range, etc.).
- [ ] Design first 5 Joker-style modifiers.
- [ ] Prototype room/deck layout.

## 🔗 Links
- [[Scoundrel Balatro]]
- [[Scoundrel Rules]]
- [[Balatro]]
- [[Nav]]

---

## 📜 Transcript (Key Exchanges)

**On chamber structure:**
> "Each time you clear the deck, chamber, you would then go to the next chamber that has a larger deck. Between chambers there should be a screen to purchase modifiers."

**On Gold economy:**
> "Gold. You earn gold for killing monsters. Maybe we also earn extra gold for killing a monster that's x smaller than the weapon?"
> *(Resolved: `Gold bonus = Weapon value − Monster value` when positive)*

**On modifier tiers:**
> "All three tiers." *(Persistent, Consumables, Deck Modifications)*

**On death:**
> "You normally lose the entire run."

**On the skip rule:**
> "A modifier could interact with that."
