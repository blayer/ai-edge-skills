---
name: compound-interest-calculator
description: Calculate compound interest with growth chart and amortization table in webview.
---

# Compound Interest Calculator

Calculate compound interest with visual growth chart.

## Examples

* "Calculate compound interest on $10000 at 5% for 10 years"
* "How much will $5000 grow in 20 years at 7% interest with $200 monthly contribution"

## Instructions

Call the `run_js` tool with the following exact parameters:

- data: A JSON string with the following fields:
  - principal: Initial investment amount.
  - rate: Annual interest rate as percentage (e.g., 5 for 5%).
  - years: Number of years.
  - compound_frequency: Times compounded per year. Default: 12.
  - monthly_contribution: Additional monthly contribution. Default: 0.
