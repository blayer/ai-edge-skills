---
name: blackjack
description: Play a game of Blackjack against the dealer with interactive hit/stand controls.
---

# Blackjack

Play a classic game of Blackjack (21) against the dealer.

## Examples

* "Play blackjack"
* "Hit"
* "Stand"
* "Deal"

## Instructions

You MUST use the `run_js` tool (NOT run_intent) to play this game.

### How to play

**Starting a new game:**
Call run_js with data: {"action": "deal"}

**When the player says "hit":**
Call run_js with data: {"action": "hit", "player_cards": ["7H", "KD"], "dealer_visible": "QS", "dealer_hidden": "SQ"}

**When the player says "stand":**
Call run_js with data: {"action": "stand", "player_cards": ["7H", "KD"], "dealer_visible": "QS", "dealer_hidden": "SQ"}

### IMPORTANT rules for hit and stand:

You MUST pass back the exact card values from the previous result:
- player_cards: copy the player_cards array from the last result
- dealer_visible: copy the dealer_visible value from the last result
- dealer_hidden: copy the dealer_hidden value from the last result

Card format: rank + suit letter. Examples: 7H, KD, AS, 10C, QS, 2H.

After each call, show the "result" text to the player.
