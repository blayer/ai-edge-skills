---
name: expense-splitter
description: Calculate optimal debt settlements among a group in webview.
---

# Expense Splitter

Calculate who owes whom and find optimal settlements.

## Examples

* "Alice paid 60 for dinner, Bob paid 30 for drinks, split between Alice Bob and Charlie"
* "Split $100 restaurant bill: Alice paid, shared with Bob and Charlie"

## Instructions

Call the `run_js` tool with the following exact parameters:

- data: A JSON string with the following fields:
  - expenses: Array of expense objects, each with "payer" (string), "amount" (number), and "participants" (array of strings).

Example data value:
```
{"expenses":[{"payer":"Alice","amount":60,"participants":["Alice","Bob","Charlie"]},{"payer":"Bob","amount":30,"participants":["Alice","Bob","Charlie"]}]}
```
