#!/bin/bash
# Download the latest AI Edge Gallery APK from GitHub releases
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
APK_PATH="$SCRIPT_DIR/gallery.apk"

if [ -f "$APK_PATH" ]; then
  echo "gallery.apk already exists at $APK_PATH"
  echo "Delete it first if you want to re-download."
  exit 0
fi

echo "Fetching latest release from google-ai-edge/gallery..."
DOWNLOAD_URL=$(curl -s https://api.github.com/repos/google-ai-edge/gallery/releases/latest \
  | python3 -c "import sys,json; assets=json.load(sys.stdin).get('assets',[]); urls=[a['browser_download_url'] for a in assets if a['name'].endswith('.apk')]; print(urls[0] if urls else '')")

if [ -z "$DOWNLOAD_URL" ]; then
  echo "ERROR: Could not find APK in latest release."
  echo "Download manually from: https://github.com/google-ai-edge/gallery/releases"
  exit 1
fi

echo "Downloading: $DOWNLOAD_URL"
curl -L -o "$APK_PATH" "$DOWNLOAD_URL"
echo "Saved to: $APK_PATH"
