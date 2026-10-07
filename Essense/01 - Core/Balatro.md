---
title: Balatro
tags:
  - game
  - reference
  - roguelike
created: 2026-03-19
last-modified: 2026-03-19
---

# Balatro

## 🛠️ Development Stack
- **Engine**: [LÖVE (Love2D)](https://love2d.org/)
- **Language**: [Lua](https://www.lua.org/)

## 📝 Overview
*Balatro* is a poker-themed roguelike deck-builder created by the solo developer *LocalThunk*. It is famous for its extreme level of "math-heavy" synergy design and minimalist aesthetic. 

### Why it works
1.  **Optimized Engine**: By using LÖVE/Lua, the developer achieved extremely high performance with very low system overhead. The game logic (calculating millions of score permutations per second) is handled almost entirely on the CPU in Lua, which is highly efficient for this type of logic.
2.  **Synergy Design**: The core loop relies on "Multiplier" and "Additive" scoring modifiers. The game treats scoring as a pure mathematical formula that players manipulate through items (Jokers) rather than purely "winning hands."
3.  **Minimalist Scope**: By sticking to 2D card art and standard poker hands, the developer focused 100% of the dev time on the "math engine" rather than 3D assets.

## 🔗 Related Projects
- [[Scoundrel Balatro]]
