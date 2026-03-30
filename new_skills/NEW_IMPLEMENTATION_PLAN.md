# Plan: Implement NEW_SKILL_IDEAS.md as JS Skills

## Context
The `NEW_SKILL_IDEAS.md` file contains ~50 skill ideas across themes like Survival, Creative, Educational, Utilities, etc. We need to implement these as JS skills following the existing project patterns in `/Users/chazhao/MyProject/JS-Skill/`.

## Existing Skill Pattern (must follow)

Each skill requires:
```
new_skills/<skill-name>/
├── SKILL.md                    # YAML frontmatter (name, description) + instructions
├── scripts/
│   ├── index.html              # Minimal boilerplate entry point
│   └── index.js                # Exports window['ai_edge_gallery_get_result']
├── assets/
│   └── webview.html            # (Optional) For interactive UI skills
└── testing/
    └── test-input.json         # Test cases
```

**Three return types:**
- Text: `{ result: "string" }`
- Image: `{ image: { base64: "data:image/svg+xml;base64,..." } }`
- Webview: `{ webview: { url: "webview.html?data=..." } }`

**Constraints:** Vanilla JS only (no npm deps in skills), self-contained, runs in JSDOM/browser.

---

## Skill Implementation Tiers

### Tier 1: Immediately Implementable (Pure JS, no device APIs needed)
These can be built now with text/image/webview output.

| # | Skill Name | Dir Name | Type | Description |
|---|-----------|----------|------|-------------|
| 1 | Astrology Finder | `astrology-finder` | Text | Calculate sun/moon signs from birth date/time/location |
| 2 | Educational Flashcards | `educational-flashcards` | Webview | Create/study flashcard decks offline |
| 3 | Generation Dictionary | `generation-dictionary` | Text | Translate phrases between generational slang |
| 4 | Dialect Dictionary | `dialect-dictionary` | Text | Translate/teach dying languages and dialects |
| 5 | Cliff Notes / Summarizer | `text-summarizer` | Text | Summarize long text input |
| 6 | Theme Guessing / Trivia | `trivia-game` | Webview | Trivia game with model as host, stateful rounds |
| 7 | Guess My MBTI | `mbti-guesser` | Webview | MBTI quiz with personality analysis |
| 8 | Procedure Visualizer | `procedure-visualizer` | Image (SVG) | Convert natural language procedures to flowcharts |
| 9 | Smart Scanner (OCR format) | `smart-scanner` | Text | Parse text input preserving hierarchy/formatting |
| 10 | Expense Tracker / Pantry Map | `smart-pantry` | Webview | Track grocery items, suggest no-shop recipes |
| 11 | Symptom Tracker | `symptom-tracker` | Webview | Log symptoms over time, generate doctor-visit summaries |
| 12 | Palette Maker | `palette-maker` | Image/Webview | Extract colors from hex inputs, generate palettes |
| 13 | Wardrobe Mixology | `wardrobe-planner` | Webview | Plan outfits based on wardrobe items + weather |
| 14 | Mentorship Sync / Tone Analyzer | `tone-analyzer` | Text | Analyze text for hidden bias or tone issues |
| 15 | Text Refine: Tone Match | `tone-matcher` | Text | Rewrite text matching a given tone/style |
| 16 | Social Event Story Generator | `story-spark` | Text | Generate fun historical facts/stories based on date |
| 17 | Narrative Spark | `narrative-spark` | Text | Historical sensory details based on location input |
| 18 | Compound Interest (exists) | — | — | Already implemented |
| 19 | Movement Game | `movement-game` | Webview | Trivia that tracks step count to unlock answers |
| 20 | Gesture Game (Heads Up) | `gesture-game` | Webview | Tilt-based party game using device motion API |
| 21 | Mahjong Card Finder | `mahjong-cards` | Webview | American mahjong cards by year |
| 22 | Hiking Companion | `hiking-companion` | Text | Camping/hiking tips, plant identification from description |
| 23 | Camping Companion | `camping-companion` | Text | Camping tips, how-to guides |
| 24 | Explain Expert Content | `expert-translator` | Text | Simplify jargon-heavy text to plain language |
| 25 | Video to GIF | `video-to-gif` | Text | (Limited) Convert video frames description to animated SVG |
| 26 | Storybook Reader | `storybook-reader` | Text | Read/narrate public domain stories |

