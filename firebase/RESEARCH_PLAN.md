# Research Plan: AI Edge Gallery Skill Testing via Firebase Test Lab

## Project Context

AI Edge Gallery is an Android app running on-device LLMs. We test JavaScript skills by sending prompts and observing whether the model correctly invokes the skill with the right parameters. All testing is done remotely via Firebase Test Lab using Robo scripts.

**App APK:** Downloaded from [google-ai-edge/gallery](https://github.com/google-ai-edge/gallery) releases.
**Model:** Any available on-device model (e.g., Gemma-3). The model choice is not the focus — the remote testing workflow is.

> **Note:** Gemma-4-2B-it is not bundled in the APK. Use whatever model is available in the app (Gemma-3 or similar). The research goal is proving the automated testing workflow, not evaluating a specific model.

---

## Autonomous Research Loop

```
[RESEARCH_PLAN.md]        -- program doc: research directions (human-written)
[firebase/robo_scripts/]   -- mutable: agent generates per-experiment JSON scripts
[gcloud CLI]              -- fixed harness: firebase test android run
[firebase/results/]       -- accumulator: structured JSON results per experiment
```

### Loop Protocol

```
1. PICK    — Select next experiment (skill + prompt set)
2. GENERATE — Create a Robo script JSON (type prompt, wait, screenshot)
3. RUN     — gcloud firebase test android run --type robo --robo-script <script>
4. CAPTURE — Download screenshots and logs from GCS bucket
5. EVALUATE — Analyze screenshots/logs for skill invocation and correctness
6. LOG     — Write findings to firebase/results/<experiment>.json
7. REPEAT
```

---

## Setup (One-Time)

### 1. GCP Project + Firebase Test Lab

```bash
gcloud projects create js-skill-research --name="JS Skill Research"
gcloud config set project js-skill-research
gcloud services enable testing.googleapis.com
gcloud services enable toolresults.googleapis.com
gcloud firebase test android models list   # verify available devices
```

### 2. Download APK

Download the latest release APK from https://github.com/google-ai-edge/gallery/releases.

### 3. Discover UI Element IDs

Run an initial unscripted Robo crawl to map the app's UI elements:

```bash
gcloud firebase test android run \
  --type robo \
  --app firebase/gallery.apk \
  --device model=oriole,version=33 \
  --timeout 120s
```

Review the crawl screenshots and sitemap in the Firebase console to identify resource IDs for:
- Chat input field
- Send button
- Skill selection UI
- Response/output area

Record these IDs in `firebase/ui_elements.json` for use in all subsequent scripts.

### 4. Baseline Robo Script

Once we have the element IDs, create a baseline script:

```json
[
  {"eventType": "WAIT", "delayTime": 5000},
  {"eventType": "VIEW_CLICKED", "elementDescriptors": [{"resourceId": "<chat_input_id>"}]},
  {"eventType": "VIEW_TEXT_CHANGED", "replacementText": "calculate compound interest for 5% over 10 years", "elementDescriptors": [{"resourceId": "<chat_input_id>"}]},
  {"eventType": "VIEW_CLICKED", "elementDescriptors": [{"resourceId": "<send_button_id>"}]},
  {"eventType": "WAIT", "delayTime": 15000},
  {"eventType": "TAKE_SCREENSHOT"}
]
```

Run it:

```bash
gcloud firebase test android run \
  --type robo \
  --app firebase/gallery.apk \
  --robo-script baseline.json \
  --device model=oriole,version=33 \
  --timeout 300s
```

---

## Research Topic 1: Replicate Local ADB Testing Flow on Firebase Test Lab

**Goal:** Research Firebase Test Lab and complete a remote test that achieves the same result as our current local ADB-based testing — send a prompt to the app, observe skill invocation, capture the response.

### Loop Protocol

```
1. RESEARCH — Read Firebase/Robo script docs (see Appendix)
2. TRY      — Write a script or run a command based on findings
3. RUN      — Execute on Firebase Test Lab
4. CHECK    — Did it work? Compare output to what local ADB test produces
5. FIX      — If failed, go back to Appendix, read more docs, adjust
6. LOG      — Record what worked/failed in firebase/results/
7. REPEAT   — Until remote test matches local test output
```

### Success Criteria

A remote test is complete when we can:
- [ ] Send a prompt to the Edge Gallery app on a remote device
- [ ] The on-device model invokes the correct JS skill
- [ ] We capture the skill output (screenshot or logs)
- [ ] The result matches what we get from the same prompt via local ADB

### Steps

1. **Set up GCP project and enable Firebase Test Lab**
2. **Download the APK** from gallery releases
3. **Run an unscripted Robo crawl** to discover UI element IDs
4. **Write a Robo script** that types a prompt and captures a screenshot
5. **Run the script on Firebase** and download results
6. **Compare** the remote result to a local ADB test of the same prompt
7. **Iterate** until the outputs match

---

## Research Topic 2: Validate All Skills via Remote Testing

**Prerequisite:** Topic 1 fully completed — we have a working remote test flow.

**Goal:** Run every production skill through the Firebase remote test flow and validate that each one invokes correctly.

### Steps

1. For each of the 16 production skills, generate prompt variants as Robo scripts
2. Run each script on Firebase Test Lab
3. Capture screenshots and logs per skill
4. Record invocation success/failure per skill
5. Compare results to local ADB baselines

### Deliverables

- Skill validation matrix: skill x pass/fail on remote
- List of skills that behave differently on remote vs local
- Any issues or gaps discovered

---

## File Structure

```
JS-Skill/
  RESEARCH_PLAN.md
  firebase/
    gallery.apk                 -- app APK from github releases
    ui_elements.json            -- discovered UI resource IDs
    robo_scripts/               -- generated Robo script JSONs per experiment
      baseline.json
      compound_interest_01.json
      dice_roller_01.json
      ...
    results/                    -- experiment results
      single_skill_compound_interest.json
      multi_skill_disambiguation.json
      ...
```

---

## CLI Reference

```bash
# Run a robo test with script
gcloud firebase test android run \
  --type robo \
  --app firebase/gallery.apk \
  --robo-script firebase/robo_scripts/experiment.json \
  --device model=oriole,version=33 \
  --timeout 300s

# List available devices
gcloud firebase test android models list

# Download test artifacts
gsutil -m cp -r gs://<bucket>/test-results/ ./firebase/results/
```

---

## Appendix: Resources

When stuck, come back here.

### Firebase Test Lab

- Firebase Test Lab overview: https://firebase.google.com/docs/test-lab
- gcloud CLI for Android testing: https://firebase.google.com/docs/test-lab/android/command-line
- gcloud firebase test reference: https://docs.cloud.google.com/sdk/gcloud/reference/firebase/test/android/run

### Robo Scripts

- Robo test overview: https://firebase.google.com/docs/test-lab/android/robo-ux-test
- Robo script JSON reference: https://firebase.google.com/docs/test-lab/android/robo-scripts-reference

### App Under Test

- AI Edge Gallery repo + APK releases: https://github.com/google-ai-edge/gallery
- AI Edge Gallery documentation: https://github.com/google-ai-edge/gallery/blob/main/README.md

### Autoresearch Inspiration

- karpathy/autoresearch: https://github.com/karpathy/autoresearch
