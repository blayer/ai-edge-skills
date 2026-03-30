---
name: burnout-predictor
description: Text sentiment analysis for stress and burnout indicators with tracking and trend reporting.
---

# Burnout Predictor

Analyze text for stress indicators and track burnout risk over time.

## Examples

* "Analyze my journal entry for stress levels"
* "Track my daily mood entry"
* "Show my burnout trend report"

## Instructions

Call the `run_js` tool with the following exact parameters:

- data: A JSON string with the following fields:
  - action: One of "analyze", "track", "report". Required.
  - text: The message or journal text to analyze. Required for analyze/track.
  - date: Date string for the entry (e.g. "2026-03-22"). Used for track.
  - game_state: Object holding tracked entries over time. Default: {}.
