# New Skills — Test Plan

8 new skills tested on Pixel 7 Pro and Samsung S26 with Gemma-4-2B-it.

## Test Results

**8 passed, 0 failed** — all skills triggered "Called JS script" and produced correct output.

| # | Skill | Description | Test Prompt | Tests | Recording |
|---|-------|-------------|------------|:-----:|:---------:|
| 1 | allergy-advisor | Allergy, skin care, and hair care advisory by city/season | What allergens should I watch for in New York this spring? | 6 | PASS (21M) |
| 2 | burnout-predictor | Text sentiment analysis for stress and burnout indicators | Analyze my journal entry for stress levels | 6 | PASS (13M) |
| 3 | camping-companion | Comprehensive camping guide: tent, fire, knots, cooking, wildlife | How do I pitch a dome tent? | 16 | PASS (18M) |
| 4 | gesture-game | Heads-up style gesture guessing game with device tilt | Start a gesture game | 4 | PASS (14M) |
| 5 | hiking-companion | Plant ID, weather guidance, first aid, trail safety | What plant did I just touch? It has three shiny leaves | 12 | PASS (20M) |
| 6 | palette-maker | Color palettes from base color using color theory (SVG webview) | Create a complementary palette from #FF5733 | 5 | PASS (16M) |
| 7 | procedure-visualizer | SVG flowcharts from natural language procedures (webview) | Visualize: 1. Start server 2. Check database 3. Load config 4. Begin | 4 | PASS (20M) |
| 8 | smart-pantry | Track pantry items and get recipe suggestions | Add eggs, milk, and butter to my pantry | 4 | PASS (18M) |

## Test Process

### Per-Skill Test Flow (`run-skill-recording.sh -s <serial> <skill-name>`)
1. Fresh app launch, navigate to Agent Chat
2. Import skill if not installed, deselect all, enable only target skill
3. Start screen recording
4. Send example prompt 1, wait for "Called JS script"
5. Send example prompt 2, wait for "Called JS script"
6. Stop recording, save to `recording/<skill-name>/recording.mp4`

### Pass Criteria
- Model triggers the JS skill (UI shows "Called JS script")
- Skill produces a response (text, image, or webview)

### Commands
```bash
# Test single skill
./run-skill-recording.sh -s <device_serial> <skill-name>

# Unit tests (JSDOM)
node run-tests.js
```

## Skill Output Types

| Type | Skills |
|------|--------|
| Text | allergy-advisor, burnout-predictor, camping-companion, hiking-companion |
| Webview | gesture-game, palette-maker, procedure-visualizer, smart-pantry |
