---
name: password-generator
description: Generate secure passwords with configurable length, character sets, and rules.
---

# Password Generator

Generate secure random passwords.

## Examples

* "Generate a strong password"
* "Create 5 passwords with 20 characters"
* "Generate a numeric PIN"

## Instructions

Call the `run_js` tool with the following exact parameters:

- data: A JSON string with the following fields:
  - length: Password length. Default: 16.
  - count: Number of passwords. Default: 1.
  - uppercase: Include uppercase letters. Default: true.
  - lowercase: Include lowercase letters. Default: true.
  - numbers: Include numbers. Default: true.
  - symbols: Include symbols. Default: true.
  - exclude_ambiguous: Exclude ambiguous characters (O, I, l, 0, 1). Default: false.
