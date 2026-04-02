#!/bin/bash
# 5-hand blackjack device test with session resets
# Resets chat every 2 hands to prevent model degradation

export PATH="$PATH:$HOME/Library/Android/sdk/platform-tools"
SCREENSHOTS="/tmp/bj_screenshots"
mkdir -p "$SCREENSHOTS"
PKG="com.google.ai.edge.gallery.internal"

screenshot() {
  local name="$1"
  adb exec-out screencap -p > "$SCREENSHOTS/$name.png"
  echo "  📸 $name"
}

wait_for_response() {
  local timeout=${1:-60}
  local start=$SECONDS
  while (( SECONDS - start < timeout )); do
    sleep 3
    local xml=$(adb exec-out uiautomator dump /dev/tty 2>/dev/null)
    # Check if there's a response by looking for blackjack-related text
    if echo "$xml" | grep -qi "hand\|dealer\|hit\|stand\|bust\|win\|push\|blackjack\|draw\|reveals"; then
      sleep 2  # Let it finish rendering
      return 0
    fi
  done
  echo "  ⏱️ Timeout waiting for response"
  return 1
}

send_message() {
  local msg="$1"
  echo "  💬 Sending: $msg"

  # Find and tap the text input field
  local xml=$(adb exec-out uiautomator dump /dev/tty 2>/dev/null)

  # Try to find the text field
  local field_bounds=$(echo "$xml" | grep -o 'class="android.widget.EditText"[^>]*bounds="\[[0-9]*,[0-9]*\]\[[0-9]*,[0-9]*\]"' | head -1 | grep -o 'bounds="\[[0-9]*,[0-9]*\]\[[0-9]*,[0-9]*\]"')

  if [ -z "$field_bounds" ]; then
    # Try alternative: look for hint text
    field_bounds=$(echo "$xml" | grep -o 'text="[^"]*"[^>]*class="android.widget.EditText"[^>]*bounds="\[[0-9]*,[0-9]*\]\[[0-9]*,[0-9]*\]"' | head -1 | grep -o 'bounds="\[[0-9]*,[0-9]*\]\[[0-9]*,[0-9]*\]"')
  fi

  if [ -z "$field_bounds" ]; then
    # Fallback: tap bottom area where input usually is
    adb shell input tap 540 2250
    sleep 0.5
  else
    local x1=$(echo "$field_bounds" | grep -o '\[[0-9]*,' | head -1 | tr -dc '0-9')
    local y1=$(echo "$field_bounds" | grep -o ',[0-9]*\]' | head -1 | tr -dc '0-9')
    local x2=$(echo "$field_bounds" | grep -o '\[[0-9]*,' | tail -1 | tr -dc '0-9')
    local y2=$(echo "$field_bounds" | grep -o ',[0-9]*\]' | tail -1 | tr -dc '0-9')
    local cx=$(( (x1 + x2) / 2 ))
    local cy=$(( (y1 + y2) / 2 ))
    adb shell input tap $cx $cy
    sleep 0.5
  fi

  # Type the message
  adb shell input text "$msg"
  sleep 0.5

  # Press Enter/Send
  adb shell input keyevent KEYCODE_ENTER
  sleep 1
}

find_and_tap() {
  local search_text="$1"
  local xml=$(adb exec-out uiautomator dump /dev/tty 2>/dev/null)
  local node=$(echo "$xml" | grep -o "text=\"[^\"]*${search_text}[^\"]*\"[^>]*bounds=\"\[[0-9]*,[0-9]*\]\[[0-9]*,[0-9]*\]\"" | head -1)

  if [ -z "$node" ]; then
    node=$(echo "$xml" | grep -o "content-desc=\"[^\"]*${search_text}[^\"]*\"[^>]*bounds=\"\[[0-9]*,[0-9]*\]\[[0-9]*,[0-9]*\]\"" | head -1)
  fi

  if [ -z "$node" ]; then
    echo "  ❌ Could not find: $search_text"
    return 1
  fi

  local bounds=$(echo "$node" | grep -o 'bounds="\[[0-9]*,[0-9]*\]\[[0-9]*,[0-9]*\]"')
  local x1=$(echo "$bounds" | grep -o '\[[0-9]*,' | head -1 | tr -dc '0-9')
  local y1=$(echo "$bounds" | grep -o ',[0-9]*\]' | head -1 | tr -dc '0-9')
  local x2=$(echo "$bounds" | grep -o '\[[0-9]*,' | tail -1 | tr -dc '0-9')
  local y2=$(echo "$bounds" | grep -o ',[0-9]*\]' | tail -1 | tr -dc '0-9')
  local cx=$(( (x1 + x2) / 2 ))
  local cy=$(( (y1 + y2) / 2 ))

  echo "  👆 Tapping: $search_text at ($cx, $cy)"
  adb shell input tap $cx $cy
  sleep 1
  return 0
}

navigate_to_skill() {
  echo "🔄 Navigating to blackjack_visual skill..."

  # Force stop and restart app
  adb shell am force-stop $PKG
  sleep 2
  adb shell am start -n "$PKG/com.google.ai.edge.gallery.ui.MainActivity" 2>/dev/null
  sleep 4

  screenshot "nav_app_launch"

  # Look for Agent Skills
  find_and_tap "Agent Skills" || find_and_tap "Agent"
  sleep 3
  screenshot "nav_agent_skills"

  # Look for Gemma model
  find_and_tap "Gemma" || find_and_tap "E2B"
  sleep 3
  screenshot "nav_model_select"

  # Look for blackjack_visual skill in skill list
  find_and_tap "blackjack_visual" || find_and_tap "blackjack"
  sleep 3
  screenshot "nav_skill_select"
}

reset_chat() {
  echo "🔄 Resetting chat session..."
  # Navigate back and re-enter to reset
  adb shell input keyevent KEYCODE_BACK
  sleep 2
  adb shell input keyevent KEYCODE_BACK
  sleep 2

  # Re-navigate
  find_and_tap "Gemma" || find_and_tap "E2B"
  sleep 3
  find_and_tap "blackjack_visual" || find_and_tap "blackjack"
  sleep 3
}

play_hand() {
  local hand_num=$1
  echo ""
  echo "═══════════════════════════════════"
  echo "  HAND $hand_num"
  echo "═══════════════════════════════════"

  # Deal
  echo "--- Deal ---"
  send_message "play%sblackjack"
  sleep 2
  wait_for_response 90
  screenshot "hand${hand_num}_deal"

  # Scroll down to see full response
  adb shell input swipe 540 1800 540 800
  sleep 1
  screenshot "hand${hand_num}_deal_scroll"

  # Stand
  echo "--- Stand ---"
  send_message "stand"
  sleep 2
  wait_for_response 90
  screenshot "hand${hand_num}_stand"

  # Scroll to see result
  adb shell input swipe 540 1800 540 800
  sleep 1
  screenshot "hand${hand_num}_stand_scroll"

  echo "✅ Hand $hand_num complete"
}

# ========================
# Main test flow
# ========================
echo "🎰 Starting 5-Hand Blackjack Visual Test"
echo "========================================="

# Navigate to skill
navigate_to_skill

# Hands 1-2
play_hand 1
play_hand 2

# Reset session for hands 3-4
reset_chat
play_hand 3
play_hand 4

# Reset session for hand 5
reset_chat
play_hand 5

echo ""
echo "========================================="
echo "🎰 5-Hand Test Complete!"
echo "Screenshots saved to: $SCREENSHOTS"
ls -la "$SCREENSHOTS"/hand*.png 2>/dev/null
