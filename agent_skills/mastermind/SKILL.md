---
name: mastermind
description: Play Mastermind - crack the secret color code using logic and deduction.
---

# Mastermind

Guess the secret 4-color code. After each guess you get hints about correct colors and positions.

## Examples

* "Play mastermind"
* "Guess red blue green yellow"
* "Mastermind with 6 colors"

## Instructions

Call the `run_js` tool with the following exact parameters:

- data: A JSON string with the following fields:
  - action: "start" to begin, "guess" to submit a guess. Default: "start".
  - colors: Number of available colors (4-8). Default: 6.
  - guess: Array of 4 color names for your guess. Available colors: red, blue, green, yellow, orange, purple, pink, cyan.
  - game_state: Game state from a previous call (required when action is "guess").
