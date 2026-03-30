---
name: svg-icon-builder
description: Generate SVG icons from shape descriptions, displayed as an interactive webview.
---

# SVG Icon Builder

Generate simple SVG icons based on shape descriptions.

## Examples

* "Create a red star icon"
* "Generate a heart icon"
* "Make a gear icon in blue"

## Instructions

Call the `run_js` tool with the following exact parameters:

- data: A JSON string with the following fields:
  - shape: The icon shape. Options: "circle", "square", "star", "heart", "arrow", "check", "cross", "home", "user", "gear". Default: "circle".
  - color: The icon color as hex string. Default: "#4A90D9".
  - size: The icon size in pixels. Default: 64.
  - background: Background color or "transparent". Default: "transparent".
