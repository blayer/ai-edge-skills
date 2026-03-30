---
name: blackjack
description: Play a game of Blackjack against the dealer with interactive hit/stand controls.
---

# Blackjack

Play a classic game of Blackjack (21) against the dealer.

## Examples

* "Play blackjack"
* "Deal me a hand of 21"
* "Start a blackjack game with 2 decks"

## Instructions

You MUST use the `run_js` tool (NOT run_intent) with the following exact parameters:

- data: A JSON string with the following fields:
  - decks: Number of decks to use. Default: 1.
  - action: The action to take. Options: "deal", "hit", "stand". Default: "deal".
  - game_state: (Optional) JSON string of the current game state, returned from a previous call. Omit to start a new game.
