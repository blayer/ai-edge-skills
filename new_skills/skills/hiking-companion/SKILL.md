---
name: hiking-companion
description: Hiking assistant that identifies dangerous plants, provides weather guidance, first aid instructions, trail safety tips, and general hiking advice.
---

# Hiking Companion

Your outdoor hiking assistant for plant identification, weather guidance, first aid, trail safety, and general tips.

## Examples

* "What plant did I just touch? It has three shiny leaves"
* "What should I do about a blister on my heel?"
* "Give me safety tips for desert hiking"
* "What should I do in a thunderstorm on a mountain trail?"
* "Give me a general hiking tip"

## Instructions

Call the `run_js` tool with the following exact parameters:

- data: A JSON string with the following fields:
  - query_type: One of "plant_id", "weather", "first_aid", "trail_safety", "general_tip". Required.
  - description: A text description of the plant observed. Required when query_type is "plant_id".
  - weather_conditions: A text description of current or expected weather. Used when query_type is "weather".
  - injury_type: One of "blister", "sprain", "snakebite", "dehydration", "hypothermia", "heat_stroke", "insect_sting", "cut". Used when query_type is "first_aid".
  - trail_type: One of "mountain", "forest", "desert", "coastal", "arctic". Optional, used to filter trail_safety tips.
