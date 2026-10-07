# Booster Pack System Implementation

## Overview
Implemented a booster pack reward mechanic for the Scoundrel Balatro prototype. Booster packs drop after completing rooms and allow players to draft 1 of 3 cards to add to their deck.

## How It Works

### Trigger Condition
- **Chance:** 60% chance after completing a room (all cards cleared from current room)
- **Location:** Triggered in `drawRoom()` function when `unplayed.length === 0 && deck.length > 0`

### Booster Pack Content
- Each booster pack contains 3 randomly generated cards
- Each card is either:
  - **Weapon** (♦ symbol, 2-10 value): Adds damage multiplier capability
  - **Potion** (♥ symbol, 2-10 value): Adds healing capability

### Player Interaction
1. When a room is completed, booster pack UI displays 3 card options
2. Player clicks on 1 card to select it
3. Selected card is added to `extraCards` array
4. Player returns to normal room gameplay

## Key Functions

### `generateBoosterPack()`
Generates 3 random cards (weapons or potions) with values 2-10.

### `showBoosterPackUI()`
Displays the booster pack UI with clickable card options.
- Hides the game screen
- Creates/updates booster-screen div
- Shows cards with visual representations and names

### `selectBoosterCard(index)`
Handles player card selection.
- Adds selected card to `extraCards`
- Logs the event
- Returns to normal gameplay

## Integration Points

1. **Room Completion:** `drawRoom()` checks for room completion and triggers booster pack
2. **Deck Building:** `buildDeck()` adds `extraCards` to the deck
3. **UI:** New booster-screen element displayed/hidden as needed
4. **Game State:** `pendingBoosterPack` tracks current booster pack offer

## Files Modified

- `game.js`: Added booster pack functions and integration
- `test_booster.html`: Test file for booster pack generation (optional)

## Future Enhancements

- Variable drop rates based on difficulty
- Rare card tiers in booster packs
- Special booster pack effects (e.g., guaranteed rare cards)
- Player choice tooltips showing card effects
