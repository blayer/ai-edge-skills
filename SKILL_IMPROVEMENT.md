# Skill Improvement Log

## Feature Requests

- **pomodoro-timer**: the timer is used to trigger another skill. For example, set a timer for 2 mins and call skill send-sms to 8143214896 with a message "call me back at 5pm".
- **svg-icon-builder**: You need to add the generated image in the chat as a webview embeded.
- **timezone-meeting-planner**: we need to modify the test case: I live in SF, and my mom live in Beijing. My time is 7pm to 11pm. My mom available time is from 8am to 8pm. Find the best overlap time to call her for at least 30 mins. Visualize the time slot as a webview.
- **all games skills**: 1. we need to create a webview ui for all games. 2. games need to record the state such as hangman, skill need to remember/store the users guess and update ui. 3. the test need to be a full session test as a full game. for example, hangman game, guessed word is `good`. user/test should guess, `o` -> `e` -> `c` -> `d` ->`g` to win the game. And the game/sklill should ui to reflect the state and memory all guess word. Also allow user to restart a new game in the chat.

---

## Improvement Plan

### Phase 1: Test Runner — Multi-Round Support

Current test runners only handle single-call (`input`) and batch (`input_batch`) tests. Game tests need a `rounds` array where each round passes `game_state` from the previous result.

**Files to modify:**
- `run-tests.js` — Add `rounds` handling: execute round 1, extract `game_state`, merge into round 2 input, repeat. Assert per-round with `expected_contains`.
- `run-scenario-tests.js` — Same `rounds` support for Puppeteer.

### Phase 2: Enhanced Test Coverage for All Utility Skills

Add more test cases to all 12 non-game skills (3-6 tests each).

| Skill | Current | New | Key Additions |
|-------|:---:|:---:|---|
| color-palette-explorer | 1 | 5 | Multiple moods, base_color, unknown mood fallback |
| compound-interest-calculator | 2 | 5 | Zero rate, high rate, large principal |
| dice-roller | 1 | 7 | Modifier, advantage/disadvantage, d100 |
| expense-splitter | 1 | 4 | Equal split, single payer, many expenses |
| matrix-calculator | 3 | 5 | Add operation, 3x3 determinant |
| mermaid-diagram-renderer | 1 | 4 | Sequence, pie, class diagrams |
| password-generator | 1 | 6 | Numbers-only, no-ambiguous, batch, short |
| play-24-game | 1 | 5 | 8,8,8,8 / impossible 1,1,1,1 / fractions |
| pomodoro-timer | 1 | 4 | Custom duration, with task, with callback |
| qr-code-generator | 1 | 5 | Plain text, custom size, long text, special chars |
| svg-icon-builder | 1 | 5 | Star, heart, gear+background, all-shapes batch |
| timezone-meeting-planner | 1 | 4 | SF/Beijing custom availability, no overlap, same tz |

### Phase 3: Specific Feature Improvements

#### 3.1 SVG Icon Builder — Webview Embedded Display
- `skills/svg-icon-builder/scripts/index.js` — Change return from `{image: {base64}}` to `{webview: {url: "webview.html?data=..."}}`. Pass generated SVG markup + metadata as data.
- `skills/svg-icon-builder/assets/webview.html` — Create. Dark theme, centered SVG display, shape/color/size info panel.
- `skills/svg-icon-builder/SKILL.md` — Update return type description.

#### 3.2 Timezone Meeting Planner — Per-Person Availability
- `skills/timezone-meeting-planner/assets/webview.html` — Add support for `available_start`/`available_end` per timezone entry and `min_duration` parameter. Highlight best overlap slot.
- `skills/timezone-meeting-planner/SKILL.md` — Add new parameters to instructions.

#### 3.3 Pomodoro Timer — Skill Chaining
- `skills/pomodoro-timer/SKILL.md` — Add `callback_skill` and `callback_data` parameters. Instruct the LLM to invoke the callback skill when the timer completes.
- `skills/pomodoro-timer/scripts/index.js` — Pass callback info to webview.
- `skills/pomodoro-timer/assets/webview.html` — Display callback info on timer completion ("Timer done! Next: send-sms...").

### Phase 4: Game Skills — Webview UI + State + Full Session Tests

Each game skill (blackjack, hangman, mastermind, number-guessing) gets:

1. **`scripts/index.js`** — Keep game logic, change return to include `webview` alongside `game_state`. Add `seed_word`/`seed_number`/`seed_code` param for deterministic testing.
2. **`assets/webview.html`** — Create with dark theme:
   - **blackjack**: Card faces, dealer/player hands, score, game outcome
   - **hangman**: SVG hangman figure, word blanks, letter keyboard (green=correct, red=wrong), attempts counter
   - **mastermind**: Color circles, exact/misplaced pegs, guess history board
   - **number-guessing**: Number line with range narrowing, guess history with arrows, attempts counter
3. **`SKILL.md`** — Update return type, add restart instructions.
4. **`testing/test-input.json`** — Full session tests using `rounds` format.

#### Hangman Example Test (per request)
- Start with seed_word "good"
- Guess: `o` (correct) → `e` (wrong) → `c` (wrong) → `d` (correct) → `g` (correct) → win
- Additional: lose game, duplicate guess, restart after win

#### Blackjack Example Tests
- Add webview to display card. 
- agent is host, user is player. 
- player ask cards. check or more. 
- do this until game ends. 
- write a test input.

#### Mastermind Example Tests
- Start with seed_code → 3 guesses → win
- Wrong guess count error

#### Number Guessing Example Tests
- Start with seed_number 42
- user guess, agent response
- user guess again and repeat until user get the number 42. 
- write a input refelct above. 

---

## Execution Order

1. **Phase 1** — Test runner multi-round support (prerequisite for game tests)
2. **Phase 2** — Enhanced test coverage (low risk, immediate value)
3. **Phase 3** — Feature improvements (independent items)
4. **Phase 4** — Game webview UIs (largest effort, depends on Phase 1)

## Verification

1. `node run-tests.js` — after each phase
2. `node run-scenario-tests.js` — Puppeteer-based verification
3. `./run-skill-recording.sh <skill-name>` — on-device recording for changed skills
