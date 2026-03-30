---
name: palette-maker
description: Generate color palettes from a base color using color theory, returned as a base64-encoded SVG image.
---

# Palette Maker

Generate color palettes based on color theory from a base hex color.

## Examples

* "Create a complementary palette from #FF5733"
* "Generate a triadic color scheme based on #3498DB with 7 colors"
* "Make a monochromatic palette from #2ECC71"

## Instructions

Call the `run_js` tool with the following exact parameters:

- data: A JSON string with the following fields:
  - base_color: (required) A hex color string, e.g., "#FF5733".
  - palette_type: The type of color harmony. Options: "complementary", "triadic", "analogous", "split_complementary", "tetradic", "monochromatic". Default: "complementary".
  - count: Number of colors in the palette. Options: 3, 5, 7. Default: 5.
