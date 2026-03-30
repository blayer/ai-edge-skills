#!/bin/bash
# Edge Gallery On-Device Skill Scenario Test
# Usage: ./run-device-test.sh [-d <device-serial>] [-s <skills-dir>] <skill-name>
# Example: ./run-device-test.sh uuid-generator "Generate 5 UUIDs"
# Example: ./run-device-test.sh -d 2A241FDH30069Z -s new_skills astrology-finder
#
# Options:
#   -d <serial>     Target a specific device (from `adb devices`). Required when
#                   multiple devices are connected. Omit to use the default device.
#   -s <skills-dir> Skills directory name relative to project root.
#                   Default: "skills". Use "new_skills" for new skills.
#
# Flow:
#   1. Baseline: fresh app, no skill, send prompt → screenshot disabled.png
#   2. Install skill, send prompt → screenshot enabled.png
#   3. Compare baseline vs enabled output
#
# Test prompts are read from TEST-PLAN.md

# No set -e: ui_has uses grep which returns 1 on no match

# =============================================
# Parse options
# =============================================
DEVICE_SERIAL=""
SKILLS_SUBDIR="skills"

while getopts "d:s:" opt; do
  case $opt in
    d) DEVICE_SERIAL="$OPTARG" ;;
    s) SKILLS_SUBDIR="$OPTARG" ;;
    *) echo "Usage: $0 [-d <device-serial>] [-s <skills-dir>] <skill-name>"; exit 1 ;;
  esac
done
shift $((OPTIND - 1))

SKILL_NAME="${1:?Usage: ./run-device-test.sh [-d <device-serial>] [-s <skills-dir>] <skill-name>}"

# Build ADB command with optional device targeting
if [ -n "$DEVICE_SERIAL" ]; then
  ADB="adb -s $DEVICE_SERIAL"
else
  ADB="adb"
fi

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SKILLS_DIR="$SCRIPT_DIR/$SKILLS_SUBDIR"
SCREENSHOTS_DIR="$SCRIPT_DIR/screenshots"
TEST_PLAN="$SCRIPT_DIR/TEST-PLAN.md"
SKILL_PATH="$SKILLS_DIR/$SKILL_NAME"

# Per-device temp file to avoid conflicts during parallel runs
UI_DUMP_FILE="/tmp/ui_${DEVICE_SERIAL:-default}.xml"

if [ ! -d "$SKILL_PATH" ]; then
  echo "ERROR: Skill '$SKILL_NAME' not found in $SKILLS_DIR"
  exit 1
fi

# Load test prompt from TEST-PLAN.md table row matching skill name
PROMPT1=$(python3 -c "
import re
with open('$TEST_PLAN') as f:
    for line in f:
        line = line.strip()
        if '| $SKILL_NAME |' in line:
            cols = [c.strip() for c in line.split('|')]
            # cols: ['', '#', 'Skill', 'Test Prompt', 'Passed', 'Notes', '']
            if len(cols) >= 5:
                prompt = cols[3]
                if prompt and prompt.lower() != 'test prompt':
                    print(prompt)
            break
")

if [ -z "$PROMPT1" ]; then
  echo "ERROR: No test prompt found for '$SKILL_NAME' in TEST-PLAN.md"
  exit 1
fi

echo "Prompt: \"$PROMPT1\""

# =============================================
# Device-specific coordinates
# =============================================
# Auto-detect device model and load matching coordinate profile.
# Each device may have different UI element positions due to density,
# navigation bar, status bar, etc.

DEVICE_MODEL=$($ADB shell getprop ro.product.model 2>/dev/null | tr -d '\r')
echo "Device model: $DEVICE_MODEL"

load_pixel7pro_coords() {
  # Pixel 7 Pro (1080x2340, density 420)
  TAP_EXPERIMENTAL_TAB="419 1053"
  TAP_AGENT_CHAT="540 1320"
  TAP_TRY_IT="582 1857"
  TAP_SKILLS_BTN="174 2183"
  TAP_PROMPT_INPUT="524 2057"
  TAP_SEND_BTN="979 1199"
  TAP_GO_BACK="75 193"
  TAP_ADD_BTN="964 477"
  TAP_CLOSE_SKILLS="967 299"
  TAP_IMPORT_LOCAL="314 1930"
  TAP_PICK_FILE="844 1229"
  TAP_ADD_CONFIRM="809 1418"
  TAP_USE_FOLDER="540 2214"
  TAP_ALLOW="884 1360"
  TAP_DELETE_CONFIRM="763 1313"
  TAP_RESET_SESSION="1015 193"
}

load_samsung_s25ultra_coords() {
  # Samsung Galaxy S25/S26 Ultra SM-S948U1 (1080x2340, density 450)
  TAP_EXPERIMENTAL_TAB="450 1095"
  TAP_AGENT_CHAT="540 1383"
  TAP_TRY_IT="586 1989"
  TAP_SKILLS_BTN="214 2104"
  TAP_PROMPT_INPUT="523 1968"
  TAP_SEND_BTN="979 1199"
  TAP_GO_BACK="79 195"
  TAP_ADD_BTN="956 501"
  TAP_CLOSE_SKILLS="960 309"
  TAP_IMPORT_LOCAL="335 1832"
  TAP_PICK_FILE="867 1195"
  TAP_ADD_CONFIRM="828 1397"
  TAP_USE_FOLDER="540 2137"
  TAP_ALLOW="895 2097"
  TAP_DELETE_CONFIRM="459 2082"
  TAP_RESET_SESSION="1011 196"
}

# Match device model to coordinate profile
case "$DEVICE_MODEL" in
  *Pixel*7*Pro*|*cheetah*)
    echo "Using Pixel 7 Pro coordinate profile"
    load_pixel7pro_coords
    ;;
  *SM-S948*|*SM-S928*|*SM-S926*|*SM-S924*|*SM-S92*)
    echo "Using Samsung S25 Ultra coordinate profile"
    load_samsung_s25ultra_coords
    ;;
  *)
    echo "WARNING: Unknown device model '$DEVICE_MODEL'. Defaulting to Pixel 7 Pro coords."
    echo "You may need to add a coordinate profile for this device."
    load_pixel7pro_coords
    ;;
