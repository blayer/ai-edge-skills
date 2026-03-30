---
name: color-palette-explorer
description: Generate color swatches and palettes from mood descriptions in webview.
---

# Color Palette Explorer

Generate harmonious color palettes from descriptions.

## Examples

* "Create a sunset color palette"
* "Show me ocean-themed colors"

## Instructions

Call the `run_js` tool with the following exact parameters:

- data: A JSON string with the following fields:
  - mood: A description of the mood or theme (e.g., "sunset", "ocean", "forest").
  - count: Number of colors to generate. Default: 5.
  - base_color: Optional hex color to build palette from.
