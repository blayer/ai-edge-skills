window['ai_edge_gallery_get_result'] = async (data) => {
  try {
    const jsonData = JSON.parse(data);
    const topic = jsonData.topic;
    const subtopic = (jsonData.subtopic || "").toLowerCase().trim();
    const skillLevel = jsonData.skill_level || "beginner";

    if (!topic) {
      return JSON.stringify({ error: "topic is required. Must be one of: tent, fire, knots, cooking, wildlife, gear_checklist, water, navigation" });
    }

    // ===== TENT DATABASE =====
    const tents = {
      dome: {
        name: "Dome Tent",
        difficulty: "Beginner",
        time: "10-15 minutes",
        steps: [
          "Choose a flat, level area free of rocks, roots, and standing water",
          "Lay out a ground tarp or footprint slightly smaller than the tent floor",
          "Unfold the tent body and lay it flat on the tarp with the door facing away from prevailing wind",
          "Assemble the tent poles by connecting the shock-corded sections",
          "Thread the poles through the corresponding pole sleeves or attach to clips on the tent body, forming an X pattern over the tent",
          "Secure each pole end into the grommets or pin holes at the corners of the tent floor",
          "Attach any remaining body clips to the poles to create the dome shape",
          "Drape the rainfly over the pole structure, aligning it with the tent doors",
          "Secure the rainfly by attaching its buckles or Velcro straps to the poles or tent base",
          "Stake out the tent corners and rainfly guylines at 45-degree angles for wind resistance"
        ],
        proTips: [
          "Practice setup at home before your trip",
          "Orient the door away from the wind",
          "Keep the rainfly taut for better ventilation and water shedding",
          "In high winds, stake the tent before inserting poles"
        ],
        safetyWarnings: ["Never cook inside a tent", "Ensure adequate ventilation to prevent condensation"]
      },
      "a-frame": {
        name: "A-Frame Tent",
        difficulty: "Beginner",
        time: "10-15 minutes",
        steps: [
          "Find a flat area and lay down your ground tarp",
          "Spread the tent body flat on the tarp",
          "Assemble the two A-frame poles (one for each end)",
          "Insert one pole into the grommet at one end and raise it upright",
          "Stake the pole's guylines to hold it vertical",
          "Repeat with the second pole at the opposite end",
          "Attach the ridge line or ridge pole between the two A-frame poles",
          "Pull the tent body taut and stake all corners and side guylines",
          "Attach the rainfly over the frame, securing at both ends",
          "Adjust tension on all stakes and guylines until the fabric is taut with no sagging"
        ],
        proTips: [
          "A-frames shed wind well when oriented with the narrow end facing the wind",
          "Use a footprint to extend the tent floor life",
          "Trench around the tent perimeter in heavy rain areas (only in designated sites)"
        ],
        safetyWarnings: ["A-frames have less headroom - mind your stove placement outside", "Ensure guylines are visible to prevent tripping at night"]
      },
      cabin: {
        name: "Cabin Tent",
        difficulty: "Intermediate",
        time: "20-30 minutes",
        steps: [
          "Clear a large flat area as cabin tents have a bigger footprint",
          "Lay out the tent body and identify all poles (usually multiple vertical and horizontal poles)",
          "Assemble all poles and sort by length - longer poles are typically the roof poles",
          "Begin with the corner vertical poles, inserting them into the corner grommets",
          "Connect the horizontal roof poles between the vertical poles at the top",
          "Raise the structure with a partner - cabin tents are difficult to set up alone",
          "Attach the tent body to the frame using clips and hooks",
          "Add any room dividers or interior features",
          "Place the rainfly over the structure and secure at all attachment points",
          "Stake out all corners, guylines, and vestibule sections firmly"
        ],
        proTips: [
          "Always set up with at least one partner due to size",
          "These are best for car camping - too heavy for backpacking",
          "Vertical walls maximize interior space",
          "Set up a tarp over the cabin tent for extra rain protection"
        ],
        safetyWarnings: ["Large profile catches wind easily - extra staking is critical", "Not recommended for high wind or exposed locations"]
      },
      tunnel: {
        name: "Tunnel Tent",
        difficulty: "Intermediate",
        time: "15-20 minutes",
        steps: [
          "Select a flat area and orient the tent lengthwise into the prevailing wind",
          "Lay out the tent body flat with the entrance facing downwind",
          "Assemble the parallel hoop poles (typically 2-4 depending on tent size)",
          "Thread or clip each hoop pole perpendicular to the tent length, creating the tunnel shape",
          "Secure pole ends into grommets at the base on each side",
          "Stake out the front and rear first to establish tension",
          "Stake the sides pulling outward to maximize interior volume",
          "Attach the rainfly, starting from the windward end",
          "Secure all rainfly attachment points and guylines",
          "Add additional guylines in exposed conditions for wind stability"
        ],
        proTips: [
          "Tunnel tents MUST be properly staked - they collapse without stakes",
          "Best weight-to-space ratio of any tent design",
          "Keep the narrow end pointed into the wind for best stability"
        ],
        safetyWarnings: ["Cannot free-stand - requires staking on all sides", "Not ideal for rocky terrain where staking is difficult"]
      },
      hammock: {
        name: "Hammock Tent",
        difficulty: "Beginner",
        time: "5-10 minutes",
        steps: [
          "Find two strong, healthy trees approximately 12-15 feet apart",
          "Wrap tree straps around each tree at approximately 6 feet height (use wide straps to protect bark)",
          "Clip or tie the hammock to the tree straps using carabiners",
          "Adjust the hang angle to approximately 30 degrees from horizontal (a gentle curve)",
          "Test by sitting in the center and gradually putting full weight in",
          "Attach the bug net over the hammock if separate, or zip it closed if integrated",
          "Hang the rainfly/tarp above using a ridgeline between the two trees",
          "Angle the tarp so it sheds rain away from the hammock ends",
          "Insert your underquilt or sleeping pad for insulation from below",
          "Adjust ridgeline and tarp tension to prevent pooling and flapping"
        ],
        proTips: [
          "Lie diagonally in the hammock for a flatter sleeping position",
          "An underquilt is warmer than a sleeping pad in a hammock",
          "The 30-degree hang angle is key - too flat strains the system, too curved is uncomfortable",
          "Check trees for dead branches above before hanging"
        ],
        safetyWarnings: ["Never hang from dead trees or branches", "Check weight ratings of all components", "Avoid hanging over rocky ground in case of failure"]
      },
      tarp: {
        name: "Tarp Shelter",
        difficulty: "Advanced",
        time: "10-20 minutes",
        steps: [
          "Select two anchor points (trees, trekking poles, or a ridgeline between trees)",
          "Run a ridgeline/cord between the two anchor points at about 4-5 feet height",
          "Drape the tarp over the ridgeline so equal amounts hang on each side",
          "Secure the ridgeline corners with guylines to stakes at 45-degree angles",
          "Stake the bottom edges taut pulling outward and slightly back",
          "Adjust the angle of the tarp based on weather: steeper for heavy rain, more open for mild conditions",
          "For A-frame configuration: stake both sides to ground. For lean-to: stake one side to ground, angle the other side toward wind",
          "Add extra guylines at midpoints along the edges for better tension in wind",
          "Ensure the tarp extends beyond your sleeping area on all sides to prevent rain splash",
          "Create a drip line by running cord along the edges where water might travel toward you"
        ],
        proTips: [
          "Tarps are the lightest shelter option and most versatile",
          "Learn at least 3 tarp configurations: A-frame, lean-to, and diamond",
          "Use trekking poles as uprights when trees are unavailable",
          "Silnylon or Dyneema tarps offer the best weight-to-protection ratio"
        ],
        safetyWarnings: ["Tarps offer no insect protection without a separate bug net", "Requires practice to set up effectively in adverse weather", "Not recommended for beginners in severe conditions"]
      }
    };

    // ===== FIRE DATABASE =====
    const fireMethods = {
      teepee: {
        name: "Teepee Fire",
        difficulty: "Beginner",
        time: "5-10 minutes",
        steps: [
          "Clear a fire area down to mineral soil or use an existing fire ring",
          "Place a small bundle of tinder in the center (dry grass, birch bark, dryer lint, fatwood shavings)",
          "Lean small kindling sticks (pencil-thin) against each other forming a teepee shape over the tinder",
          "Leave a gap on the windward side for lighting and airflow",
          "Add a second layer of slightly larger kindling around the first teepee",
          "Light the tinder through the gap at the base on the windward side",
          "As the kindling catches, gradually add larger sticks maintaining the teepee shape",
          "Once you have a good bed of coals, add fuel-sized logs (wrist-thick)",
          "The teepee will eventually collapse into a coal bed, which is ideal for cooking"
        ],
        proTips: [
          "This is the best fire type for beginners - simple and reliable",
          "Burns hot and fast, great for quick warmth",
          "Collapses into good cooking coals naturally",
          "Always have your next size of wood ready before you need it"
        ]
      },
      "log cabin": {
        name: "Log Cabin Fire",
        difficulty: "Beginner",
        time: "10-15 minutes",
        steps: [
          "Build a small teepee of tinder and kindling in the center of your fire ring",
          "Place two larger logs parallel to each other on either side of the teepee",
          "Place two more logs perpendicular on top, forming a square",
          "Continue stacking in alternating directions, getting slightly smaller with each layer",
          "The result should look like a small log cabin with the teepee inside",
          "Ensure gaps between logs for airflow",
          "Light the teepee in the center",
          "The structure will burn from the inside out, collapsing into a large coal bed",
          "Add additional fuel as needed once the structure is burning well"
        ],
        proTips: [
          "Excellent for cooking - produces a large, even coal bed",
          "Burns longer and more steadily than a teepee fire",
          "Good for rainy conditions as the outer logs protect the inner flame",
          "Use the flattest, straightest logs for a stable structure"
        ]
      },
      "lean-to": {
        name: "Lean-To Fire",
        difficulty: "Beginner",
        time: "5-10 minutes",
        steps: [
          "Place a large green log or rock as a windbreak on the downwind side",
          "Place your tinder bundle against the base of the windbreak",
          "Lean small kindling against the windbreak over the tinder at a 30-degree angle",
          "Light the tinder from the upwind side",
          "As kindling catches, add progressively larger sticks leaning against the windbreak",
          "The windbreak reflects heat back and protects the flame from wind",
          "Once established, add fuel logs leaning against the windbreak",
          "Maintain the lean-to structure as you add wood"
        ],
        proTips: [
          "Best fire design for windy conditions",
          "The windbreak log or rock also reflects heat toward you",
          "Position yourself on the upwind side for maximum warmth",
          "Works well as a signal fire by adding green branches once established"
        ]
      },
      "swedish torch": {
        name: "Swedish Torch (Log Candle)",
        difficulty: "Intermediate",
        time: "15-20 minutes",
        steps: [
          "Find a dry log approximately 12-18 inches in diameter and 2 feet tall",
          "Stand the log upright on a flat, stable surface",
          "Using a saw or hatchet, make 4-6 vertical cuts from the top down, leaving 4-6 inches at the base uncut",
          "The cuts should divide the top of the log into wedge sections like a pie",
          "Pack tinder into the center of the cuts at the top",
          "Add small kindling pieces into the gaps",
          "Light the tinder at the top center",
          "The fire will burn down through the center while air flows up through the cuts",
          "Place a pot or pan directly on top for cooking - the log acts as its own stove"
        ],
        proTips: [
          "One of the best methods for cooking - stable, flat platform on top",
          "Burns for 2-4 hours depending on log size",
          "Works on snow since the log elevates the fire",
          "Can be made with 3 smaller logs bound together if you cannot split one large log"
        ]
      },
      "dakota hole": {
        name: "Dakota Fire Hole",
        difficulty: "Intermediate",
        time: "20-30 minutes",
        steps: [
          "Dig a primary hole about 12 inches in diameter and 12 inches deep",
          "Widen the bottom of the hole slightly to create a bowl shape for the fire",
          "Dig a second smaller hole (6 inches diameter) about 8-10 inches away from the first",
          "Connect the two holes with a tunnel at the bottom (this is the air channel)",
          "The air hole should be on the upwind side so wind feeds the fire",
          "Build a small teepee fire inside the main hole using tinder and kindling",
          "Light the fire and allow it to draw air through the tunnel",
          "Feed the fire with sticks inserted vertically into the main hole",
          "Place a grill grate or green wood across the top for cooking"
        ],
        proTips: [
          "Very efficient burn - uses less wood than surface fires",
          "Nearly smokeless once established due to complete combustion",
          "Low visibility - good for stealth camping or windy conditions",
          "Leaves minimal trace when filled back in"
        ]
      },
      "bow drill": {
        name: "Bow Drill (Friction Fire)",
        difficulty: "Advanced",
        time: "30-60 minutes",
        steps: [
          "Carve a fireboard from soft, dry wood (cedar, willow, poplar) - flat piece about 0.5 inch thick",
          "Carve a spindle from the same or similar wood - 8 inches long, pencil-thick, pointed at top, rounded at bottom",
          "Cut a V-shaped notch in the edge of the fireboard with a small depression next to it",
          "Find a curved, sturdy stick for the bow (about arm's length)",
          "String the bow with paracord, shoelace, or natural cordage - slight slack",
          "Find a hard socket (rock with dimple, hardwood piece, or shell) for the top hand",
          "Wrap the bowstring once around the spindle",
          "Place the spindle in the fireboard depression, socket on top, and begin sawing the bow back and forth",
          "Apply downward pressure with the socket hand while maintaining steady bow strokes",
          "When brown dust fills the notch and smoke appears, carefully transfer the ember to a tinder bundle and blow gently into flame"
        ],
        proTips: [
          "The most critical factor is DRY wood - test by snapping (should break cleanly)",
          "Consistent, long bow strokes are more effective than fast short ones",
          "The notch must be cut to the center of the spindle depression",
          "Practice at home before relying on this in the field"
        ]
      }
    };

    // ===== KNOTS DATABASE =====
    const knots = {
      bowline: {
        name: "Bowline Knot",
        useCase: "Creates a fixed loop that won't slip or bind under load. Used for rescue, hanging bear bags, securing boats, and anchoring tarps.",
        steps: [
          "Form a small loop (the 'rabbit hole') in the standing part of the rope, about 12 inches from the end",
          "Pass the free end (the 'rabbit') up through the loop from underneath",
          "Route the free end around behind the standing part of the rope (around the 'tree')",
          "Pass the free end back down through the same small loop it came up through",
          "Tighten by pulling the free end and the standing part simultaneously",
          "The finished knot should have a fixed loop that does not change size under load"
        ],
        proTips: ["Remember: the rabbit comes out of the hole, goes around the tree, and back down the hole", "Easy to untie even after heavy loading", "One of the most essential knots to know"]
      },
      "clove hitch": {
        name: "Clove Hitch",
        useCase: "Quickly attaches rope to a pole, tree, or post. Used for starting lashings, hanging tarps, and temporary anchoring.",
        steps: [
          "Make a loop by crossing the rope over itself",
          "Make a second loop identical to the first",
          "Place the second loop behind the first",
          "Slide both loops over the post or pole",
          "Pull both ends to tighten",
          "For extra security, add a half hitch with the free end"
        ],
        proTips: ["Quick to tie and untie", "Can slip under variable loading - add half hitches for security", "Works best when load is perpendicular to the pole"]
      },
      "taut-line": {
        name: "Taut-Line Hitch",
        useCase: "Creates an adjustable loop that grips under tension. Perfect for tent guylines, clotheslines, and any line that needs tension adjustment.",
        steps: [
          "Pass the rope around the anchor point (stake, tree, etc.)",
          "Wrap the free end around the standing line twice, working toward the anchor",
          "Make one more wrap around the standing line above the two wraps, working away from the anchor",
          "Pass the free end through the loop created by the last wrap",
          "Tighten the knot by pulling the free end",
          "Slide the knot along the standing line to adjust tension"
        ],
        proTips: ["The key tent knot - adjust guyline tension without retying", "Works only if there is tension on the standing line", "Three wraps total: two inside the loop, one outside"]
      },
      "truckers hitch": {
        name: "Trucker's Hitch",
        useCase: "Provides a 3:1 mechanical advantage for tightening lines. Used for securing loads, tightening ridgelines, and hanging tarps tight.",
        steps: [
          "Tie one end of the rope to a fixed anchor point",
          "Midway along the rope, form a slip knot (directional figure eight or simple loop)",
          "Pass the free end around the second anchor point (e.g., truck tie-down, second tree)",
          "Thread the free end through the loop you created in step 2",
          "Pull down on the free end - the loop acts as a pulley giving you mechanical advantage",
          "While maintaining tension, secure with two half hitches below the loop",
          "Test the tension and adjust if needed"
        ],
        proTips: ["The most powerful tensioning knot you can learn", "Use a slip knot for the mid-line loop so it releases easily", "Combine with a taut-line for ultimate adjustability"]
      },
      "figure eight": {
        name: "Figure Eight Knot",
        useCase: "Strong stopper knot that prevents rope from pulling through a hole or device. Foundation for the figure eight follow-through used in climbing.",
        steps: [
          "Form a loop by crossing the rope over itself",
          "Continue the free end under the standing part",
          "Bring the free end back over and through the original loop",
          "Pull both ends to tighten",
          "The finished knot should look like the number 8",
          "For a loop version: tie the figure eight, then retrace the path with the free end around your anchor"
        ],
        proTips: ["Very strong and easy to inspect visually", "Standard climbing knot for a reason", "Easy to untie even after heavy loading"]
      },
      "sheet bend": {
        name: "Sheet Bend",
        useCase: "Joins two ropes together, especially effective when ropes are different diameters. Used for extending lines, making nets, and joining cordage.",
        steps: [
          "Form a bight (U-shape) in the end of the thicker rope",
          "Pass the thinner rope up through the bight from underneath",
          "Wrap the thinner rope around the back of the bight, going under both parts of the thicker rope",
          "Tuck the thinner rope under itself (but over the bight)",
          "Pull all four ends to tighten",
          "For extra security with slippery rope, use a double sheet bend (repeat the wrap)"
        ],
        proTips: ["Best knot for joining ropes of different sizes", "Both free ends should be on the same side for maximum strength", "Use double sheet bend for critical applications"]
      },
      "square knot": {
        name: "Square Knot (Reef Knot)",
        useCase: "Joins two ropes of equal diameter for non-critical applications. Used for bundling, first aid bandages, and tying packages.",
        steps: [
          "Hold one rope end in each hand",
          "Cross right over left and tuck under",
          "Now cross left over right and tuck under",
          "Pull both ends to tighten",
          "The finished knot should be symmetric - two interlocking loops",
          "If it looks twisted, you have a granny knot - untie and try again"
        ],
        proTips: ["Remember: right over left, then left over right", "NOT for critical loads - can slip or capsize under strain", "Add a backup half hitch on each side for security", "Easy to check: the knot lies flat when correct"]
      },
      "timber hitch": {
        name: "Timber Hitch",
        useCase: "Grips a log or pole for dragging. Used for moving timber, starting lashings, and pulling heavy cylindrical objects.",
        steps: [
          "Pass the rope around the log or pole",
          "Bring the free end around the standing part of the rope",
          "Twist the free end around itself 3-4 times (around the part of the rope touching the log)",
          "Pull on the standing end to tighten",
          "The twists will grip tighter as more load is applied",
          "For dragging, add a half hitch further along the log for directional control"
        ],
        proTips: ["The more you pull, the tighter it grips", "Releases instantly when tension is released", "Add a half hitch near the leading end when dragging for better control"]
      }
    };

    // ===== COOKING DATABASE =====
    const cookingMethods = {
      "foil packets": {
        name: "Foil Packet Cooking",
        difficulty: "Beginner",
        steps: [
          "Tear off two sheets of heavy-duty aluminum foil (about 18 inches each)",
          "Layer the sheets on top of each other for extra strength",
          "Place your protein (meat, fish, or tofu) in the center",
          "Add chopped vegetables, seasonings, and a tablespoon of oil or butter",
          "Fold the foil: bring the long edges together and fold down in half-inch folds",
          "Fold and crimp both short ends tightly to seal",
          "Place on hot coals (not in flame) or on a grill grate over the fire",
          "Cook for 15-25 minutes depending on contents, flipping once halfway",
          "Open carefully - steam will escape and can burn",
          "Let rest 2-3 minutes before eating directly from the foil"
        ],
        proTips: ["Double-wrap to prevent leaks and burning", "Add a splash of liquid (broth, soy sauce, lemon juice) for steam cooking", "Pre-chop ingredients at home and store in zip bags for easy assembly"]
      },
      "dutch oven": {
        name: "Dutch Oven Cooking",
        difficulty: "Intermediate",
        steps: [
          "Season your dutch oven before the trip if it is new cast iron",
          "Build a fire and create a good bed of hot coals (30-45 minutes)",
          "For baking: place coals on the lid and underneath in a 2:1 ratio (top to bottom)",
          "For simmering/stewing: place most coals underneath with few on top",
          "Use a coal count guide: for 350F in a 12-inch oven, about 24 total coals",
          "Line with parchment paper for easy cleanup when baking",
          "Check food every 15-20 minutes, rotating the oven and lid 90 degrees each time",
          "Use a lid lifter to safely check contents",
          "Add fresh coals every 30-45 minutes to maintain temperature",
          "Clean while still warm using hot water and a scraper - no soap on cast iron"
        ],
        proTips: ["A 12-inch dutch oven is the most versatile size for camp cooking", "Charcoal briquettes give more consistent heat than campfire coals", "You can bake bread, pizza, cobbler, and casseroles with a dutch oven"]
      },
      "campfire grill": {
        name: "Campfire Grill Cooking",
        difficulty: "Beginner",
        steps: [
          "Build your fire and let it burn down to hot coals (white-grey coals are hottest)",
          "Set up your grill grate on rocks or a camp grill stand 4-6 inches above the coals",
          "Oil the grate lightly to prevent sticking",
          "For direct heat: place food directly over the coals for searing and quick cooking",
          "For indirect heat: push coals to one side and cook on the other for slower cooking",
          "Use long-handled tongs and a spatula to manage food safely",
          "Cook meats to safe internal temperatures (165F poultry, 145F beef/pork, 145F fish)",
          "Let meats rest 5 minutes after removing from heat",
          "Keep a water spray bottle handy for flare-ups"
        ],
        proTips: ["The hand test: hold your hand 4 inches above coals - 2 seconds is hot, 4 seconds is medium, 6 seconds is low", "Hardwood coals last longer and burn hotter than softwood", "Marinate meats in zip bags before your trip for maximum flavor"]
      },
      "no-cook meals": {
        name: "No-Cook Meals",
        difficulty: "Beginner",
        steps: [
          "Plan meals that require zero cooking for simplicity and speed",
          "Wraps and tortillas: fill with nut butter, honey, banana, or deli meat and cheese",
          "Trail mix and energy bars provide calorie-dense snacking",
          "Cold-soak meals: add cold water to instant oatmeal, couscous, or ramen and wait 15-30 minutes",
          "Fresh foods for day one: hard cheeses, salami, apples, carrots, and hummus",
          "Overnight oats: combine oats, powdered milk, chia seeds, and water in a jar the night before",
          "Tuna or chicken packets with crackers and mustard make a filling lunch",
          "Dehydrated meals can be rehydrated with cold water (takes 2x longer than hot)",
          "Dried fruit, nuts, and jerky are lightweight, nutritious, and need no preparation"
        ],
        proTips: ["Perfect for ultralight backpacking or fire-ban areas", "Pre-package meals in individual zip bags labeled by day", "Cold soaking works best with small-grain foods", "Always pack out all food waste and packaging"]
      },
      "camp stove": {
        name: "Camp Stove Cooking",
        difficulty: "Beginner",
        steps: [
          "Set up the stove on a flat, stable, non-flammable surface away from the tent",
          "For canister stoves: attach the fuel canister to the stove head (hand-tight)",
          "For liquid fuel stoves: pressurize the fuel bottle and connect the fuel line",
          "Open the valve slightly and ignite with a lighter or built-in piezo igniter",
          "Adjust the flame to desired level - blue flame is most efficient",
          "Use a windscreen to improve efficiency (NOT with canister stoves - overheating risk)",
          "Place pot or pan on the stove with a stable base",
          "Water boils in 3-5 minutes for most backpacking stoves",
          "Turn off the stove by closing the fuel valve completely",
          "Allow the stove to cool before disassembling and packing"
        ],
        proTips: ["Canister stoves are simplest for beginners", "In cold weather, keep fuel canisters warm in your sleeping bag", "Use a lid on your pot to boil water 30% faster", "Carry a lightweight pot gripper if your cookset does not have handles"]
      }
    };

    // ===== WILDLIFE DATABASE =====
    const wildlife = {
      bear: {
        name: "Bear Safety",
        prevention: [
          "Store food in bear canisters or hang in bear bags 200+ feet from camp, 10+ feet high, 4+ feet from trunk",
          "Cook and eat 200 feet downwind from your sleeping area",
          "Never keep food, toiletries, or scented items in your tent",
          "Make noise while hiking: talk, clap, or use bear bells in dense vegetation",
          "Hike in groups of 3 or more when possible",
          "Carry bear spray and know how to use it (practice drawing it)"
        ],
        encounter: [
          "Stay calm. Do NOT run - bears can run 35 mph",
          "Make yourself look large: raise arms, stand on a rock",
          "Speak in a calm, firm voice so the bear knows you are human",
          "Back away slowly while facing the bear",
          "BLACK BEAR attack: fight back aggressively targeting nose and eyes",
          "GRIZZLY BEAR attack: play dead - lie face down, hands behind neck, spread legs, do not move until bear leaves",
          "If a bear enters your tent at night: fight back regardless of species - this is predatory behavior",
          "Use bear spray when bear is within 20-30 feet, aiming slightly downward"
        ]
      },
      snake: {
        name: "Snake Safety",
        prevention: [
          "Watch where you step and place your hands, especially on warm rocks and logs",
          "Wear ankle-high boots and long pants in snake territory",
          "Use a flashlight at night - many snakes are nocturnal",
          "Stay on established trails and avoid tall grass when possible",
          "Check shoes, sleeping bags, and packs before use in the morning",
          "Do not reach into rock crevices, hollow logs, or dense brush blindly"
        ],
        encounter: [
          "Freeze when you first spot a snake, then slowly back away",
          "Give the snake at least 6 feet of clearance",
          "Do NOT attempt to handle, poke, or kill the snake",
          "If bitten: stay calm, remove jewelry/watches, and seek immediate medical help",
          "Do NOT apply a tourniquet, cut the wound, or suck out venom",
          "Take a photo of the snake from a safe distance for ID purposes"
        ]
      },
      "mountain lion": {
        name: "Mountain Lion Safety",
        prevention: [
          "Hike in groups and make noise on the trail",
          "Keep children close and within sight at all times",
          "Avoid hiking at dawn, dusk, and nighttime when mountain lions are most active",
          "Do not approach dead animals (potential mountain lion cache)",
          "Be alert in areas with dense brush, rock outcroppings, and ravines"
        ],
        encounter: [
          "Do NOT run - this triggers the chase instinct",
          "Make yourself look as large as possible: raise arms, open jacket wide",
          "Maintain eye contact and face the animal",
          "Speak firmly and loudly",
          "Throw rocks, sticks, or whatever is available if it approaches",
          "If attacked: FIGHT BACK aggressively - mountain lion attacks are predatory",
          "Protect your neck and throat - this is their target",
          "Use bear spray, trekking poles, or any weapon available"
        ]
      },
      moose: {
        name: "Moose Safety",
        prevention: [
          "Give moose a wide berth - at least 75 feet (25 yards)",
          "Be especially cautious around cows with calves (spring/summer) and bulls in rut (fall)",
          "Watch for signs of agitation: laid-back ears, raised hackles, licking lips, stomping feet",
          "Moose have poor eyesight - make noise so they know you are there",
          "Do not get between a cow and her calf"
        ],
        encounter: [
          "Back away slowly and try to put a large object (tree, car, building) between you and the moose",
          "If a moose charges: RUN - unlike bears, running from moose is recommended",
          "Get behind a tree or large obstacle - moose have difficulty changing direction quickly",
          "If knocked down: curl into a ball, protect your head and neck, and do not move until the moose retreats",
          "Moose will often bluff charge and stop short - still take cover"
        ]
      },
      insects: {
        name: "Insect Safety",
        prevention: [
          "Use EPA-registered insect repellent containing DEET (20-30%), picaridin, or oil of lemon eucalyptus",
          "Treat clothing and gear with permethrin before your trip",
          "Wear long sleeves and pants, especially at dawn and dusk when mosquitoes are most active",
          "Sleep in a tent with intact mesh or use a mosquito net",
          "Avoid wearing dark colors and floral scents that attract insects",
          "Set up camp away from standing water sources"
        ],
        encounter: [
          "For tick removal: use fine-tipped tweezers, grasp as close to skin as possible, pull straight up steadily",
          "Save removed ticks in a sealed bag for identification if symptoms develop",
          "For bee stings: scrape out stinger with a flat edge, apply cold compress, take antihistamine",
          "Watch for signs of anaphylaxis: difficulty breathing, swelling of face/throat, dizziness",
          "For chiggers: wash thoroughly with soap and water, apply anti-itch cream",
          "Check your entire body for ticks at the end of every day in tick country"
        ]
      },
      raccoon: {
        name: "Raccoon Safety",
        prevention: [
          "Store all food in sealed hard-sided containers, never in plastic bags alone",
          "Hang food or use animal-proof containers",
          "Clean up all food scraps and crumbs from your campsite",
          "Keep trash in sealed containers and pack out all waste",
          "Do not leave coolers unattended - raccoons can open them",
          "Close and zip your tent when not inside"
        ],
        encounter: [
          "Do not approach or feed raccoons - they can carry rabies and other diseases",
          "Make loud noises to scare them away from your campsite",
          "Bang pots together or shine a bright flashlight at them",
          "If a raccoon is acting unusually aggressive or appears sick (stumbling, drooling), leave the area and report to rangers",
          "If bitten or scratched: wash the wound thoroughly and seek immediate medical attention for possible rabies exposure"
        ]
      }
    };

    // ===== GEAR CHECKLIST =====
    const gearChecklists = {
      beginner: {
        title: "WEEKEND CAR CAMPING GEAR CHECKLIST",
        categories: {
          "Shelter": ["Tent with rainfly and footprint", "Sleeping bag (rated for expected temps)", "Sleeping pad or air mattress", "Pillow or stuff sack with clothes", "Extra tarp for shade/rain cover"],
          "Clothing": ["Moisture-wicking base layers", "Insulating mid layer (fleece or down)", "Waterproof rain jacket", "Hiking boots or sturdy shoes", "Extra socks (wool or synthetic)", "Hat (sun and/or warm)", "Sunglasses"],
          "Cooking": ["Camp stove and fuel", "Lighter and backup matches (waterproof)", "Pots/pans and cooking utensils", "Plates, bowls, cups, and eating utensils", "Cooler with ice", "Food and snacks", "Water bottles (2 liters minimum)", "Trash bags", "Dish soap and sponge"],
          "Safety": ["First aid kit", "Headlamp with extra batteries", "Sunscreen SPF 30+", "Insect repellent", "Map of the area", "Emergency whistle", "Multi-tool or knife"],
          "Comfort": ["Camp chairs", "Lantern", "Fire starter and firewood", "Toiletries and toilet paper", "Hand sanitizer", "Towel"]
        }
      },
      intermediate: {
        title: "MULTI-DAY BACKPACKING GEAR CHECKLIST",
        categories: {
          "Shelter": ["Lightweight tent or hammock system", "Sleeping bag rated 10F below expected lows", "Insulated sleeping pad (R-value 3+)", "Tent footprint or ground sheet"],
          "Clothing": ["Moisture-wicking base layers (top and bottom)", "Insulating layer (down or synthetic puffy)", "Waterproof/breathable rain shell", "Rain pants", "Hiking boots (broken in)", "3 pairs wool hiking socks", "Warm hat and sun hat", "Gloves", "Gaiters if needed"],
          "Cooking": ["Backpacking stove and fuel canister", "Lightweight pot (700ml-1L)", "Spork and pocket knife", "Lighter and waterproof matches", "Water filter or purification tablets", "Water bottles/bladder (3L capacity)", "Dehydrated meals", "Snacks (trail mix, bars, jerky)"],
          "Navigation": ["Topographic map", "Compass", "GPS device or phone with offline maps", "Route description/guidebook"],
          "Safety": ["First aid kit (lightweight)", "Headlamp with extra batteries", "Emergency bivy or space blanket", "Whistle", "Bear spray (if in bear country)", "Bear canister or bear bag with cord", "Sunscreen and lip balm with SPF", "Insect repellent"],
          "Repair/Tools": ["Duct tape (wrapped around water bottle)", "Gear repair patches", "Needle and thread", "Extra cord (50 feet of paracord)", "Trekking poles"]
        }
      },
      advanced: {
        title: "WINTER/ALPINE EXPEDITION GEAR CHECKLIST",
        categories: {
          "Shelter": ["4-season tent rated for high winds", "Winter sleeping bag (-20F or lower)", "Insulated sleeping pad (R-value 5+)", "Tent footprint", "Snow stakes and deadman anchors"],
          "Clothing": ["Merino wool base layers (top and bottom)", "Mid-weight insulating layer", "Heavy insulating puffy (800+ fill down or equivalent)", "Hardshell waterproof jacket and pants", "Softshell for active movement", "Insulated boots rated for expected temps", "Vapor barrier liner socks", "Heavy wool or synthetic socks (4 pairs)", "Balaclava", "Insulated hat", "Liner gloves + insulated gloves + shell mitts", "Gaiters", "Goggles and glacier glasses"],
          "Technical Gear": ["Ice axe", "Crampons", "Avalanche beacon, probe, and shovel", "Climbing harness (if needed)", "Carabiners and webbing", "Snow pickets", "Altimeter watch"],
          "Cooking": ["Cold-weather stove (liquid fuel recommended)", "Insulated fuel canister cover", "Insulated mug and pot", "Thermos", "High-calorie foods (4000+ calories/day)", "Hot drink mixes", "Water bottles in insulated sleeves"],
          "Navigation & Safety": ["Map and compass", "GPS with extra batteries (kept warm)", "Satellite communicator (InReach or similar)", "First aid kit with cold injury supplies", "Headlamp with lithium batteries", "Emergency shelter", "Fire starting kit (multiple methods)", "Repair kit (pole splint, duct tape, sewing kit)"]
        }
      }
    };

    // ===== WATER PURIFICATION =====
    const waterMethods = {
      boiling: {
        name: "Boiling",
        difficulty: "Beginner",
        steps: [
          "Collect water from the clearest source available (moving water preferred over stagnant)",
          "If water is cloudy, pre-filter through a bandana or coffee filter",
          "Bring water to a rolling boil",
          "Maintain the rolling boil for at least 1 minute",
          "At elevations above 6,500 feet, boil for 3 minutes",
          "Let the water cool before drinking",
          "Transfer to a clean container"
        ],
        proTips: ["Most reliable method - kills all pathogens", "Uses fuel which adds weight for backpacking", "Water may taste flat - pour between containers to aerate"]
      },
      filter: {
        name: "Water Filter (Pump or Squeeze)",
        difficulty: "Beginner",
        steps: [
          "Collect water from the clearest available source",
          "Pre-filter through a bandana if water has visible debris",
          "For pump filters: attach intake hose to the filter and place in water source",
          "Pump the handle to draw water through the filter into your clean container",
          "For squeeze filters: fill the dirty water bag, attach the filter, and squeeze water through",
          "Check filter flow rate - slow flow means it needs backflushing or replacement",
          "Store filter protected from freezing which can damage the element"
        ],
        proTips: ["Filters remove bacteria and protozoa but most do NOT remove viruses", "Backflush regularly to maintain flow rate", "Carry a backup purification method", "Sawyer Squeeze and Katadyn BeFree are popular ultralight options"]
      },
      chemical: {
        name: "Chemical Treatment (Tablets/Drops)",
        difficulty: "Beginner",
        steps: [
          "Collect and pre-filter water if cloudy",
          "For iodine tablets: add specified number of tablets per liter of water",
          "For chlorine dioxide (Aquamira): mix Part A and Part B, wait 5 minutes, add to water",
          "For Potable Aqua: add 2 tablets per liter",
          "Screw cap on loosely and turn bottle upside down to let treated water flush the threads",
          "Wait the required time: 30 minutes for most tablets, 4 hours for Cryptosporidium treatment",
          "Water is now safe to drink"
        ],
        proTips: ["Lightweight and good as a backup method", "Cold water requires longer treatment times", "Iodine gives water a taste - neutralizer tablets help", "Chlorine dioxide (Aquamira) has the least taste impact"]
      },
      uv: {
        name: "UV Light Treatment (SteriPEN)",
        difficulty: "Intermediate",
        steps: [
          "Collect water and pre-filter to remove particulates (UV cannot work in cloudy water)",
          "Fill a compatible wide-mouth water bottle (must be clear, not opaque)",
          "Turn on the UV device and submerge the lamp in the water",
          "Stir slowly for the indicated time (usually 60-90 seconds per liter)",
          "The device will indicate when treatment is complete",
          "Water is now safe to drink immediately - no wait time"
        ],
        proTips: ["Fast and effective against all pathogens including viruses", "Requires batteries or rechargeable power", "Does not work in murky water - pre-filter first", "Carry a backup method in case of device failure or dead batteries"]
      }
    };

    // ===== NAVIGATION =====
    const navigationGuides = {
      compass: {
        name: "Compass Navigation",
        steps: [
          "Hold the compass flat in your hand at waist level",
          "The red needle always points to magnetic north",
          "To take a bearing: point the direction-of-travel arrow at your target",
          "Rotate the bezel until the orienting arrow aligns with the red (north) needle",
          "Read the bearing number at the index line - this is your bearing in degrees",
          "To follow a bearing: set the desired degrees at the index line",
          "Hold the compass flat and rotate your body until the red needle aligns with the orienting arrow",
          "Walk in the direction the travel arrow points",
          "Account for magnetic declination: adjust the bezel by the local declination value",
          "Re-check your bearing every 100 yards to stay on course"
        ],
        proTips: ["Learn your local magnetic declination and set it on your compass", "Take a back bearing (180 degrees opposite) to verify your line", "Practice in familiar areas before relying on compass in the wild"]
      },
      "natural navigation": {
        name: "Natural Navigation (Without Instruments)",
        steps: [
          "SUN METHOD: The sun rises roughly in the east and sets roughly in the west",
          "SHADOW STICK: Plant a stick in the ground, mark the tip of its shadow, wait 15 minutes, mark again. A line between the marks runs roughly east-west (first mark is west)",
          "WATCH METHOD: In the Northern Hemisphere, point the hour hand at the sun. South is halfway between the hour hand and 12 o'clock",
          "NORTH STAR: Find the Big Dipper, follow the two pointer stars 5x their distance to Polaris (North Star). It indicates true north.",
          "SOUTHERN CROSS: In the Southern Hemisphere, extend the long axis of the Southern Cross 4.5x its length to find the south celestial pole",
          "MOSS: Moss tends to grow on the north side of trees in the Northern Hemisphere (less reliable but can confirm other methods)",
          "VEGETATION: In the Northern Hemisphere, south-facing slopes tend to be drier with less vegetation",
          "WIND: Learn prevailing wind patterns in your area - they can help confirm direction"
        ],
        proTips: ["Use multiple natural methods to cross-check", "These methods give approximate direction only", "Always carry a proper compass as your primary tool"]
      },
      "map reading": {
        name: "Map Reading Basics",
        steps: [
          "Orient the map: align the map's north with actual north using your compass",
          "Identify your current position using landmarks, trail junctions, or GPS coordinates",
          "Understand contour lines: each line represents a specific elevation. Close lines = steep terrain, wide spacing = gentle slopes",
          "Read the contour interval from the map legend (often 40 feet on USGS maps)",
          "Identify features: ridges (V-shapes pointing downhill), valleys (V-shapes pointing uphill), saddles (hourglass shapes between peaks)",
          "Measure distance using the map scale bar - a piece of string along your route helps",
          "Plan your route considering elevation gain, terrain difficulty, and water sources",
          "Take bearings from the map: align compass edge between two points, rotate bezel to north on map, then follow the bearing in the field",
          "Track your progress by identifying checkpoints along the route",
          "Always know your escape routes in case conditions change"
        ],
        proTips: ["Laminate your map or carry it in a waterproof case", "Mark water sources, campsites, and bail-out points before your trip", "1 inch on a 1:24000 USGS map equals 2000 feet on the ground"]
      }
    };

    // ===== HANDLER =====

    function getSkillNote(skillLevel, difficulty) {
      if (skillLevel === "beginner" && (difficulty === "Intermediate" || difficulty === "Advanced")) {
        return `\n\nNOTE: This technique is rated ${difficulty}. As a beginner, consider starting with an easier method first, or practice this technique in a safe environment before relying on it in the field.`;
      }
      if (skillLevel === "advanced") {
        return "\n\nADVANCED NOTE: You may already know the basics. Focus on efficiency, speed, and adapting this technique to adverse conditions.";
      }
      return "";
    }

    if (topic === "tent") {
      if (!subtopic) {
        const available = Object.keys(tents).map(k => `${k} (${tents[k].difficulty})`).join(", ");
        return JSON.stringify({ result: `TENT PITCHING GUIDES\n\nAvailable tent types: ${available}\n\nProvide a subtopic (e.g., "dome", "hammock", "tarp") for detailed step-by-step instructions.` });
      }
      const tent = tents[subtopic];
      if (!tent) {
        const available = Object.keys(tents).join(", ");
        return JSON.stringify({ error: `Unknown tent type: '${subtopic}'. Available: ${available}` });
      }
      let output = `TENT PITCHING GUIDE: ${tent.name}`;
      output += `\n\nDifficulty: ${tent.difficulty}`;
      output += `\nEstimated Time: ${tent.time}`;
      output += getSkillNote(skillLevel, tent.difficulty);
      output += "\n\nSteps:";
      tent.steps.forEach((s, i) => { output += `\n${i + 1}. ${s}`; });
      output += "\n\nPro Tips:";
      tent.proTips.forEach(t => { output += `\n- ${t}`; });
      if (tent.safetyWarnings) {
        output += "\n\nSafety Warnings:";
        tent.safetyWarnings.forEach(w => { output += `\n! ${w}`; });
      }
      return JSON.stringify({ result: output });
    }

    if (topic === "fire") {
      if (!subtopic) {
        const available = Object.keys(fireMethods).map(k => `${k} (${fireMethods[k].difficulty})`).join(", ");
        return JSON.stringify({ result: `FIRE BUILDING GUIDES\n\nAvailable methods: ${available}\n\nProvide a subtopic (e.g., "teepee", "log cabin", "bow drill") for detailed instructions.` });
      }
      const method = fireMethods[subtopic];
      if (!method) {
        const available = Object.keys(fireMethods).join(", ");
        return JSON.stringify({ error: `Unknown fire method: '${subtopic}'. Available: ${available}` });
      }
      let output = `FIRE BUILDING GUIDE: ${method.name}`;
      output += `\n\nDifficulty: ${method.difficulty}`;
      output += `\nEstimated Time: ${method.time}`;
      output += getSkillNote(skillLevel, method.difficulty);
      output += "\n\nSteps:";
      method.steps.forEach((s, i) => { output += `\n${i + 1}. ${s}`; });
      output += "\n\nPro Tips:";
      method.proTips.forEach(t => { output += `\n- ${t}`; });
      output += "\n\nSafety: Always follow local fire regulations. Keep water or dirt nearby to extinguish. Never leave a fire unattended. Fully extinguish before leaving (drown, stir, feel for heat).";
      return JSON.stringify({ result: output });
    }

    if (topic === "knots") {
      if (!subtopic) {
        const available = Object.keys(knots).map(k => `${k} - ${knots[k].useCase.split('.')[0]}`).join("\n  ");
        return JSON.stringify({ result: `KNOT TYING GUIDES\n\nAvailable knots:\n  ${available}\n\nProvide a subtopic (e.g., "bowline", "clove hitch") for detailed tying instructions.` });
      }
      const knot = knots[subtopic];
      if (!knot) {
        const available = Object.keys(knots).join(", ");
        return JSON.stringify({ error: `Unknown knot: '${subtopic}'. Available: ${available}` });
      }
      let output = `KNOT TYING GUIDE: ${knot.name}`;
      output += `\n\nUse Case: ${knot.useCase}`;
      output += "\n\nSteps:";
      knot.steps.forEach((s, i) => { output += `\n${i + 1}. ${s}`; });
      output += "\n\nPro Tips:";
      knot.proTips.forEach(t => { output += `\n- ${t}`; });
      return JSON.stringify({ result: output });
    }

    if (topic === "cooking") {
      if (!subtopic) {
        const available = Object.keys(cookingMethods).map(k => `${k} (${cookingMethods[k].difficulty})`).join(", ");
        return JSON.stringify({ result: `CAMP COOKING GUIDES\n\nAvailable methods: ${available}\n\nProvide a subtopic (e.g., "foil packets", "dutch oven", "camp stove") for detailed instructions.` });
      }
      const method = cookingMethods[subtopic];
      if (!method) {
        const available = Object.keys(cookingMethods).join(", ");
        return JSON.stringify({ error: `Unknown cooking method: '${subtopic}'. Available: ${available}` });
      }
      let output = `CAMP COOKING GUIDE: ${method.name}`;
      output += `\n\nDifficulty: ${method.difficulty}`;
      output += getSkillNote(skillLevel, method.difficulty);
      output += "\n\nSteps:";
      method.steps.forEach((s, i) => { output += `\n${i + 1}. ${s}`; });
      output += "\n\nPro Tips:";
      method.proTips.forEach(t => { output += `\n- ${t}`; });
      output += "\n\nFood Safety: Always wash hands before handling food. Cook meats to safe internal temperatures. Store food properly to prevent spoilage and animal encounters.";
      return JSON.stringify({ result: output });
    }

    if (topic === "wildlife") {
      if (!subtopic) {
        const available = Object.keys(wildlife).join(", ");
        return JSON.stringify({ result: `WILDLIFE SAFETY GUIDES\n\nAvailable animals: ${available}\n\nProvide a subtopic (e.g., "bear", "snake", "mountain lion") for prevention and encounter guidance.` });
      }
      const animal = wildlife[subtopic];
      if (!animal) {
        const available = Object.keys(wildlife).join(", ");
        return JSON.stringify({ error: `Unknown wildlife type: '${subtopic}'. Available: ${available}` });
      }
      let output = `WILDLIFE SAFETY: ${animal.name}`;
      output += "\n\nPrevention:";
      animal.prevention.forEach((p, i) => { output += `\n${i + 1}. ${p}`; });
      output += "\n\nIf You Encounter One:";
      animal.encounter.forEach((e, i) => { output += `\n${i + 1}. ${e}`; });
      return JSON.stringify({ result: output });
    }

    if (topic === "gear_checklist") {
      const level = subtopic || skillLevel;
      const checklist = gearChecklists[level];
      if (!checklist) {
        return JSON.stringify({ result: `GEAR CHECKLISTS\n\nAvailable checklists:\n- beginner: Weekend car camping\n- intermediate: Multi-day backpacking\n- advanced: Winter/alpine expedition\n\nProvide a subtopic or skill_level (e.g., "beginner", "intermediate", "advanced") to get the full checklist.` });
      }
      let output = checklist.title;
      for (const [category, items] of Object.entries(checklist.categories)) {
        output += `\n\n[${category.toUpperCase()}]`;
        items.forEach(item => { output += `\n  [ ] ${item}`; });
      }
      output += "\n\nTIP: Customize this list based on your specific trip conditions, duration, and personal needs.";
      return JSON.stringify({ result: output });
    }

    if (topic === "water") {
      if (!subtopic) {
        const available = Object.keys(waterMethods).map(k => `${k} (${waterMethods[k].difficulty})`).join(", ");
        return JSON.stringify({ result: `WATER PURIFICATION GUIDES\n\nAvailable methods: ${available}\n\nProvide a subtopic (e.g., "boiling", "filter", "chemical", "uv") for detailed instructions.\n\nIMPORTANT: Never drink untreated water from natural sources. Even clear mountain streams can contain Giardia, Cryptosporidium, and harmful bacteria.` });
      }
      const method = waterMethods[subtopic];
      if (!method) {
        const available = Object.keys(waterMethods).join(", ");
        return JSON.stringify({ error: `Unknown water purification method: '${subtopic}'. Available: ${available}` });
      }
      let output = `WATER PURIFICATION: ${method.name}`;
      output += `\n\nDifficulty: ${method.difficulty}`;
      output += getSkillNote(skillLevel, method.difficulty);
      output += "\n\nSteps:";
      method.steps.forEach((s, i) => { output += `\n${i + 1}. ${s}`; });
      output += "\n\nPro Tips:";
      method.proTips.forEach(t => { output += `\n- ${t}`; });
      output += "\n\nWARNING: Always purify water from natural sources. Waterborne illness can be debilitating in the backcountry.";
      return JSON.stringify({ result: output });
    }

    if (topic === "navigation") {
      if (!subtopic) {
        const available = Object.keys(navigationGuides).join(", ");
        return JSON.stringify({ result: `NAVIGATION GUIDES\n\nAvailable topics: ${available}\n\nProvide a subtopic (e.g., "compass", "natural navigation", "map reading") for detailed instructions.` });
      }
      const guide = navigationGuides[subtopic];
      if (!guide) {
        const available = Object.keys(navigationGuides).join(", ");
        return JSON.stringify({ error: `Unknown navigation topic: '${subtopic}'. Available: ${available}` });
      }
      let output = `NAVIGATION GUIDE: ${guide.name}`;
      output += "\n\nSteps:";
      guide.steps.forEach((s, i) => { output += `\n${i + 1}. ${s}`; });
      output += "\n\nPro Tips:";
      guide.proTips.forEach(t => { output += `\n- ${t}`; });
      return JSON.stringify({ result: output });
    }

    return JSON.stringify({ error: `Unknown topic: '${topic}'. Must be one of: tent, fire, knots, cooking, wildlife, gear_checklist, water, navigation` });

  } catch (e) {
    console.error(e);
    return JSON.stringify({ error: `Camping companion error: ${e.message}` });
  }
};