esac

# =============================================
# Helpers (all use $ADB and $UI_DUMP_FILE for multi-device support)
# =============================================
tap() { $ADB shell input tap $1 $2; }

type_text() {
  local encoded=$(echo "$1" | sed 's/ /%s/g; s/(/\\(/g; s/)/\\)/g; s/&/\\&/g; s/;/\\;/g; s/|/\\|/g; s/</\\</g; s/>/\\>/g; s/"/\\"/g; s/'"'"'/\\'"'"'/g; s/#/\\#/g; s/\$/\\$/g')
  $ADB shell input text "$encoded"
}

dump_ui() {
  $ADB shell uiautomator dump /data/local/tmp/ui.xml >/dev/null 2>&1
  $ADB pull /data/local/tmp/ui.xml "$UI_DUMP_FILE" >/dev/null 2>&1
}

ui_has() { grep -q "$1" "$UI_DUMP_FILE" 2>/dev/null; }

ui_text() {
  python3 -c "
import xml.etree.ElementTree as ET
tree = ET.parse('$UI_DUMP_FILE')
for node in tree.iter('node'):
    t = node.get('text', '')
    if t and len(t) > 5: print(t[:500])
"
}

ui_find_bounds() {
  python3 -c "
import xml.etree.ElementTree as ET, re
tree = ET.parse('$UI_DUMP_FILE')
for node in tree.iter('node'):
    if node.get('text', '') == '$1' or node.get('content-desc', '') == '$1':
        m = re.findall(r'\d+', node.get('bounds', ''))
        if m:
            print(f'{(int(m[0])+int(m[2]))//2} {(int(m[1])+int(m[3]))//2}')
            break
"
}

scroll_down() { $ADB shell input swipe 540 1800 540 1000 200; }

poll_ui() {
  local pattern="$1" timeout_s="${2:-60}" interval="${3:-3}" elapsed=0
  while [ $elapsed -lt $timeout_s ]; do
    dump_ui
    if ui_has "$pattern"; then return 0; fi
    sleep "$interval"
    elapsed=$((elapsed + interval))
  done
  return 1
}

find_skill_delete_btn() {
  python3 -c "
import xml.etree.ElementTree as ET, re
tree = ET.parse('$UI_DUMP_FILE')
nodes = list(tree.iter('node'))
for i, node in enumerate(nodes):
    if node.get('text', '') == '$1':
        for j in range(i, min(i+10, len(nodes))):
            if nodes[j].get('text', '') == 'Delete':
                m = re.findall(r'\d+', nodes[j].get('bounds', ''))
                if m: print(f'{(int(m[0])+int(m[2]))//2} {(int(m[1])+int(m[3]))//2}')
                break
        break
"
}