### Tier 2: Requires Device APIs (camera, GPS, sensors, audio)
These need native device integration beyond pure JS. Can build UI/logic scaffolding but full functionality depends on device APIs.

| # | Skill Name | Dir Name | Needed API |
|---|-----------|----------|------------|
| 27 | Allergy Advisor | `allergy-advisor` | GPS/location |
| 28 | Person Locator | `person-locator` | GPS, networking |
| 29 | Walkie Talkie | `walkie-talkie` | Audio, P2P networking |
| 30 | Signal Detector | `signal-detector` | Bluetooth/proximity |
| 31 | Sound Mapping | `sound-mapper` | Microphone, GPS |
| 32 | Artistic Map | `artistic-map` | Camera |
| 33 | Time-Travel AR | `time-travel-ar` | Camera, GPS, AR |
| 34 | Smart Routing | `smart-routing` | GPS, maps data |
| 35 | Visual Interpreter | `visual-interpreter` | Camera |
| 36 | Social Cue Detector | `social-cue` | Microphone |
| 37 | Nail Color Picker | `nail-color-picker` | Camera, AR |
| 38 | Home Color Picker | `home-color-picker` | Camera, AR |
| 39 | AR with LEGO | `ar-lego` | Camera, AR |
| 40 | Offline Security Camera | `security-camera` | Camera, storage |
| 41 | Image Collage / AR Furniture | `image-collage` | Camera |
| 42 | Animate Image | `animate-image` | Image processing |
| 43 | Restore Image | `restore-image` | ML model |
| 44 | Estimate Measure from Camera | `ar-measure` | Camera, AR |
| 45 | Personalized Photo Editing | `photo-recipes` | Camera, ML |
| 46 | Cross-Device Sound Monitor | `sound-monitor` | Audio, IoT |
| 47 | Burnout Prediction | `burnout-predictor` | Sentiment analysis |
| 48 | Package Delivery Alert | `package-alert` | Email/SMS access |
| 49 | Choose Your Voice Actor | `voice-actor` | TTS/Audio |
| 50 | Lyria Music Generation | `music-generator` | Audio output |

---

## Implementation Order (Tier 1)

### Phase 1: Quick Wins — Text Skills
1. `astrology-finder` — Date math, zodiac lookup tables
2. `generation-dictionary` — Slang lookup/translation
3. `story-spark` — Historical facts by date
4. `tone-analyzer` — Text analysis for bias/tone
5. `tone-matcher` — Rewrite text in matched tone
6. `expert-translator` — Simplify jargon
7. `hiking-companion` — Tips and info database
8. `camping-companion` — Tips and info database
9. `narrative-spark` — Location-based historical details
10. `storybook-reader` — Public domain story narration

### Phase 2: Webview Interactive Skills
11. `educational-flashcards` — Card deck UI with flip animations
12. `trivia-game` — Stateful Q&A with scoring
13. `mbti-guesser` — Quiz flow with result analysis
14. `smart-pantry` — Receipt parsing + recipe suggestions
15. `symptom-tracker` — Log entries + summary generation
16. `wardrobe-planner` — Outfit planning UI
17. `movement-game` — Step-gated trivia
18. `gesture-game` — Device motion party game
19. `mahjong-cards` — Card display by year

### Phase 3: Image/SVG Skills
20. `procedure-visualizer` — SVG flowchart generation
21. `palette-maker` — Color extraction + palette SVG

### Phase 4: Tier 2 Scaffolding
22-50. Build UI and logic scaffolding for device-dependent skills, with clear TODOs for native API integration.

---

## Per-Skill Implementation Checklist

For each skill:
- [ ] Create `new_skills/<name>/SKILL.md` with frontmatter + instructions
- [ ] Create `new_skills/<name>/scripts/index.html` (boilerplate)
- [ ] Create `new_skills/<name>/scripts/index.js` (main logic)
- [ ] Create `new_skills/<name>/assets/webview.html` (if webview type)
- [ ] Create `new_skills/<name>/testing/test-input.json` (2-3 test cases)
- [ ] Run `node run-tests.js` to verify
- [ ] Update `README.md` skill table

## Verification
- Run `node run-tests.js` after each skill to ensure tests pass
- Verify webview skills render correctly in browser
- Check all SKILL.md frontmatter parses correctly
