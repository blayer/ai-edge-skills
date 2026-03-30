---
name: allergy-advisor
description: Personalized allergy, skin care, and hair care advisory based on city, season, and personal profile. Uses hardcoded allergen data for 20+ cities.
---

# Allergy Advisor

Get personalized allergy and care recommendations based on your location and profile.

## Examples

* "What allergens should I watch for in New York this spring?"
* "I have sensitive skin and curly hair, what should I use in Miami during summer?"
* "Allergy advisory for Chicago in fall with my nut and pollen allergies"

## Instructions

Call the `run_js` tool with the following exact parameters:

- data: A JSON string with the following fields:
  - location: City name (string). Required.
  - season: One of "spring", "summer", "fall", "winter". Required.
  - skin_type: One of "oily", "dry", "combination", "sensitive". Required.
  - hair_type: One of "straight", "curly", "wavy", "coily". Required.
  - allergies: Array of allergy strings (e.g., ["pollen", "dust", "nuts"]). Default: [].
