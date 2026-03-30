# Problem: Firebase Test Lab Robo Script — Can't Reliably Send Chat Message

## Context

We're testing the AI Edge Gallery Android app on Firebase Test Lab using Robo scripts. The app runs on-device LLMs (Gemma) and we need to: open Mobile Actions chat, type a prompt, send it, and capture the model's response.

**Device:** Pixel 6 (oriole), API 33, 1080x2400 resolution

## What Works

The Robo script successfully:
1. Launches app, scrolls to find "Mobile Actions"
2. Taps "Download" to download the 289MB model
3. Accepts "Gemma Terms of Use" dialog via POINT_TAP (670,1488)
4. Waits for model download (240s)
5. Taps "Try it" to enter chat
6. Switches keyboard from voice to text via POINT_TAP (97,2304)
7. Types text into the EditText field via VIEW_TEXT_CHANGED

## The Problem

After typing text, we cannot reliably tap the **Send button** (green circle with arrow icon, bottom-right of chat input).

### What We Tried (10 attempts)

| Approach | Result |
|----------|--------|
| `POINT_TAP (970, 2310)` | Missed — wrong coordinates |
| `POINT_TAP (1044, 2356)` | Missed — wrong coordinates |
| `visionText: "Send"` | No match — button is an icon, not text |
| `VIEW_CLICKED contentDescription='Send'` | No match — Compose UI |
| `\n` appended to VIEW_TEXT_CHANGED | Added literal newline, didn't send |
| `ADB_SHELL_COMMAND "input keyevent 66"` | **WORKED** — message sent, model responded with function call. BUT: terminates the Robo script, so subsequent TAKE_SCREENSHOT steps don't execute |

### The ADB_SHELL_COMMAND Issue

`ADB_SHELL_COMMAND` with `input keyevent 66` is the ONLY method that successfully sent the message. However, it appears to terminate the Robo script — any steps after it (WAIT, TAKE_SCREENSHOT) don't execute. The Robo auto-crawl takes over.

When we put ADB_SHELL_COMMAND as the last step, the test passes and Robo auto-crawl captures some useful screenshots, but we lose control of timing for capturing the model response.

## Files to Read

- `firebase/robo_scripts/test_mobile_actions.json` — current Robo script
- `firebase/ROBO_SCRIPT_REFERENCE.md` — Robo script event types and syntax
- `firebase/results/mobile_actions_findings.json` — detailed attempt log

## Questions

1. Is there a way to use `ADB_SHELL_COMMAND` without it terminating the script? Or a workaround?
2. Is there another Robo script event type that can tap a Compose UI button with contentDescription?
3. Could we use `ADB_SHELL_COMMAND` to both send AND capture screenshots (e.g., `input keyevent 66 && sleep 30 && screencap -p /sdcard/result.png`)?
4. Any other creative approach to send a message in a Compose-based chat UI via Robo scripts?

## Deliverable

Write your proposed solution or script changes to `firebase/CODEX_SOLUTION.md`. Include the rationale and any modified Robo script JSON.