take_screenshot() {
  $ADB shell screencap -p /data/local/tmp/screenshot.png
  $ADB pull /data/local/tmp/screenshot.png "$1" >/dev/null 2>&1
}

navigate_to_chat() {
  dump_ui
  if ui_has "Prompt input" || ui_has "Type prompt"; then return 0; fi
  if ui_has "Try it"; then
    tap $TAP_TRY_IT; sleep 2; return 0
  fi
  if ui_has "Introducing"; then
    # Dismiss the intro overlay by tapping below it
    tap $TAP_PROMPT_INPUT; sleep 1; dump_ui
    if ui_has "Prompt input" || ui_has "Type prompt"; then return 0; fi
  fi
  if ui_has "Experimental"; then
    tap $TAP_EXPERIMENTAL_TAB; sleep 1; dump_ui
    AGENT_CHAT_COORDS=$(ui_find_bounds "Agent Chat task with 2 models")
    if [ -n "$AGENT_CHAT_COORDS" ]; then tap $AGENT_CHAT_COORDS; else tap $TAP_AGENT_CHAT; fi
    sleep 2; dump_ui
    if ui_has "Try it"; then tap $TAP_TRY_IT; sleep 2; fi
    return 0
  fi
  # Unknown — go back and relaunch
  tap $TAP_GO_BACK; sleep 0.5; tap $TAP_GO_BACK; sleep 0.5; tap $TAP_GO_BACK; sleep 1
  $ADB shell am start -n com.google.ai.edge.gallery.dev/com.google.ai.edge.gallery.MainActivity >/dev/null 2>&1
  sleep 2; tap $TAP_EXPERIMENTAL_TAB; sleep 1; tap $TAP_AGENT_CHAT; sleep 2
  dump_ui; if ui_has "Try it"; then tap $TAP_TRY_IT; sleep 2; fi
}

reset_session() {
  tap $TAP_RESET_SESSION; sleep 0.5; dump_ui
  if ui_has "Confirm" || ui_has "Reset" || ui_has "Yes"; then
    CONFIRM=$(ui_find_bounds "Confirm")
    [ -z "$CONFIRM" ] && CONFIRM=$(ui_find_bounds "Reset")
    [ -z "$CONFIRM" ] && CONFIRM=$(ui_find_bounds "Yes")
    [ -n "$CONFIRM" ] && tap $CONFIRM && sleep 0.5
  fi
}

send_prompt() {
  tap $TAP_PROMPT_INPUT; sleep 0.5
  type_text "$1"; sleep 0.3
  dump_ui
  SEND=$(ui_find_bounds "Send prompt")
  if [ -n "$SEND" ]; then tap $SEND; else tap $TAP_SEND_BTN; fi
}

filter_response() {
  echo "$1" | grep -v "^Type prompt" | grep -v "^Skills$" | grep -v "^Agent Chat$" \
    | grep -v "^Model on CPU$" | grep -v "^+Image$" | grep -v "^+Audio$" | grep -v "^Input history$"
}

fresh_app() {
  $ADB shell am force-stop com.google.ai.edge.gallery.dev >/dev/null 2>&1
  sleep 1
  $ADB shell input keyevent KEYCODE_WAKEUP >/dev/null 2>&1
  $ADB shell input keyevent KEYCODE_MENU >/dev/null 2>&1
  sleep 0.5
  $ADB shell am start --activity-clear-task -n com.google.ai.edge.gallery.dev/com.google.ai.edge.gallery.MainActivity >/dev/null 2>&1
  sleep 3
  navigate_to_chat
}

