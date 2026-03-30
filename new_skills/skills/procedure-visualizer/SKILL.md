---
name: procedure-visualizer
description: Generate SVG flowchart diagrams from natural language procedure descriptions, returned as a base64-encoded SVG image.
---

# Procedure Visualizer

Generate flowchart/procedure diagrams from natural language text descriptions.

## Examples

* "Visualize: 1. Start server 2. Check if database is connected 3. Load configuration 4. Begin processing"
* "Create a flowchart for: Wake up, Check if it's raining, Take umbrella or wear sunglasses, Go to work"
* "Draw a horizontal procedure: Open file, Read contents, Parse data, Save results"

## Instructions

Call the `run_js` tool with the following exact parameters:

- data: A JSON string with the following fields:
  - text: (required) A natural language description of a procedure. Steps can be separated by newlines, numbered items, or sentences. Lines containing "if", "whether", "decision", "check", or "?" are treated as decision points (diamond shapes).
  - orientation: Layout direction. Options: "vertical", "horizontal". Default: "vertical".
  - style: Visual style. Options: "simple", "detailed". Default: "simple".
