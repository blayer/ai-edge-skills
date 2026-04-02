#!/bin/bash
# Edge Gallery On-Device Skill Test — XML-based (device-independent)
# Usage: ./run-device-test-v2.sh [-d <device-serial>] [-s <skills-dir>] <skill-name>
#
# Uses uiautomator XML dumps to find UI elements dynamically.
# No hardcoded coordinates — works on any device resolution.

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

SKILL_NAME="${1:?Usage: $0 [-d <device-serial>] [-s <skills-dir>] <skill-name>}"

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
UI_XML="/tmp/ui_${DEVICE_SERIAL:-default}.xml"

if [ ! -d "$SKILL_PATH" ]; then
  echo "ERROR: Skill '$SKILL_NAME' not found in $SKILLS_DIR"
  exit 1
fi

# Load test prompt from TEST-PLAN.md
PROMPT1=$(python3 -c "
with open('$TEST_PLAN') as f:
    for line in f:
        line = line.strip()
        if '| $SKILL_NAME |' in line:
            cols = [c.strip() for c in line.split('|')]
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

DEVICE_MODEL=$($ADB shell getprop ro.product.model 2>/dev/null | tr -d '\r')
echo "Device: $DEVICE_MODEL (${DEVICE_SERIAL:-default})"
echo "Prompt: \"$PROMPT1\""

# =============================================
# XML-based helpers — no hardcoded coordinates
# =============================================

dump_ui() {
  $ADB shell uiautomator dump /data/local/tmp/ui.xml >/dev/null 2>&1
  $ADB pull /data/local/tmp/ui.xml "$UI_XML" >/dev/null 2>&1
}

# Find center coordinates of an element by text or content-desc
# Usage: find_element "Button text"
# Returns: "x y" or empty string
find_element() {
  python3 -c "
import xml.etree.ElementTree as ET, re, sys
tree = ET.parse('$UI_XML')
target = '''$1'''
for node in tree.iter('node'):
    text = node.get('text', '')
    desc = node.get('content-desc', '')
    if text == target or desc == target:
        m = re.findall(r'\d+', node.get('bounds', ''))
        if m:
            print(f'{(int(m[0])+int(m[2]))//2} {(int(m[1])+int(m[3]))//2}')
            sys.exit(0)
"
}

# Find element containing substring (case-insensitive)
find_element_contains() {
  python3 -c "
import xml.etree.ElementTree as ET, re, sys
tree = ET.parse('$UI_XML')
target = '''$1'''.lower()
for node in tree.iter('node'):
    text = node.get('text', '').lower()
    desc = node.get('content-desc', '').lower()
    if target in text or target in desc:
        m = re.findall(r'\d+', node.get('bounds', ''))
        if m:
            print(f'{(int(m[0])+int(m[2]))//2} {(int(m[1])+int(m[3]))//2}')
            sys.exit(0)
"
}

# Find the toggle (checkable) nearest to a skill name by Y-coordinate
find_skill_toggle() {
  python3 -c "
import xml.etree.ElementTree as ET, re, sys
tree = ET.parse('$UI_XML')
nodes = list(tree.iter('node'))
skill_y = None
for node in nodes:
    if node.get('text', '') == '''$1''':
        m = re.findall(r'\d+', node.get('bounds', ''))
        if m: skill_y = (int(m[1]) + int(m[3])) // 2
        break
if skill_y is not None:
    best, best_dist = None, 999
    for node in nodes:
        if node.get('checkable', '') == 'true':
            m = re.findall(r'\d+', node.get('bounds', ''))
            if m:
                ty = (int(m[1]) + int(m[3])) // 2
                dist = abs(ty - skill_y)
                if dist < best_dist and dist < 100:
                    best_dist = dist
                    best = f'{(int(m[0])+int(m[2]))//2} {ty}'
    if best: print(best)
"
}

# Find Delete button near a skill name
find_skill_delete() {
  python3 -c "
import xml.etree.ElementTree as ET, re, sys
tree = ET.parse('$UI_XML')
nodes = list(tree.iter('node'))
for i, node in enumerate(nodes):
    if node.get('text', '') == '''$1''':
        for j in range(i, min(i+15, len(nodes))):
            if nodes[j].get('text', '') == 'Delete':
                m = re.findall(r'\d+', nodes[j].get('bounds', ''))
                if m:
                    print(f'{(int(m[0])+int(m[2]))//2} {(int(m[1])+int(m[3]))//2}')
                    sys.exit(0)
        break
"
}

ui_has() { grep -qi "$1" "$UI_XML" 2>/dev/null; }

ui_text() {
  python3 -c "
import xml.etree.ElementTree as ET
tree = ET.parse('$UI_XML')
for node in tree.iter('node'):
    t = node.get('text', '')
    if t and len(t) > 5: print(t[:500])
"
}

tap() { $ADB shell input tap $1 $2; }

tap_element() {
  local coords
  coords=$(find_element "$1")
  if [ -n "$coords" ]; then
    tap $coords; return 0
  fi
  # Fallback: try contains match
  coords=$(find_element_contains "$1")
  if [ -n "$coords" ]; then
    tap $coords; return 0
  fi
  return 1
}

type_text() {
  local encoded=$(echo "$1" | sed 's/ /%s/g; s/(/\\(/g; s/)/\\)/g; s/&/\\&/g; s/;/\\;/g; s/|/\\|/g; s/</\\</g; s/>/\\>/g; s/"/\\"/g; s/'"'"'/\\'"'"'/g; s/#/\\#/g; s/\$/\\$/g')
  $ADB shell input text "$encoded"
}

scroll_down() { $ADB shell input swipe 540 1800 540 1000 200; }

take_screenshot() {
  $ADB shell screencap -p /data/local/tmp/screenshot.png
  $ADB pull /data/local/tmp/screenshot.png "$1" >/dev/null 2>&1
}

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

filter_response() {
  echo "$1" | grep -v "^Type prompt" | grep -v "^Skills$" | grep -v "^Agent Chat$" \
    | grep -v "^Model on CPU$" | grep -v "^+Image$" | grep -v "^+Audio$" | grep -v "^Input history$"
}

# =============================================
# Navigation helpers
# =============================================

navigate_to_chat() {
  dump_ui
  if ui_has "Type prompt" || ui_has "Prompt input"; then return 0; fi
  if ui_has "Try it"; then
    dump_ui; tap_element "Try it"; sleep 3; return 0
  fi
  if ui_has "Introducing"; then
    dump_ui; tap_element "Type prompt" || tap_element "Prompt input"; sleep 1
    dump_ui; if ui_has "Type prompt" || ui_has "Prompt input"; then return 0; fi
  fi
  if ui_has "Experimental" || ui_has "Agent Skills"; then
    tap_element "Agent Skills" || tap_element "Experimental"; sleep 1
    dump_ui; tap_element "Agent Chat" || { coords=$(find_element_contains "Agent"); [ -n "$coords" ] && tap $coords; }; sleep 2
    dump_ui; if ui_has "Try it"; then tap_element "Try it"; sleep 3; fi
    return 0
  fi
  # Unknown state — relaunch
  $ADB shell am start --activity-clear-task -n com.google.ai.edge.gallery.internal/com.google.ai.edge.gallery.MainActivity >/dev/null 2>&1
  sleep 3
  dump_ui; tap_element "Agent Skills" || tap_element "Experimental"; sleep 1
  dump_ui; tap_element "Agent Chat" || { coords=$(find_element_contains "Agent"); [ -n "$coords" ] && tap $coords; }; sleep 2
  dump_ui; if ui_has "Try it"; then tap_element "Try it"; sleep 3; fi
}

fresh_app() {
  $ADB shell am force-stop com.google.ai.edge.gallery.internal >/dev/null 2>&1
  sleep 1
  $ADB shell input keyevent KEYCODE_WAKEUP >/dev/null 2>&1
  $ADB shell input keyevent KEYCODE_MENU >/dev/null 2>&1
  sleep 0.5
  $ADB shell am start --activity-clear-task -n com.google.ai.edge.gallery.internal/com.google.ai.edge.gallery.MainActivity >/dev/null 2>&1
  sleep 3
  navigate_to_chat
}

reset_session() {
  dump_ui
  tap_element "Reset session"; sleep 0.5
  dump_ui
  tap_element "Confirm" || tap_element "Reset" || tap_element "Yes"
  sleep 0.5
}

send_prompt() {
  dump_ui
  tap_element "Type prompt" || tap_element "Prompt input"
  sleep 0.5
  type_text "$1"; sleep 0.3
  dump_ui
  tap_element "Send prompt" || { $ADB shell input keyevent 66; }
}

import_skill() {
  # Open skills panel
  dump_ui; tap_element "Skills"; sleep 1.5

  # Close and reopen to ensure clean state
  dump_ui
  if ui_has "Manage skills"; then tap_element "Close"; sleep 0.5; fi
  dump_ui; tap_element "Skills"; sleep 1.5

  # Tap Add
  dump_ui; tap_element "Add"; sleep 1.5

  # Tap Import local skill
  dump_ui; tap_element "Import local skill"; sleep 2

  # Handle third-party skill agreement dialog
  dump_ui
  if ui_has "Agree" || ui_has "third-party"; then
    tap_element "Agree"; sleep 1.5
  fi

  # Tap Pick file
  dump_ui; tap_element "Pick file"; sleep 2

  # Navigate file picker to skill folder
  dump_ui
  if ui_has "Files in $SKILL_NAME"; then
    # Already inside skill folder
    :
  elif ui_has "Files in Download" || ui_has "Download"; then
    # In Download or can see Download — find and tap skill folder
    if ! ui_has "Files in Download"; then
      tap_element "Download"; sleep 1; dump_ui
    fi
    tap_element "$SKILL_NAME"; sleep 1
  else
    # Try to find Download folder
    tap_element "Download"; sleep 1; dump_ui
    tap_element "$SKILL_NAME"; sleep 1
  fi

  # Tap USE THIS FOLDER
  dump_ui
  tap_element "USE THIS FOLDER" || tap_element "Use this folder"
  sleep 1.5

  # Handle permission dialog — button may be "Allow" or "ALLOW" depending on device
  dump_ui
  if ui_has "Allow Edge Gallery" || ui_has "ALLOW" || ui_has "access folder"; then
    ALLOW_XY=$(python3 -c "
import xml.etree.ElementTree as ET, re, sys
tree = ET.parse('$UI_XML')
for node in tree.iter('node'):
    t = node.get('text', '')
    if t in ('Allow', 'ALLOW'):
        m = re.findall(r'\d+', node.get('bounds', ''))
        if m:
            print(f'{(int(m[0])+int(m[2]))//2} {(int(m[1])+int(m[3]))//2}')
            sys.exit(0)
")
    if [ -n "$ALLOW_XY" ]; then
      tap $ALLOW_XY
    fi
    sleep 1.5
  fi

  # Tap Add to confirm
  dump_ui
  if ui_has "Cancel" && ui_has "Add"; then
    tap_element "Add"; sleep 1.5
  fi

  # Handle Replace existing skill dialog
  dump_ui
  if ui_has "Replace existing skill" || ui_has "replace"; then
    echo -n "(replacing) "
    tap_element "Replace"; sleep 1.5
  fi

  # Now in skills panel — deselect all, then enable only target
  dump_ui
  tap_element "Deselect all"; sleep 0.5

  # Scroll to find and toggle on the target skill
  for attempt in $(seq 1 15); do
    dump_ui
    TOGGLE=$(find_skill_toggle "$SKILL_NAME")
    if [ -n "$TOGGLE" ]; then
      tap $TOGGLE; sleep 0.5
      break
    fi
    scroll_down; sleep 0.5
  done

  # Close skills panel
  dump_ui; tap_element "Close"; sleep 0.5
}

# =============================================
# Test execution
# =============================================

mkdir -p "$SCREENSHOTS_DIR/$SKILL_NAME"

echo "=========================================="
echo "Scenario Test: $SKILL_NAME"
echo "=========================================="

# --- Step 1: Push skill to device ---
echo -n "[1/5] Setup... "
$ADB get-state >/dev/null 2>&1 || { echo "FAIL - No device"; exit 1; }
$ADB shell rm -rf "/sdcard/Download/$SKILL_NAME" >/dev/null 2>&1
$ADB shell mkdir -p "/sdcard/Download/$SKILL_NAME" >/dev/null 2>&1
$ADB push "$SKILL_PATH/SKILL.md" "/sdcard/Download/$SKILL_NAME/SKILL.md" >/dev/null 2>&1
$ADB push "$SKILL_PATH/scripts" "/sdcard/Download/$SKILL_NAME/scripts" >/dev/null 2>&1
if [ -d "$SKILL_PATH/assets" ]; then
  $ADB push "$SKILL_PATH/assets" "/sdcard/Download/$SKILL_NAME/assets" >/dev/null 2>&1
fi
echo "OK"

# --- Step 2: Baseline (no skill) ---
echo -n "[2/5] Baseline... "
fresh_app
dump_ui
if ! ui_has "Type prompt" && ! ui_has "Prompt input"; then
  echo "ERROR: Failed to reach chat screen"; exit 1
fi

# Disable all skills
tap_element "Skills"; sleep 1
dump_ui; tap_element "Deselect all"; sleep 0.5
dump_ui; tap_element "Close"; sleep 0.5

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
echo -n "[3/5] Installing... "
fresh_app
reset_session
import_skill
echo "OK"

# --- Step 4: Enabled test ---
echo ""
echo -n "[4/5] Testing: \"$PROMPT1\"... "

dump_ui
if ! ui_has "Type prompt" && ! ui_has "Prompt input"; then
  navigate_to_chat; dump_ui
fi

send_prompt "$PROMPT1"

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
fi

# --- Step 5: Summary ---
echo ""
echo "=========================================="
echo "SUMMARY: $SKILL_NAME ($DEVICE_MODEL)"
echo "=========================================="
echo "Screenshots: screenshots/$SKILL_NAME/"
ls "$SCREENSHOTS_DIR/$SKILL_NAME/" 2>/dev/null

if [ "$PASSED" = true ]; then
  echo ""; echo "TEST PASSED"; exit 0
else
  echo ""; echo "TEST FAILED"; exit 1
fi
