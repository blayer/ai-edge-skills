---
name: hangman
description: Play Hangman - an interactive word guessing game with a tappable keyboard.
---

# Hangman

Play an interactive Hangman game. Tap letters on screen to guess the hidden word before the hangman is drawn.

## Examples

* "Start a hangman game"
* "Play hangman with category animals"
* "Let's play hangman"

## Instructions

Call the `run_js` tool with the following exact parameters:

- data: A JSON string with the following fields:
  - category: Word category. Options: "animals", "countries", "fruits", "colors", "sports". Default: random.

The game is fully interactive in the webview. The player taps letters directly on screen. Do not reveal or discuss the hidden word.
