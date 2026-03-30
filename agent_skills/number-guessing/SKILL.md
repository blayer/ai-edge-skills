---
name: number-guessing
description: Play a number guessing game - guess the secret number with higher/lower hints.
---

# Number Guessing Game

Guess the secret number. Get higher/lower hints after each guess.

## Examples

* "Start a number guessing game"
* "Guess 50"
* "Number guessing game 1 to 1000"

## Instructions

Call the `run_js` tool with the following exact parameters:

- data: A JSON string with the following fields:
  - action: "start" to begin, "guess" to make a guess. Default: "start".
  - min: Minimum number (for start). Default: 1.
  - max: Maximum number (for start). Default: 100.
  - guess: Your number guess (required when action is "guess").
  - game_state: Game state from a previous call (required when action is "guess").
