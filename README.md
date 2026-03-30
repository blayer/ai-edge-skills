# AI Edge Gallery Skills

30 JavaScript skills for the AI Edge Gallery. Each skill follows the standard spec: `SKILL.md` for metadata/instructions, `scripts/index.html` for the entry point, optional `assets/webview.html` for interactive webviews, and `testing/` for test resources.

## Skills

| # | Skill | Description | Return Type | Secrets |
|---|-------|-------------|-------------|---------|
| 1 | [word-frequency-analyzer](./word-frequency-analyzer/) | Analyze text for word frequency, display word cloud | webview | No |
| 2 | [regex-tester](./regex-tester/) | Test regex patterns with highlighted matches | webview | No |
| 3 | [lorem-ipsum-generator](./lorem-ipsum-generator/) | Generate placeholder text in various styles | text | No |
| 4 | [text-encoder-decoder](./text-encoder-decoder/) | Convert between Base64, URL, HTML, ROT13, Morse, binary | text | No |
| 5 | [readability-scorer](./readability-scorer/) | Flesch-Kincaid grade level and readability report | webview | No |
| 6 | [cron-expression-explainer](./cron-expression-explainer/) | Human-readable cron descriptions + next 10 runs | webview | No |
| 7 | [jwt-decoder](./jwt-decoder/) | Decode JWT header/payload, check expiration | webview | No |
| 8 | [uuid-generator](./uuid-generator/) | Generate UUID v4/v7 and ULIDs in bulk | text | No |
| 9 | [sql-formatter](./sql-formatter/) | Pretty-print SQL with syntax highlighting | webview | No |
| 10 | [http-status-reference](./http-status-reference/) | Status code lookup with descriptions and causes | text | No |
| 11 | [compound-interest-calculator](./compound-interest-calculator/) | Growth chart and amortization table | webview | No |
| 12 | [tip-calculator](./tip-calculator/) | Bill splitting with per-person breakdown | webview | No |
| 13 | [matrix-calculator](./matrix-calculator/) | Matrix operations rendered in grid | webview | No |
| 14 | [statistics-dashboard](./statistics-dashboard/) | Mean, median, mode, std dev + histogram | webview | No |
| 15 | [mermaid-diagram-renderer](./mermaid-diagram-renderer/) | Render Mermaid syntax as SVG | webview | No |
| 16 | [ascii-art-generator](./ascii-art-generator/) | Convert text to ASCII art using figlet-style fonts | text | No |
| 17 | [gradient-generator](./gradient-generator/) | CSS gradient preview + code | webview | No |
| 18 | [svg-icon-builder](./svg-icon-builder/) | Generate SVG icons, return as base64 image | image | No |
| 19 | [timezone-meeting-planner](./timezone-meeting-planner/) | Overlapping availability grid | webview | No |
| 20 | [pomodoro-timer](./pomodoro-timer/) | Interactive timer with progress ring | webview | No |
| 21 | [qr-code-generator](./qr-code-generator/) | Generate QR codes from text/URL, return base64 image | image | No |
| 22 | [password-generator](./password-generator/) | Secure passwords with configurable rules | text | No |
| 23 | [color-palette-explorer](./color-palette-explorer/) | Color swatches from mood description | webview | No |
| 24 | [unit-converter](./unit-converter/) | Convert between units | text | No |
| 25 | [qr-code-reader](./qr-code-reader/) | Camera-based QR scanner | webview | No |
| 26 | [json-csv-formatter](./json-csv-formatter/) | Format/convert JSON and CSV, render table | webview | No |
| 27 | [expense-splitter](./expense-splitter/) | Calculate optimal debt settlements | webview | No |
| 28 | [text-diff-viewer](./text-diff-viewer/) | Side-by-side diff with highlighting | webview | No |
| 29 | [flashcard-quiz](./flashcard-quiz/) | Interactive flashcard quiz | webview | No |
| 30 | [api-health-checker](./api-health-checker/) | Ping endpoints, show status dashboard | webview | Yes |

## Structure

Each skill follows this structure:

```
skill-name/
  SKILL.md              # Frontmatter (name, description) + Instructions
  scripts/
    index.html          # Entry point with ai_edge_gallery_get_result function
  assets/               # (webview skills only)
    webview.html        # Interactive webview content
  testing/
    test-input.json     # Test cases with inputs and expected outputs
```

## Return Types

- **text**: Returns `{result: "string"}` - plain text output
- **image**: Returns `{image: {base64: "data:image/..."}}` - base64-encoded image
- **webview**: Returns `{webview: {url: "webview.html?data=..."}}` - interactive HTML page

## Libraries

| Skill | Library | Source |
|-------|---------|--------|
| qr-code-generator | qrcode-generator v1.4.4 | Embedded inline |
| mermaid-diagram-renderer | mermaid.js v10 | CDN (ESM import) |
| qr-code-reader | jsQR v1.4.0 | CDN (ESM import) |

All other skills use vanilla JavaScript only.
