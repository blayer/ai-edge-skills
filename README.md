# AI Edge Gallery — Blackjack Skill

A Blackjack game skill for the [AI Edge Gallery](https://github.com/google-ai-edge/gallery) app. Includes two variants: a text-based version and a visual version with card graphics.

## Project Structure

```
agent_skills/
  blackjack/              # Text-based blackjack
  blackjack_visual/       # Visual blackjack with card graphics
    SKILL.md              # Skill metadata and LLM instructions
    scripts/
      index.js            # Game logic (run_js entry point)
    assets/
      webview.html        # Visual card display (visual variant)
    testing/
      test-input.json     # Multi-round test cases
local/                    # Local testing scripts (ADB + Node.js)
firebase/                 # Firebase Test Lab setup and scripts
```

## Prerequisites

- Node.js (for local JS tests)
- Android device + ADB (for on-device tests)
- Google Cloud SDK (for Firebase Test Lab)

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Run local JS tests

```bash
cd local
node run-tests.js
```

This runs the test cases from each skill's `testing/test-input.json` using JSDOM.

### 3. Run on a connected Android device

Make sure ADB is connected and the AI Edge Gallery app is installed:

```bash
# Test a skill on-device
./local/run-device-test.sh -s ../agent_skills blackjack
```

### 4. Run on Firebase Test Lab

First, set up Firebase access (one-time):

```bash
# Download the latest APK
./firebase/download-apk.sh

# Authenticate and set project
gcloud auth login
gcloud config set project <your-project-id>
```

See [firebase/SETUP.md](firebase/SETUP.md) for full setup instructions, credentials, and test commands.

## Skill Details

Each skill accepts JSON input via the `run_js` tool:

| Action | Input | Description |
|--------|-------|-------------|
| `deal` | `{"action": "deal"}` | Start a new game |
| `hit` | `{"action": "hit", "player_cards": [...], "dealer_visible": "...", "dealer_hidden": "..."}` | Draw a card |
| `stand` | `{"action": "stand", "player_cards": [...], "dealer_visible": "...", "dealer_hidden": "..."}` | End your turn |

See each skill's `SKILL.md` for full instructions.
