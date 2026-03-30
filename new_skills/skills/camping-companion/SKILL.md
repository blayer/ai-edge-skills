---
name: camping-companion
description: Comprehensive camping guide covering tent pitching, fire building, knot tying, outdoor cooking, wildlife safety, gear checklists, water purification, and navigation.
---

# Camping Companion

Your complete camping skills guide with step-by-step instructions for essential outdoor skills.

## Examples

* "How do I pitch a dome tent?"
* "Teach me the bowline knot"
* "What should I do if I encounter a bear?"
* "Give me a gear checklist for a weekend trip"
* "How do I purify water in the backcountry?"

## Instructions

Call the `run_js` tool with the following exact parameters:

- data: A JSON string with the following fields:
  - topic: One of "tent", "fire", "knots", "cooking", "wildlife", "gear_checklist", "water", "navigation". Required.
  - subtopic: A specific item within the topic (e.g., "dome", "bowline", "bear"). Optional. If omitted, available subtopics are listed.
  - skill_level: One of "beginner", "intermediate", "advanced". Default: "beginner".