import_skill() {
  # Open skills panel and start import flow
  # If the skill already exists, the app will show a "Replace" dialog — we handle that.
  tap $TAP_SKILLS_BTN; sleep 1; dump_ui

  # Close skills panel to start fresh import
  if ui_has "Manage skills"; then tap $TAP_CLOSE_SKILLS; sleep 0.5; fi

  # Import
  tap $TAP_SKILLS_BTN; sleep 1; dump_ui
  tap $TAP_ADD_BTN; sleep 1
  tap $TAP_IMPORT_LOCAL; sleep 1.5
  tap $TAP_PICK_FILE; sleep 2

  # Navigate file picker
  # The picker may open at different levels depending on device/state:
  #   - Root of device storage → need to tap Download → then skill folder
  #   - Inside Download → need to tap skill folder
  #   - Inside skill folder already → just tap USE THIS FOLDER
  dump_ui

  if ui_has "Files in $SKILL_NAME"; then
    # Already inside the skill folder — just tap USE THIS FOLDER
    :
  elif ui_has "Files in Download"; then
    # Inside Download — tap the skill folder to enter it
    SKILL_COORDS=$(ui_find_bounds "$SKILL_NAME")
    [ -n "$SKILL_COORDS" ] && tap $SKILL_COORDS && sleep 1
  else
    # At device root or elsewhere — find and tap Download first
    DOWNLOAD_COORDS=$(ui_find_bounds "Download")
    if [ -n "$DOWNLOAD_COORDS" ]; then
      tap $DOWNLOAD_COORDS; sleep 1; dump_ui
      SKILL_COORDS=$(ui_find_bounds "$SKILL_NAME")
      [ -n "$SKILL_COORDS" ] && tap $SKILL_COORDS && sleep 1
    fi
  fi

  # Tap "USE THIS FOLDER" (case-insensitive check for device compatibility)
  dump_ui
  if ui_has "Use this folder" || ui_has "USE THIS FOLDER"; then
    tap $TAP_USE_FOLDER; sleep 1
  fi

  # Handle permission dialog (case-insensitive for device compatibility)
  dump_ui
  if ui_has "Allow Edge Gallery" || ui_has "ALLOW"; then
    # Try finding the ALLOW button dynamically first
    ALLOW_COORDS=$(ui_find_bounds "ALLOW")
    [ -z "$ALLOW_COORDS" ] && ALLOW_COORDS=$(ui_find_bounds "Allow")
    if [ -n "$ALLOW_COORDS" ]; then
      tap $ALLOW_COORDS; sleep 1
    else
      tap $TAP_ALLOW; sleep 1
    fi
  fi

  # Tap Add to confirm import
  dump_ui
  if ui_has "Add"; then
    ADD_COORDS=$(ui_find_bounds "Add")
    if [ -n "$ADD_COORDS" ]; then tap $ADD_COORDS; else tap $TAP_ADD_CONFIRM; fi
    sleep 1.5
  fi

  # Handle "Replace existing skill" popup (appears if skill already installed)
  dump_ui
  if ui_has "Replace existing skill" || ui_has "Replace"; then
    REPLACE_COORDS=$(ui_find_bounds "Replace")
    if [ -n "$REPLACE_COORDS" ]; then
      echo -n "(replacing existing) "
      tap $REPLACE_COORDS; sleep 1.5
    fi
  fi

  # Deselect all, then scroll to find and enable only target skill
  dump_ui
  DESELECT=$(ui_find_bounds "Deselect all")
  [ -n "$DESELECT" ] && tap $DESELECT && sleep 0.5

  for attempt in $(seq 1 15); do
    dump_ui
    TOGGLE=$(python3 -c "
import xml.etree.ElementTree as ET, re
tree = ET.parse('$UI_DUMP_FILE')
nodes = list(tree.iter('node'))
# Find the skill name node, then find nearest checkable toggle by Y proximity
skill_y = None
for node in nodes:
    if node.get('text', '') == '$SKILL_NAME':
        m = re.findall(r'\d+', node.get('bounds', ''))
        if m: skill_y = (int(m[1]) + int(m[3])) // 2
        break
if skill_y is not None:
    best = None
    best_dist = 999
    for node in nodes:
        if node.get('checkable', '') == 'true':
            m = re.findall(r'\d+', node.get('bounds', ''))
            if m:
                ty = (int(m[1]) + int(m[3])) // 2
                dist = abs(ty - skill_y)
                if dist < best_dist and dist < 80:
                    best_dist = dist
                    best = f'{(int(m[0])+int(m[2]))//2} {ty}'
    if best: print(best)
")
    if [ -n "$TOGGLE" ]; then tap $TOGGLE; sleep 0.3; break; fi
    scroll_down; sleep 0.5
  done

  tap $TAP_CLOSE_SKILLS; sleep 0.5
}

# =============================================
# Test execution
# =============================================

mkdir -p "$SCREENSHOTS_DIR/$SKILL_NAME"

echo "=========================================="
echo "Scenario Test: $SKILL_NAME"
echo "=========================================="

# --- Step 1: Device check + push ---
DEVICE_LABEL="${DEVICE_SERIAL:-default}"
echo -n "[1/5] Setup (device: $DEVICE_LABEL)... "
$ADB get-state >/dev/null 2>&1 || { echo "FAIL - No device"; exit 1; }
# Clean device: remove old skill folder from Download, push only needed files
# Skip testing/ folder — it's only for local JSDOM tests, not needed on device
$ADB shell rm -rf "/sdcard/Download/$SKILL_NAME" >/dev/null 2>&1
$ADB shell "rm -f /sdcard/screenshot.png /data/local/tmp/ui.xml" >/dev/null 2>&1
$ADB shell mkdir -p "/sdcard/Download/$SKILL_NAME" >/dev/null 2>&1
$ADB push "$SKILL_PATH/SKILL.md" "/sdcard/Download/$SKILL_NAME/SKILL.md" >/dev/null 2>&1
$ADB push "$SKILL_PATH/scripts" "/sdcard/Download/$SKILL_NAME/scripts" >/dev/null 2>&1
if [ -d "$SKILL_PATH/assets" ]; then
  $ADB push "$SKILL_PATH/assets" "/sdcard/Download/$SKILL_NAME/assets" >/dev/null 2>&1
fi
echo "OK"

# --- Step 2: Baseline (no skill, fresh app) ---
echo -n "[2/5] Baseline (no skill)... "
fresh_app
dump_ui
if ! ui_has "Prompt input" && ! ui_has "Type prompt"; then
  echo "ERROR: Failed to reach chat screen"; exit 1
fi

# Disable all skills
tap $TAP_SKILLS_BTN; sleep 1; dump_ui
DESELECT=$(ui_find_bounds "Deselect all")
[ -n "$DESELECT" ] && tap $DESELECT && sleep 0.5
tap $TAP_CLOSE_SKILLS; sleep 0.5

send_prompt "$PROMPT1"
sleep 25; dump_ui
BASELINE=$(ui_text)
take_screenshot "$SCREENSHOTS_DIR/$SKILL_NAME/disabled.png"
echo "Done"
echo ""
echo "--- BASELINE ---"
filter_response "$BASELINE"
echo ""

# --- Step 3: Install skill ---
echo -n "[3/5] Installing skill... "
fresh_app
reset_session
import_skill
echo "OK"

# --- Step 4: Enabled test ---
echo ""
echo -n "[4/5] Enabled test: \"$PROMPT1\"... "

# Ensure we're on the chat screen ready for input
dump_ui
if ! ui_has "Prompt input" && ! ui_has "Type prompt"; then
  navigate_to_chat
  dump_ui
fi

# Tap on the prompt field — try finding it by text first
PROMPT_COORDS=$(ui_find_bounds "Type prompt")
if [ -z "$PROMPT_COORDS" ]; then
  PROMPT_COORDS=$(ui_find_bounds "Prompt input")
fi
if [ -n "$PROMPT_COORDS" ]; then
  tap $PROMPT_COORDS; sleep 0.5
else
  tap $TAP_PROMPT_INPUT; sleep 0.5
fi

type_text "$PROMPT1"; sleep 0.3
dump_ui
SEND=$(ui_find_bounds "Send prompt")
if [ -n "$SEND" ]; then tap $SEND; else tap $TAP_SEND_BTN; fi

PASSED=false
if poll_ui "Called JS script" 60 3; then
  sleep 5; dump_ui
  RESPONSE=$(ui_text)
  echo "PASS"
  PASSED=true

  echo "--- Response ---"
  filter_response "$RESPONSE"
  take_screenshot "$SCREENSHOTS_DIR/$SKILL_NAME/enabled.png"
  echo "Screenshot: screenshots/$SKILL_NAME/enabled.png"
else
  echo "FAIL (timeout)"
  dump_ui
  echo "--- Last state ---"
  ui_text
  take_screenshot "$SCREENSHOTS_DIR/$SKILL_NAME/failure.png"
  echo "Screenshot: screenshots/$SKILL_NAME/failure.png"
fi

# --- Step 5: Summary ---
echo ""
echo "=========================================="
echo "SUMMARY: $SKILL_NAME"
echo "=========================================="
echo "Screenshots: screenshots/$SKILL_NAME/"
ls "$SCREENSHOTS_DIR/$SKILL_NAME/"

if [ "$PASSED" = true ]; then
  echo ""
  echo "TEST PASSED"
  exit 0
else
  echo ""
  echo "TEST FAILED"
  exit 1
fi
