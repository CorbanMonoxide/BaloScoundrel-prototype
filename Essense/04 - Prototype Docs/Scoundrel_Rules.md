# Scoundrel Rules (Prototype Implementation)

## Core Loop
- **Chambers**: A single run through a generated deck.
- **Rooms**: 4 cards are drawn at a time.
- **The "Left Behind" Rule**: You must play (interact with) at least 3 out of 4 cards to proceed to the next room. Exactly 1 card is left behind/escapes.

## Card Types
- **Monsters (Spades/Clubs)**: Must be defeated using a Weapon or Fists.
- **Weapons (Diamonds)**: Equipping a Diamond card sets your current Weapon Value and Multiplier.
- **Potions (Hearts)**: Heals HP equal to the card value. Only 1 potion can be used per room (unless modified).

## Combat & Scoring
- **Fists (Barehanded)**: You take damage equal to the Monster's value. Scored as `(Monster Value * 10) * 1`.
- **Weapon**: You take damage equal to `max(0, Monster Value - Effective Weapon Value)`. 
- **Weapon Degradation**: After a weapon kill, the weapon's value effectively drops to the value of the monster killed. You cannot use a weapon to kill a monster with a value higher than the current weapon's limit (established by the previous kill).
- **Scoring**: `(Monster Value * 10) * Weapon Multiplier`.

## Economy
- **Gold**: Earned on every monster kill. 
  - Value 2-10: 1G
  - J/Q/K/A: Value-9 G (e.g., Ace is 5G).
