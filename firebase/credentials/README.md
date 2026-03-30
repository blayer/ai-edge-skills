# Firebase Credentials

Each team member creates their own `<name>_credential.json` file here with their GCP project details.

## Template

```json
{
  "name": "<your_name>",
  "account": "<your_google_account>@gmail.com",
  "project_id": "<your_gcp_project_id>",
  "gcs_bucket": "<your_test_lab_gcs_bucket>",
  "firebase_console": "https://console.firebase.google.com/project/<your_gcp_project_id>/testlab/"
}
```

## How to get these values

1. Create a GCP project or get access to an existing one (see `firebase/SETUP.md`)
2. `project_id` — your GCP project ID
3. `gcs_bucket` — shown in gcloud output after running your first Firebase test
4. `account` — the Google account with access to the project
