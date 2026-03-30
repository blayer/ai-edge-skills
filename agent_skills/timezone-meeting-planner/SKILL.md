---
name: timezone-meeting-planner
description: Find overlapping availability across timezones with visual grid in webview.
---

# Timezone Meeting Planner

Find overlapping working hours across timezones.

## Examples

* "Find meeting time for New York, London, and Tokyo"
* "I live in SF and my mom lives in Beijing. My time is 7pm to 11pm. My mom is available 8am to 8pm. Find the best time to call for at least 30 mins."

## Instructions

Call the `run_js` tool with the following exact parameters:

- data: A JSON string with the following fields:
  - timezones: Array of timezone objects, each with:
    - name: Display name (e.g., "New York").
    - utc_offset: UTC offset in hours (e.g., -5 for EST, 8 for CST).
    - available_start: (Optional) Person's available start hour (0-23). Overrides work_start for this person.
    - available_end: (Optional) Person's available end hour (0-23). Overrides work_end for this person.
  - work_start: Default work start hour (0-23). Default: 9.
  - work_end: Default work end hour (0-23). Default: 17.
  - min_duration: (Optional) Minimum meeting duration in minutes. Highlights the best slot meeting this requirement.
