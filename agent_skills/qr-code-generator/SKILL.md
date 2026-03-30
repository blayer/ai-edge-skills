---
name: qr-code-generator
description: Generate QR codes from text or URL input, returned as a base64-encoded PNG image.
---

# QR Code Generator

Generate a QR code image from text or URL.

## Examples

* "Generate a QR code for https://example.com"
* "Create QR code for my WiFi password"

## Instructions

Call the `run_js` tool with the following exact parameters:

- data: A JSON string with the following fields:
  - text: The text or URL to encode in the QR code.
  - size: The size of the QR code in pixels. Default: 256.
