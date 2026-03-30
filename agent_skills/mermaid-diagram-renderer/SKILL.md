---
name: mermaid-diagram-renderer
description: Render Mermaid diagram syntax as SVG in webview.
---

# Mermaid Diagram Renderer

Render Mermaid diagram syntax as interactive SVG.

## Examples

* "Render this mermaid flowchart"
* "Draw a sequence diagram"

## Instructions

Call the `run_js` tool with the following exact parameters:

- data: A JSON string with the following fields:
  - code: The Mermaid diagram syntax string.
  - theme: Optional theme. Options: "default", "dark", "forest", "neutral". Default: "default".
