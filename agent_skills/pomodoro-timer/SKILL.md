---
name: pomodoro-timer
description: Interactive Pomodoro timer with progress ring and session tracking in webview.
---

# Pomodoro Timer

Interactive Pomodoro timer with visual progress.

## Examples

* "Start a pomodoro timer"
* "Set a 10 minute focus timer for writing report"

## Instructions

Call the `run_js` tool with the following exact parameters:

- data: A JSON string with the following fields:
  - work_minutes: Duration of work session. Default: 25.
  - break_minutes: Duration of break. Default: 5.
  - long_break_minutes: Duration of long break (every 4 sessions). Default: 15.
  - task: Optional task description.
  - callback_skill: (Optional) Name of another skill to invoke when the timer completes. When set, after the timer finishes you should call the specified skill with the callback_data.
  - callback_data: (Optional) JSON data to pass to the callback skill when triggered.
