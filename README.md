# BaloScoundrel / Essence

A **Balatro-flavored Scoundrel roguelike** built in **HTML/JavaScript**.

The current demo is increasingly centered on an **Essence scoring loop**:
- clear a 4-card room
- build **Base** from monsters you defeat
- stack **Mult** from weapons, talismans, potions, and combat choices
- cash the room out as **Base × Mult**
- hit the **chamber target** before the deck runs dry
- spend earned gold in the shop to shape the next chamber

This is no longer just “Scoundrel with a shop.” The prototype is now about converting tactical room decisions into a score engine.

## Core Room Structure

Each room draws **4 cards**.
You must resolve **at least 3** of them to move on.
Exactly **1 card is left behind**.

### Card suits
- **♠ / ♣ Monsters** — the main source of Base, damage, and gold
- **♦ Weapons** — define your current weapon damage profile and usually your mult scaling
- **♥ Potions** — restore HP and, with some talismans, can also contribute to mult

## The Scoring Loop

The current run structure is built around **room scoring**, not per-hit scoring.

### 1) Build Base
When you defeat monsters in a room, they add to the room’s **Base**.

In the current prototype, monster value is converted into scoring essence at a **10× scale**:
- defeating a value 7 monster contributes **70 Base**
- defeating multiple monsters stacks that Base before the room resolves

Some talismans add **bonus Base** against specific monster types.

### 2) Build Mult
Mult is assembled during the room from several sources:
- the currently equipped weapon
- weapon-family talismans
- flat talisman bonuses
- barehanded modifiers
- potion-to-mult effects
- held-talisman scaling effects

Important: the prototype currently treats **equipping a weapon as setting your main room mult engine**. Weapon choice is therefore both a survival tool and a scoring commitment.

### 3) Cash Out the Room
Once 3 cards are cleared and the room is resolved, the game scores the room as:

`Room Score = Room Base × Room Mult`

That room score is then added to the chamber total.

If you clear a room with no monsters, you usually get **no score** from that room.

## Combat Tension

### Weapons degrade
After a weapon kill, the weapon’s effective limit drops to the value of the monster you just killed.
That means:
- big weapons let you open strong
- weak kills can shrink your ceiling
- saving a weapon for the right monster can matter more than using it immediately

### Barehanded is a real scoring choice
Going barehanded is not just desperation.
Depending on talismans, it can be a valid scoring/economy line:
- fist-specific mult effects
- gold-on-barehanded-kill effects
- weapon preservation for a later room

### HP persists as pressure
The current demo includes persistent HP pressure across progression, with healing, shield, revive, and mitigation effects shaping whether you can afford greedier scoring lines.

## Chamber / Dungeon Structure

Runs are divided into **chambers** and **dungeons**.

### Chamber targets
Each chamber has a **target score**.
You advance by reaching that target before exhausting the chamber’s deck pressure.

The current prototype uses:
- **3 chambers per dungeon**
- escalating chamber targets inside a dungeon
- geometric/exponential target scaling across dungeons

So the game loop is:
1. enter chamber
2. clear rooms
3. convert room decisions into score
4. beat target
5. shop
6. enter next chamber

## Gold Economy

Gold is earned primarily from monster kills, then spent between chambers.

Gold can be improved by build choices such as:
- barehanded kill bonuses
- bounty effects on strong monsters
- overkill bonuses
- damage-taken-to-gold effects

Gold is then turned into power through the shop.

## Shop Layer

Between chambers, the shop lets you reshape the run.

Current categories include:
- **Talismans** — persistent build-defining modifiers
- **Consumables** — immediate utility and survivability
- **Magic Items** — broader run-level upgrades
- **Chests / Pack-style randomness**
- **Shop rerolls** — currently escalating in cost: **5G, 10G, 15G, ...**

The shop exists to answer the scoring question:
**how do you make the next chamber’s Base × Mult line stronger, safer, or greedier?**

## Talisman System

The prototype now includes a substantial talisman pool with effects that push builds in different directions:
- weapon-family mult builds
- fist builds
- potion builds
- monster-type hate packages
- gold snowball lines
- flee/tempo utility
- survivability and revive effects
- scaling “more talismans = more mult” effects

Talismans are the main bridge between “Scoundrel tactics” and “Balatro-style build expression.”

## Current Prototype Identity

The strongest current identity of the demo is:

**Scoundrel room tactics feeding a Balatro-style score engine.**

You are not just trying to survive a room.
You are trying to decide:
- which monster becomes Base now
- which weapon line becomes Mult
- what damage is acceptable
- when to preserve a weapon
- when to take gold instead of safety
- when to shop for survival vs scaling

That is the heart of the current demo.

## Repo Contents

### Playable prototype
- `index.html`
- `game.js`

Open `index.html` in a browser to play the current demo.

### Design / implementation docs
- `Scoundrel_Rules.md`
- `Talisman_Design.md`
- `BOOSTER_PACK_FEATURE.md`
- `IMPLEMENTATION_SUMMARY.txt`

### Obsidian vault
The repo includes an Obsidian vault at:
- `Essense/`

This vault contains:
- current game design notes
- prior conversation notes
- prototype documentation

Open the `Essense/` folder itself as an Obsidian vault.

## Near-Term Focus

Current direction, based on the playable demo:
- refine the **Base × Mult** scoring loop
- tighten chamber target pacing
- make weapon choices create more interesting score tension
- balance gold vs survivability vs scaling
- continue expanding talisman/build diversity
- keep shaping the project around the **Essence** identity

## Longer-Term Direction

- deeper content pools
- better room/chamber modifiers
- stronger booster / pack systems
- cleaner presentation and UX
- eventual **LÖVE 2D** production build

---

If you are opening this repo fresh, start here:
1. play the web demo
2. read `Scoundrel_Rules.md`
3. open the `Essense/` vault for the broader design notes
