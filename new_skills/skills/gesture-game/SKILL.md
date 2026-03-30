---
name: gesture-game
description: Play a heads-up style gesture guessing game with a 90-second timer. Self-contained webview game.
---

# Gesture Game

A heads-up style party game. Hold the phone to your forehead, others describe the word, you guess! Tilt down for correct, tilt up to pass. 90-second timer.

## Examples

* "Start a gesture game"
* "Play gesture game with movies"

## Instructions

Call the `run_js` tool with the following exact parameters:

- data: A JSON string with the following fields:
  - category: Word category. Options: "movies", "animals", "celebrities", "food", "actions", "objects", "mixed". Default: "mixed".

The game is fully interactive in the webview with a 90-second timer. The player taps Correct or Pass buttons, or tilts the phone. Do not describe or list the words.
