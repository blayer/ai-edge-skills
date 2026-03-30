---
name: smart-pantry
description: Track pantry items and get recipe suggestions based on what you have on hand.
---

# Smart Pantry

Manage your pantry inventory and discover recipes you can make with ingredients on hand.

## Examples

* "Add eggs, milk, and butter to my pantry"
* "What recipes can I make?"
* "Remove chicken from my pantry"
* "Add items from my receipt"
* "Show my pantry"

## Instructions

You MUST use the `run_js` tool (NOT run_intent) with the following exact parameters:

- data: A JSON string with the following fields:
  - action: The action to take. Options: "add", "remove", "list", "recipes", "clear". Default: "list".
  - items: Array of {name, quantity, unit} objects for "add" action.
  - receipt_text: String of receipt text to parse for "add" action.
  - remove_items: Array of item name strings for "remove" action.
  - game_state: (Optional) JSON string of the current pantry state, returned from a previous call. Omit to start fresh.
