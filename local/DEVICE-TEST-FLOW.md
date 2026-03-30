# Device Test Flow — XML-Based (Device-Independent)

Verified working on:
- Pixel 7 Pro (2A241FDH30069Z) — 1080x2340, density 420
- Samsung Galaxy S25/S26 Ultra (R3GL101HFPR / SM-S948U1) — 1080x2340, density 450

## Prerequisites
- ADB installed, device(s) connected and authorized
- Edge Gallery dev app installed (`com.google.ai.edge.gallery.dev`)
- Gemma-4-2B-it model downloaded in the app

## Key Differences Between Devices

| Step | Pixel 7 Pro | Samsung S25/S26 Ultra |
|------|-------------|----------------------|
| Folder permission button | `"Allow"` (mixed case) | `"ALLOW"` (all caps) |
| Cancel button | `"Cancel"` | `"CANCEL"` |
| Use this folder | `"Use this folder"` | `"USE THIS FOLDER"` |
| Add/Close buttons | `content-desc` (not text) | `content-desc` (not text) |
| Pick file button | `content-desc="Pick file"` | `content-desc="Pick file"` |

## Working Flow (All Steps XML-Based)

All element finding uses `uiautomator dump` → parse XML → find by `text` or `content-desc`.

### Step 1: Push Skill to Device
```bash
ADB="adb -s <serial>"
$ADB shell rm -rf "/sdcard/Download/$SKILL_NAME"
$ADB shell mkdir -p "/sdcard/Download/$SKILL_NAME"
$ADB push "$SKILL_PATH/SKILL.md" "/sdcard/Download/$SKILL_NAME/SKILL.md"
$ADB push "$SKILL_PATH/scripts" "/sdcard/Download/$SKILL_NAME/scripts"
# Only push assets/ if it exists (webview skills)
$ADB push "$SKILL_PATH/assets" "/sdcard/Download/$SKILL_NAME/assets"  # optional
```
**Important:** Do NOT push `testing/` folder — it confuses the file picker and is not needed on device.

### Step 2: Launch App & Navigate to Chat
```
1. Force stop app
2. Launch: am start --activity-clear-task -n com.google.ai.edge.gallery.dev/...MainActivity
3. Wait 3s
4. Find & tap "Experimental" (text)
5. Wait 2s
6. Find & tap element containing "Agent Chat" (text)
7. Wait 3s
8. Find & tap "Try it" (text)
9. Wait 4s
10. Verify "Type prompt" or "Prompt input" visible
```

### Step 3: Dismiss Intro Overlay
The "Introducing Agent Skills" overlay appears on first launch. Must dismiss before sending prompts.
```
1. Find & tap "Type prompt…" or "Prompt input" (text)
2. Wait 1s
3. Verify intro is dismissed (check "Introducing" no longer in XML)
```

### Step 4: Import Skill
```
1. Find & tap "Skills" (text) → opens skills panel
2. Wait 1.5s
3. Find & tap "Add" (content-desc, NOT text) → opens add menu
4. Wait 1.5s
5. Find & tap "Import local skill" (text) → opens import dialog
6. Wait 2s
7. Find & tap "Pick file" (content-desc, NOT text) → opens file picker
8. Wait 2s
```

### Step 5: Navigate File Picker
```
1. Check if already in skill folder: look for "Files in <skill-name>"
2. If not, find & tap "Download" (text), then find & tap "<skill-name>" (text)
3. Find & tap "Use this folder" OR "USE THIS FOLDER" (case-insensitive search)
4. Wait 1.5s
```

### Step 6: Handle Permission Dialog
```
1. Check for "Allow Edge Gallery" in XML
2. Find element with EXACT text "Allow" or "ALLOW" (avoid matching "Allow access for...")
3. Tap it
4. Wait 1.5s
```

### Step 7: Confirm Import
```
1. Find & tap "Add" (text) on the import confirmation dialog
2. Wait 2s
3. If "Replace existing skill" dialog appears → find & tap "Replace" (text)
4. Wait 1.5s
```

### Step 8: Enable Skill Toggle
```
1. Find & tap "Deselect all" (text) → disables all skills
2. Scroll through skills list to find target skill name (text)
3. Find nearest checkable toggle by Y-coordinate proximity (within 100px)
4. Tap the toggle
5. Find & tap "Close" (content-desc) → closes skills panel
```

### Step 9: Send Test Prompt
```
1. Find & tap "Type prompt…" (text) to focus input
2. Input text via: adb shell input text "prompt%stext%shere"
3. Find & tap "Send prompt" (content-desc) or press Enter (keyevent 66)
```

### Step 10: Verify Result
```
1. Poll XML every 3s for up to 60s looking for "Called JS script"
2. If found → PASS (skill was invoked)
3. If timeout → FAIL (model answered without using skill)
```

## Element Finding Strategy

```python
# Primary: exact match on text or content-desc
for node in tree.iter('node'):
    if node.get('text', '') == target or node.get('content-desc', '') == target:
        # extract center from bounds

# Fallback: case-insensitive contains
for node in tree.iter('node'):
    if target.lower() in node.get('text', '').lower():
        # extract center from bounds

# Toggle finding: Y-proximity to skill name
for node in nodes:
    if node.get('checkable', '') == 'true':
        # find closest to skill_y within 100px
```

## Per-Device UI Dump File
When running parallel tests, use per-device temp files to avoid conflicts:
```bash
UI_XML="/tmp/ui_${DEVICE_SERIAL}.xml"
```

## Common Gotchas
1. **"Add" and "Close" buttons** use `content-desc`, not `text` — `find_element` must check both
2. **"Pick file" button** also uses `content-desc`
3. **Permission dialog** text differs: "Allow" (Pixel) vs "ALLOW" (Samsung) — match both
4. **"Use this folder"** text differs: mixed case (Pixel) vs ALL CAPS (Samsung) — case-insensitive match
5. **Intro overlay** blocks prompt sending — must dismiss first
6. **Don't push testing/ folder** — confuses file picker navigation
7. **Timing matters** — dump UI *after* adequate sleep to ensure elements are rendered
8. **Skills panel scrolling** — target skill may not be visible, need to scroll and re-dump
