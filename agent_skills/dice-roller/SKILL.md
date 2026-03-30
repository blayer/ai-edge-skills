---
name: dice-roller
description: Roll dice with configurable count and sides. Shows individual results and totals.
---

# Dice Roller

Roll any combination of dice.

## Examples

* "Roll 2d6"
* "Roll 4 twenty-sided dice"
* "Roll 8d10 with advantage"

## Instructions

Call the `run_js` tool with the following exact parameters:

- data: A JSON string with the following fields:
  - count: Number of dice to roll. Default: 1.
  - sides: Number of sides per die. Default: 6.
  - modifier: Number to add/subtract from total. Default: 0.
  - advantage: Roll twice and take higher total. Default: false.
  - disadvantage: Roll twice and take lower total. Default: false.
