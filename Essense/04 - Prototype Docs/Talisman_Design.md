# Scoundrel Balatro: Talisman Design (First 5)

Talismans are persistent items (Joker equivalents) that modify the core Scoundrel mechanics.

| Name | Rarity | Cost | Effect |
| :--- | :--- | :--- | :--- |
| **Silver Blades** | Common | 4G | Weapons deal 2x Damage vs Clubs (effectively higher weapon limit for Clubs). |
| **Quick Feet** | Common | 4G | Dodge 2 damage from every monster attack (Weapon or Fist). |
| **Pickpocket** | Common | 4G | Earn +2 Gold on every barehanded (Fist) kill. |
| **Coward's Luck** | Common | 4G | Heal 1 HP every time you leave a monster card behind in a room. |
| **Expert Blacksmith**| Uncommon| 6G | All equipped Weapons gain +3 to their effective damage value. |

## Mechanics Notes
- **Silver Blades**: In the prototype, this will check `card.suit === 'Clubs'` during the `playCard` logic.
- **Quick Feet**: Subtracts 2 from the `dmg` variable before applying it to HP.
- **Pickpocket**: Increases the `gold` increment in the `isBarehanded` block.
- **Coward's Luck**: Triggers in the `drawRoom` logic when a monster is in the `unplayed` set.
- **Expert Blacksmith**: Adds a flat +3 bonus to the weapon value comparison during combat.
