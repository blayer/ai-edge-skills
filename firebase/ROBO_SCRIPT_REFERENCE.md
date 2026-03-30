# Robo Script Quick Reference

## Key Event Types We Need

| eventType | Purpose |
|---|---|
| `VIEW_CLICKED` | Tap a UI element |
| `VIEW_TEXT_CHANGED` | Type text into a field |
| `ENTER_TEXT` | Type text + press Enter |
| `WAIT` | Pause for N milliseconds |
| `WAIT_FOR_ELEMENT` | Wait until element appears (with timeout) |
| `TAKE_SCREENSHOT` | Capture the screen |
| `VIEW_SWIPED` | Swipe on an element |
| `ELEMENT_SCROLL_INTO_VIEW` | Scroll until child element is visible |
| `ADB_SHELL_COMMAND` | Execute an adb shell command |
| `POINT_TAP` | Tap at screen coordinates |

## Element Matching

```json
"elementDescriptors": [
  {
    "resourceId": "com.example.app:id/element_id",
    "className": "android.widget.Button",
    "contentDescription": "Button label",
    "text": "Visible text",
    "textRegex": "Text.*pattern"
  }
]
```

Also supports OCR-based matching (no element descriptor needed):
```json
{ "eventType": "VIEW_CLICKED", "visionText": "Sign In" }
```

## Important Fields

- `"optional": true` — skip if element not found (critical for flaky screens)
- `"delayTime": 3000` — milliseconds for WAIT / WAIT_FOR_ELEMENT
- `"screenshotName": "label"` — label for TAKE_SCREENSHOT
- `"swipeDirection": "Up"` — for VIEW_SWIPED

## gcloud Command

```bash
gcloud firebase test android run \
  --type robo \
  --app firebase/gallery.apk \
  --robo-script firebase/robo_scripts/script.json \
  --device model=oriole,version=33 \
  --timeout 300s
```

## Gotchas

1. After script completes, Robo continues crawling automatically
2. Permissions are auto-granted at crawl start
3. `resourceId` must include full package prefix (e.g., `com.google.ai.edge.gallery:id/...`)
4. Use `"optional": true` for elements that may not appear
5. Use `WAIT_FOR_ELEMENT` instead of blind `WAIT` when possible
6. `visionText` enables OCR matching — useful when resourceIds are unknown
