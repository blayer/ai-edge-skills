# Firebase Test Lab Setup Guide

## Prerequisites

- [Google Cloud SDK (gcloud)](https://cloud.google.com/sdk/docs/install) installed
- A Google account with access to the GCP project

## GCP Project Details

| Field | Value |
|---|---|
| Project ID | `js-skill-research` |
| Project Owner | `blayer30@gmail.com` |
| Console | https://console.cloud.google.com/welcome?project=js-skill-research |
| Firebase Console | https://console.firebase.google.com/project/js-skill-research/testlab/ |
| GCS Bucket | `test-lab-1qxtrt1zpp7u2-kfjyhfwkzxwi2` |

## Step 1: Authenticate

```bash
gcloud auth login --launch-browser
```

This opens a browser for Google OAuth. Use an account that has been granted access to the `js-skill-research` project.

## Step 2: Set the Project

```bash
gcloud config set project js-skill-research
```

## Step 3: Verify Access

```bash
gcloud firebase test android models list
```

You should see a list of available devices. If you get a permission error, ask the project owner to grant you the **Editor** or **Firebase Test Lab Admin** role.

## Granting Access to New Team Members

The project owner runs:

```bash
# Grant Editor role (full test lab access)
gcloud projects add-iam-policy-binding js-skill-research \
  --member="user:teammate@gmail.com" \
  --role="roles/editor"

# Or grant minimal test lab access only
gcloud projects add-iam-policy-binding js-skill-research \
  --member="user:teammate@gmail.com" \
  --role="roles/firebase.testLabAdmin"
```

Or via the console: [IAM & Admin](https://console.cloud.google.com/iam-admin/iam?project=js-skill-research) → **Grant Access** → add the email and role.

## Quota Limits (Spark/Free Plan)

| Resource | Daily Quota |
|---|---|
| Physical device tests | 5 per day |
| Virtual device tests | 10 per day |

Quota resets daily (Pacific time). If you hit `TEST_QUOTA_EXCEEDED`, wait until the next day or upgrade to the Blaze plan. Use physical devices (`model=oriole`) for accurate results — virtual devices are not needed/expected for this project.

## Credentials

Each team member has a credential file in `firebase/credentials/<name>_credential.json` containing their GCP project ID, GCS bucket, and account email. If no file exists for you, create one following `firebase/credentials/README.md`.

## Test Workflow

### 1. Verify Auth

```bash
gcloud config get-value project   # should match your credential file's project ID
gcloud config set project <project-id>   # if not matching
gcloud auth login --launch-browser       # if auth expired
```

### 2. Choose Test Type

- **Unscripted crawl**: Run Robo without a script to explore the app
- **Scripted test**: Run with a specific Robo script from `firebase/robo_scripts/`
- **New script**: Generate a new Robo script based on the test scenario, save to `firebase/robo_scripts/`

### 3. Generate Robo Script (if needed)

See `firebase/ROBO_SCRIPT_REFERENCE.md` for syntax. Key patterns:
- Use `visionText` (OCR) for tapping UI elements when resourceIds are unknown
- Use `WAIT_FOR_ELEMENT` instead of blind `WAIT` when possible
- Add `"optional": true` for elements that may not appear
- Always end with `TAKE_SCREENSHOT` to capture results
- Save script to `firebase/robo_scripts/<descriptive_name>.json`

### 4. Run the Test

```bash
# Scripted test
gcloud firebase test android run \
  --type robo \
  --app firebase/gallery.apk \
  --robo-script firebase/robo_scripts/<script>.json \
  --device model=oriole,version=33 \
  --timeout 300s

# Unscripted crawl (omit --robo-script)
gcloud firebase test android run \
  --type robo \
  --app firebase/gallery.apk \
  --device model=oriole,version=33 \
  --timeout 300s
```

### 5. Download Results

After a test completes, gcloud prints the GCS path. Download with:

```bash
mkdir -p firebase/results/<experiment_name>
gsutil -m cp -r gs://<bucket-from-credential>/<test-id>/ firebase/results/<experiment_name>/
```

### 6. Analyze & Log Results

Read downloaded screenshots to verify test outcome. Save structured findings to `firebase/results/<experiment_name>/findings.json` with: test date, script used, device info, pass/fail status, screenshot references, and observations.

## Notes

- After the Robo script completes, Robo continues crawling automatically
- Permissions are auto-granted at crawl start
- The public APK (v1.0.10) does NOT have the "Experimental" tab or "Agent Chat" with Skills support — only AI Chat, Ask Image, Audio Scribe, Prompt Lab, Tiny Garden, Mobile Actions are available

## Test Device

| Field | Value |
|---|---|
| Model | `oriole` (Pixel 6) |
| API Level | 33 (Android 13) |

To see all available devices:

```bash
gcloud firebase test android models list
```

## App Under Test

- **APK:** `firebase/gallery.apk` (not committed — download first)
- **Source:** https://github.com/google-ai-edge/gallery/releases
- **Package:** `com.google.ai.edge.gallery`

To download the latest APK:

```bash
./firebase/download-apk.sh
```
