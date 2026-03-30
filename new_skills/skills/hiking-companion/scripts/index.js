window['ai_edge_gallery_get_result'] = async (data) => {
  try {
    const jsonData = JSON.parse(data);
    const queryType = jsonData.query_type;

    if (!queryType) {
      return JSON.stringify({ error: "query_type is required. Must be one of: plant_id, weather, first_aid, trail_safety, general_tip" });
    }

    // ===== PLANT DATABASE =====
    const plants = [
      {
        name: "Poison Ivy",
        scientific: "Toxicodendron radicans",
        danger: "HIGH",
        keywords: ["three", "leaves", "shiny", "glossy", "vine", "cluster", "red", "autumn", "hairy", "rope", "urushiol", "itch", "rash", "leaflets"],
        features: "Three shiny leaflets per leaf group. Leaves may be glossy or dull. Vine has hairy aerial roots. Turns red in autumn. Found as ground cover, shrub, or climbing vine.",
        regions: "Eastern North America, Midwest, South",
        firstAid: "Wash skin immediately with soap and cool water. Apply rubbing alcohol or specialized poison ivy wash. Use calamine lotion or hydrocortisone cream. Seek medical help if rash is severe or near eyes.",
        lookalikes: ["Box Elder seedlings", "Virginia Creeper (5 leaves)", "Blackberry"]
      },
      {
        name: "Poison Oak",
        scientific: "Toxicodendron diversilobum",
        danger: "HIGH",
        keywords: ["three", "oak", "lobed", "leaves", "fuzzy", "shrub", "white", "berries", "rounded", "scalloped", "rash", "itch"],
        features: "Three rounded, lobed leaflets resembling oak leaves. Can grow as shrub or vine. White or tan berries. Leaves may be fuzzy underneath.",
        regions: "Western North America, Southeast US",
        firstAid: "Wash affected area with soap and cool water within 10 minutes. Remove contaminated clothing. Apply calamine lotion. Take oral antihistamines for itching.",
        lookalikes: ["True Oak seedlings", "Blackberry"]
      },
      {
        name: "Poison Hemlock",
        scientific: "Conium maculatum",
        danger: "DEADLY",
        keywords: ["purple", "spots", "stem", "spotted", "umbrella", "white", "flowers", "carrot", "fern", "musty", "smell", "hollow", "tall", "parsley"],
        features: "Tall plant (3-10 ft) with hollow purple-spotted stems. White umbrella-shaped flower clusters. Fern-like leaves. Musty, unpleasant smell when crushed. Resembles wild carrot or parsley.",
        regions: "Throughout North America, Europe",
        firstAid: "Do NOT induce vomiting. Call Poison Control (1-800-222-1222) immediately. Seek emergency medical care. Can cause respiratory failure and death.",
        lookalikes: ["Wild Carrot (Queen Anne's Lace)", "Wild Parsley", "Fennel"]
      },
      {
        name: "Giant Hogweed",
        scientific: "Heracleum mantegazzianum",
        danger: "SEVERE",
        keywords: ["giant", "huge", "large", "umbrella", "white", "flowers", "burns", "blisters", "sap", "tall", "purple", "blotches", "stem", "hairy"],
        features: "Enormous plant up to 14 feet tall. Thick stems with purple blotches and coarse white hairs. White umbrella flower clusters up to 2.5 feet across. Sap causes severe photosensitive burns.",
        regions: "Northeast US, Pacific Northwest, Canada, Europe",
        firstAid: "Avoid sunlight on affected skin immediately. Wash with soap and cold water. Cover affected area from UV light. Seek medical attention. Burns can cause permanent scarring.",
        lookalikes: ["Cow Parsnip", "Queen Anne's Lace", "Angelica"]
      },
      {
        name: "Deadly Nightshade",
        scientific: "Atropa belladonna",
        danger: "DEADLY",
        keywords: ["black", "berries", "purple", "bell", "flowers", "shiny", "cherry", "sweet", "oval", "leaves", "nightshade", "belladonna"],
        features: "Branching plant 2-5 feet tall. Dull green oval leaves. Bell-shaped purple-brown flowers. Shiny black berries resembling cherries. All parts extremely toxic.",
        regions: "Europe, North Africa, Western Asia, naturalized in parts of North America",
        firstAid: "Call Poison Control immediately. Do NOT induce vomiting. Seek emergency medical care. Even small amounts of berries can be fatal to children.",
        lookalikes: ["Blueberries", "Black Nightshade (less toxic)", "Huckleberries"]
      },
      {
        name: "Water Hemlock",
        scientific: "Cicuta maculata",
        danger: "DEADLY",
        keywords: ["water", "wet", "stream", "marsh", "swamp", "white", "flowers", "umbrella", "purple", "streaked", "chambers", "hollow", "root", "yellow", "sap"],
        features: "Found near water. 3-6 feet tall. Hollow stem with purple streaks. White umbrella flower clusters. Root has distinct chambers with yellowish sap. Most violently toxic plant in North America.",
        regions: "Throughout North America near water sources",
        firstAid: "Call 911 immediately. Can cause seizures within 15-30 minutes of ingestion. Do NOT induce vomiting. Keep patient calm and still.",
        lookalikes: ["Wild Parsnip", "Water Parsley", "Elderflower"]
      },
      {
        name: "Foxglove",
        scientific: "Digitalis purpurea",
        danger: "DEADLY",
        keywords: ["purple", "pink", "bell", "tubular", "flowers", "spotted", "tall", "spike", "fuzzy", "leaves", "drooping", "thimble", "finger"],
        features: "Tall spike of tubular bell-shaped flowers, typically purple or pink with spotted interiors. Soft fuzzy leaves in basal rosette first year. Flowers appear second year on 2-5 foot stalks.",
        regions: "Europe, naturalized in North America, Pacific Northwest",
        firstAid: "Call Poison Control immediately. Contains cardiac glycosides affecting heart rhythm. Seek emergency medical care. Do NOT induce vomiting.",
        lookalikes: ["Comfrey", "Mullein (before flowering)"]
      },
      {
        name: "Oleander",
        scientific: "Nerium oleander",
        danger: "DEADLY",
        keywords: ["pink", "white", "red", "flowers", "evergreen", "shrub", "leathery", "narrow", "leaves", "tropical", "ornamental", "fragrant"],
        features: "Evergreen shrub or small tree. Narrow leathery dark green leaves. Clusters of fragrant pink, white, or red flowers. All parts are extremely toxic including smoke from burning.",
        regions: "Southern US, Mediterranean, tropical and subtropical regions",
        firstAid: "Call Poison Control immediately. Contains cardiac glycosides. Seek emergency care. Do NOT burn oleander wood. Wash hands after any contact.",
        lookalikes: ["Rhododendron", "Laurel"]
      },
      {
        name: "Manchineel",
        scientific: "Hippomane mancinella",
        danger: "EXTREME",
        keywords: ["apple", "green", "fruit", "beach", "tropical", "milky", "sap", "burns", "coastal", "tree", "small", "round"],
        features: "Tropical tree found on beaches. Small green apple-like fruits. Milky sap causes severe burns. Standing under the tree during rain can cause blistering. One of the most dangerous trees in the world.",
        regions: "Florida, Caribbean, Central America, northern South America",
        firstAid: "Flush affected area with large amounts of water. Do NOT touch eyes. Seek immediate medical attention. If fruit was eaten, go to emergency room immediately.",
        lookalikes: ["Crabapple"]
      },
      {
        name: "Castor Bean",
        scientific: "Ricinus communis",
        danger: "DEADLY",
        keywords: ["castor", "bean", "star", "palmate", "large", "leaves", "red", "spiky", "seed", "pods", "tropical", "ornamental", "ricin"],
        features: "Large palmate star-shaped leaves, often reddish-purple. Spiky red seed pods. Seeds contain ricin, one of the most toxic natural substances. Widely grown as ornamental.",
        regions: "Tropical regions worldwide, cultivated in temperate gardens",
        firstAid: "Call Poison Control and 911 immediately if seeds ingested. Ricin poisoning can be fatal. Seek emergency medical care. Do NOT induce vomiting.",
        lookalikes: ["Japanese Aralia", "Fatsia"]
      },
      {
        name: "Angel's Trumpet",
        scientific: "Brugmansia spp.",
        danger: "DEADLY",
        keywords: ["trumpet", "hanging", "drooping", "large", "flowers", "white", "pink", "yellow", "fragrant", "night", "tree", "shrub", "angel"],
        features: "Large shrub or small tree. Huge pendulous trumpet-shaped flowers (6-20 inches) hanging downward. White, pink, yellow, or peach colored. Intensely fragrant especially at night. All parts toxic.",
        regions: "South America, cultivated worldwide in warm climates",
        firstAid: "Call Poison Control immediately. Contains tropane alkaloids causing hallucinations, rapid heart rate, and potentially death. Seek emergency care.",
        lookalikes: ["Datura (Devil's Trumpet - flowers point up)", "Morning Glory"]
      },
      {
        name: "Death Cap Mushroom",
        scientific: "Amanita phalloides",
        danger: "DEADLY",
        keywords: ["mushroom", "cap", "green", "olive", "white", "gills", "ring", "skirt", "bulbous", "base", "cup", "volva", "death", "forest", "oak"],
        features: "Greenish-olive to yellowish cap. White gills, ring (skirt) on stem, and bulbous base with cup-like volva. Found near oak trees. Responsible for most fatal mushroom poisonings worldwide.",
        regions: "Europe, North America (especially West Coast), Australia",
        firstAid: "Call 911 and Poison Control immediately. Symptoms may be delayed 6-12 hours. Liver failure can occur. Seek emergency medical care immediately. Bring a sample if possible.",
        lookalikes: ["Paddy Straw Mushroom", "Puffball (young stage)", "Green-spored Parasol"]
      },
      {
        name: "Destroying Angel Mushroom",
        scientific: "Amanita virosa / A. bisporigera",
        danger: "DEADLY",
        keywords: ["mushroom", "white", "pure", "angel", "ring", "skirt", "bulbous", "base", "volva", "smooth", "cap", "forest", "destroying"],
        features: "Pure white mushroom with smooth cap, white gills, ring on stem, and bulbous base with sac-like volva. Found in forests. As deadly as Death Cap. Symptoms delayed 6-24 hours.",
        regions: "North America, Europe",
        firstAid: "Call 911 and Poison Control immediately. Do NOT wait for symptoms. Liver and kidney failure likely without treatment. Bring mushroom sample to ER.",
        lookalikes: ["Button Mushroom", "Meadow Mushroom", "Puffball"]
      },
      {
        name: "Monkshood",
        scientific: "Aconitum napellus",
        danger: "DEADLY",
        keywords: ["blue", "purple", "hood", "helmet", "flower", "spike", "tall", "garden", "wolfsbane", "monkshood", "aconite", "palmate"],
        features: "Tall spikes of hooded blue-purple flowers resembling a monk's hood. Deeply divided palmate leaves. All parts highly toxic, especially roots. Can be absorbed through skin.",
        regions: "Europe, Asia, North America mountain regions",
        firstAid: "Call 911 immediately. Wash skin thoroughly if touched. Can cause fatal heart arrhythmia rapidly. Seek emergency medical care.",
        lookalikes: ["Delphinium (Larkspur)", "Baptisia"]
      },
      {
        name: "White Snakeroot",
        scientific: "Ageratina altissima",
        danger: "HIGH",
        keywords: ["white", "flat", "clusters", "flowers", "toothed", "leaves", "shade", "woodland", "snake", "snakeroot", "milk", "sickness"],
        features: "Woodland plant 1-5 feet tall. Flat-topped clusters of small white flowers. Sharply toothed opposite leaves. Caused 'milk sickness' historically when cattle ate it. Contains tremetol toxin.",
        regions: "Eastern and Central North America",
        firstAid: "Seek medical attention if ingested. Can cause trembling, vomiting, and severe intestinal pain. Historically fatal through contaminated milk.",
        lookalikes: ["Boneset", "Late Boneset", "White Thoroughwort"]
      },
      {
        name: "Rosary Pea",
        scientific: "Abrus precatorius",
        danger: "DEADLY",
        keywords: ["red", "black", "seed", "bead", "pea", "vine", "tropical", "small", "bright", "rosary", "jequirity"],
        features: "Tropical vine with compound leaves. Produces bright red seeds with a single black spot. Seeds contain abrin, similar to ricin. A single chewed seed can be fatal.",
        regions: "Tropical regions, Florida, Hawaii",
        firstAid: "Call 911 and Poison Control immediately if seed was chewed/ingested. Abrin is extremely toxic. Seek emergency medical care immediately.",
        lookalikes: ["Coral Bean", "Other decorative bean seeds"]
      },
      {
        name: "Jimsonweed",
        scientific: "Datura stramonium",
        danger: "DEADLY",
        keywords: ["spiky", "seed", "pod", "trumpet", "white", "purple", "flower", "upward", "toothed", "leaves", "smell", "weed", "thorn", "apple", "datura"],
        features: "Bushy plant 2-5 feet tall with coarsely toothed leaves. Large white or purple trumpet-shaped flowers pointing upward. Spiny egg-shaped seed pods (thorn apple). Strong unpleasant odor.",
        regions: "Throughout North America, worldwide",
        firstAid: "Call 911 immediately. Contains tropane alkaloids. Can cause hallucinations, seizures, hyperthermia, and death. Seek emergency medical care.",
        lookalikes: ["Angel's Trumpet (Brugmansia)", "Moon Flower"]
      },
      {
        name: "Stinging Nettle",
        scientific: "Urtica dioica",
        danger: "MODERATE",
        keywords: ["sting", "stinging", "nettle", "hairs", "serrated", "leaves", "opposite", "green", "burn", "tingle", "prickly", "welt"],
        features: "Plant 2-7 feet tall covered in fine stinging hairs. Heart-shaped serrated leaves arranged in opposite pairs. Tiny green flowers. Hairs inject formic acid, histamine, and other irritants on contact.",
        regions: "Worldwide in temperate regions",
        firstAid: "Wash area with soap and water. Apply adhesive tape to pull out fine hairs. Use antihistamine cream or hydrocortisone. Dock leaves rubbed on area may help. Usually resolves in hours.",
        lookalikes: ["Dead Nettle (non-stinging)", "Wood Nettle", "Mint family plants"]
      },
      {
        name: "Poison Sumac",
        scientific: "Toxicodendron vernix",
        danger: "HIGH",
        keywords: ["sumac", "swamp", "wet", "compound", "leaves", "smooth", "red", "stems", "white", "berries", "drooping", "seven", "thirteen", "leaflets"],
        features: "Shrub or small tree in swampy areas. Compound leaves with 7-13 smooth-edged leaflets. Red stems. White or grey drooping berry clusters. More potent than poison ivy. Contains urushiol.",
        regions: "Eastern North America, swamps and wetlands",
        firstAid: "Wash immediately with soap and cool water. More severe than poison ivy reactions. Apply calamine lotion. Seek medical help for severe reactions. May need oral steroids.",
        lookalikes: ["Staghorn Sumac (red upright berries, safe)", "Winged Sumac"]
      },
      {
        name: "Wild Parsnip",
        scientific: "Pastinaca sativa",
        danger: "SEVERE",
        keywords: ["yellow", "flowers", "umbrella", "flat", "grooved", "stem", "burns", "sun", "parsnip", "carrot", "roadside", "meadow"],
        features: "Yellow flat-topped umbrella flower clusters. Grooved stems. Compound leaves similar to celery. Sap causes severe phototoxic burns when skin is exposed to sunlight. Common along roadsides.",
        regions: "Throughout North America, Europe",
        firstAid: "Get out of sunlight immediately. Wash skin with soap and water. Cover affected area from UV exposure. Burns may blister severely. Seek medical attention for large areas.",
        lookalikes: ["Golden Alexander", "Wild Fennel", "Yellow Rocket"]
      }
    ];

    // ===== WEATHER PATTERNS =====
    const weatherPatterns = [
      { condition: "thunderstorm", keywords: ["thunder", "lightning", "storm", "electric"], action: "SEEK SHELTER IMMEDIATELY. Get below treeline. Avoid ridges, isolated trees, water, and metal objects. Crouch low on balls of feet if caught in open. Wait 30 minutes after last thunder before resuming." },
      { condition: "heavy rain", keywords: ["rain", "heavy", "downpour", "deluge", "pour"], action: "Watch for flash floods in canyons and low areas. Move to higher ground if near streams. Use rain gear and waterproof pack cover. Be aware of hypothermia risk. Trail may become slippery." },
      { condition: "high wind", keywords: ["wind", "windy", "gust", "gale", "blow"], action: "Seek sheltered areas below ridgelines. Watch for falling branches and debris. Secure loose gear. Avoid exposed ridges and cliff edges. Lower center of gravity when walking." },
      { condition: "extreme heat", keywords: ["hot", "heat", "scorching", "swelter", "humid", "sun"], action: "Hike during cooler hours (early morning, evening). Drink at least 1 liter per hour. Wear light-colored, loose clothing and wide-brimmed hat. Rest in shade frequently. Watch for signs of heat exhaustion." },
      { condition: "extreme cold", keywords: ["cold", "freeze", "frost", "frigid", "ice", "bitter"], action: "Layer clothing properly (base, insulation, shell). Keep extremities covered. Stay dry at all costs. Eat high-calorie foods regularly. Watch for frostbite signs (numbness, white patches). Keep moving to generate heat." },
      { condition: "snow", keywords: ["snow", "blizzard", "whiteout", "flurry", "sleet"], action: "Use trekking poles for stability. Wear gaiters and waterproof boots. Navigate carefully as trail markers may be buried. Watch for avalanche terrain. Carry emergency shelter. Increase calorie intake." },
      { condition: "fog", keywords: ["fog", "mist", "haze", "visibility", "cloudy", "overcast", "socked"], action: "Use GPS and compass for navigation. Stay on marked trails. Reduce pace significantly. Use headlamp even during day. Stay together with group. Mark your path. Be cautious near cliff edges." },
      { condition: "hail", keywords: ["hail", "ice", "pelting", "hailstone"], action: "Seek shelter under rocky overhangs or dense tree cover. Protect head with pack or arms. Do not shelter under isolated trees. Wait for hail to pass before continuing." },
      { condition: "wildfire smoke", keywords: ["smoke", "fire", "wildfire", "ash", "burn", "hazy"], action: "Check AQI before hiking. Wear N95 mask if AQI > 100. Reduce exertion level. Turn back if visibility drops significantly or AQI exceeds 150. Stay hydrated. Monitor fire maps and evacuation notices." },
      { condition: "flash flood", keywords: ["flood", "flash", "rising", "water", "creek", "river", "surge"], action: "Move to high ground IMMEDIATELY. Never cross flooded trails or streams. Even 6 inches of moving water can knock you down. Wait for water to recede. Camp well above waterlines." },
      { condition: "tornado warning", keywords: ["tornado", "funnel", "twister", "cyclone", "rotating"], action: "Seek lowest ground available such as a ditch or ravine. Lie flat and cover head. Avoid vehicles, trees, and open areas. Move perpendicular to tornado's path. Monitor weather radio." },
      { condition: "UV extreme", keywords: ["uv", "sunburn", "radiation", "altitude", "sun", "burn"], action: "Apply SPF 30+ sunscreen every 2 hours. UV increases 4-5% per 1000ft elevation. Wear UV-blocking sunglasses. Cover exposed skin. Seek shade during 10am-4pm peak. Lip balm with SPF." },
      { condition: "ice storm", keywords: ["ice", "freezing", "glaze", "icy", "slick", "slippery", "black"], action: "Use microspikes or crampons. Shorten stride and keep center of gravity low. Use trekking poles. Avoid steep sections. Consider turning back. Watch for ice-covered rocks and bridges." },
      { condition: "dust storm", keywords: ["dust", "sand", "desert", "visibility", "brown"], action: "Seek shelter behind large rocks or terrain features. Cover nose and mouth with bandana or buff. Protect eyes with goggles or glasses. Wait for storm to pass. Mark your location on GPS." },
      { condition: "high humidity", keywords: ["humid", "muggy", "sticky", "damp", "tropical", "moisture"], action: "Wear moisture-wicking fabrics. Hydrate more than usual and add electrolytes. Take frequent breaks. Watch for heat exhaustion. Start early to avoid peak humidity. Bring anti-chafe products." },
      { condition: "sudden temperature drop", keywords: ["drop", "sudden", "cold front", "temperature", "change", "plummet"], action: "Add layers immediately before you feel cold. Eat a snack to fuel heat production. Pick up pace slightly. Have emergency bivy or space blanket accessible. Seek shelter if conditions worsen." },
      { condition: "early darkness", keywords: ["dark", "sunset", "dusk", "short", "days", "evening", "night"], action: "Always carry a headlamp with fresh batteries. Plan turnaround time with daylight buffer. Know your pace and remaining distance. Mark trail on GPS. Reflective markers on pack." },
      { condition: "drought conditions", keywords: ["drought", "dry", "water", "scarce", "arid"], action: "Carry extra water (1 gallon minimum per day). Know all water sources and have backup plan. Carry water filter or purification. Avoid strenuous midday activity. Fire danger is extreme - no campfires." },
      { condition: "avalanche risk", keywords: ["avalanche", "slide", "snowpack", "slope", "unstable"], action: "Check avalanche forecast before heading out. Carry beacon, probe, and shovel. Travel one at a time across avalanche terrain. Avoid slopes 30-45 degrees. Watch for recent slides, cracking snow, and whumpfing sounds." },
      { condition: "river crossing", keywords: ["river", "crossing", "ford", "current", "creek", "wade"], action: "Unbuckle pack hip belt before crossing. Use trekking poles for balance. Face upstream and shuffle sideways. Cross at widest, shallowest point. Early morning is safest when snowmelt is lowest. Never cross above waist height." }
    ];

    // ===== FIRST AID GUIDES =====
    const firstAidGuides = {
      blister: {
        title: "BLISTER TREATMENT",
        steps: [
          "Clean the area gently with soap and water or antiseptic wipe",
          "If the blister is small and not painful, leave it intact and cover with moleskin with a hole cut around the blister",
          "If the blister is large or painful, sterilize a needle with alcohol or flame",
          "Puncture the blister at the edge near the base, allowing fluid to drain",
          "Do NOT remove the skin flap - it protects the raw skin underneath",
          "Apply antibiotic ointment to the area",
          "Cover with a sterile bandage or blister-specific bandage (like 2nd Skin)",
          "Surround with moleskin or donut-shaped padding to reduce pressure",
          "Change dressing daily and watch for signs of infection (redness, warmth, pus)",
          "Prevention: wear broken-in boots, moisture-wicking socks, and apply tape to hot spots early"
        ]
      },
      sprain: {
        title: "SPRAIN (ANKLE/WRIST) TREATMENT",
        steps: [
          "Stop activity immediately and assess the injury",
          "Apply RICE protocol: Rest, Ice, Compression, Elevation",
          "If no ice available, soak in cold stream water for 15-20 minutes",
          "Wrap with elastic bandage (ACE wrap) in figure-8 pattern - snug but not cutting circulation",
          "Elevate the injured limb above heart level when resting",
          "Take ibuprofen for pain and inflammation if available",
          "If you can bear weight, use trekking poles for support and hike out slowly",
          "If you cannot bear weight, send for help or call emergency services",
          "Splint the joint if needed using sticks and bandage for stability",
          "Seek medical evaluation within 24-48 hours to rule out fracture"
        ]
      },
      snakebite: {
        title: "SNAKEBITE EMERGENCY",
        steps: [
          "Move away from the snake to a safe distance (at least 20 feet)",
          "Call 911 or emergency services IMMEDIATELY",
          "Keep the victim calm and still to slow venom spread",
          "Remove jewelry, watches, and tight clothing near the bite (swelling will occur)",
          "Immobilize the bitten limb and keep it at or below heart level",
          "Mark the edge of swelling with a pen and note the time",
          "Do NOT cut the wound, suck out venom, or apply a tourniquet",
          "Do NOT apply ice or submerge in cold water",
          "If possible, take a photo of the snake for identification (from safe distance)",
          "Transport to nearest hospital with antivenom capability as quickly as possible"
        ]
      },
      dehydration: {
        title: "DEHYDRATION TREATMENT",
        steps: [
          "Move to shade and rest immediately",
          "Sip water slowly - do not gulp large amounts",
          "Add electrolyte powder or tablets to water if available",
          "If no electrolytes, a pinch of salt and sugar in water helps",
          "Remove excess clothing to cool down",
          "Wet a bandana and place on neck, wrists, and forehead",
          "Eat salty snacks to help retain water",
          "Monitor urine color - aim for pale yellow",
          "Rest for at least 30 minutes before resuming activity at reduced pace",
          "If symptoms include confusion, rapid heartbeat, or no urine output, evacuate immediately - this is a medical emergency"
        ]
      },
      hypothermia: {
        title: "HYPOTHERMIA EMERGENCY",
        steps: [
          "Get the person out of cold, wind, and wet conditions immediately",
          "Remove wet clothing and replace with dry layers",
          "Insulate from the ground using sleeping pad, pack, branches, or leaves",
          "Wrap in sleeping bag, emergency blanket, or any available insulation",
          "Apply gentle warmth to core areas: chest, neck, armpits, groin",
          "Give warm sweet drinks if the person is conscious and can swallow",
          "Do NOT rub extremities or give alcohol",
          "Do NOT place in hot water or use direct heat sources",
          "Handle gently - rough handling can trigger cardiac arrest in severe hypothermia",
          "Call emergency services for moderate/severe hypothermia (confusion, slurred speech, loss of coordination). Evacuate immediately."
        ]
      },
      heat_stroke: {
        title: "HEAT STROKE EMERGENCY",
        steps: [
          "This is a LIFE-THREATENING EMERGENCY - call 911 immediately",
          "Move the person to shade or coolest available area",
          "Remove excess clothing",
          "Cool aggressively: pour water over body, fan the person, apply ice to neck, armpits, and groin",
          "Submerge in cool stream or lake if available",
          "Do NOT give fluids if person is unconscious or confused",
          "Monitor breathing and be prepared to perform CPR",
          "If conscious and alert, give small sips of cool water",
          "Distinguish from heat exhaustion: heat stroke involves confusion, hot dry skin, and temperature above 104F",
          "Continue cooling until emergency services arrive or body temperature drops below 102F"
        ]
      },
      insect_sting: {
        title: "INSECT STING TREATMENT",
        steps: [
          "Move away from the area to avoid additional stings",
          "If a stinger is visible, scrape it out with a flat edge (credit card, knife blade) - do not squeeze with tweezers",
          "Clean the area with soap and water",
          "Apply a cold compress or stream water for 10 minutes to reduce swelling",
          "Take oral antihistamine (Benadryl) if available",
          "Apply hydrocortisone cream or calamine lotion to reduce itch",
          "For bee sting: baking soda paste. For wasp sting: vinegar",
          "WATCH FOR ANAPHYLAXIS: difficulty breathing, swelling of face/throat, dizziness, rapid pulse",
          "If signs of anaphylaxis appear, use EpiPen immediately if available and call 911",
          "Monitor for 30 minutes minimum. Allergic reactions can be delayed."
        ]
      },
      cut: {
        title: "CUT/WOUND TREATMENT",
        steps: [
          "Apply direct pressure with a clean cloth or bandage to stop bleeding",
          "Elevate the wound above heart level if possible",
          "Once bleeding slows, clean the wound thoroughly with clean water",
          "Remove any visible debris gently with clean tweezers",
          "Apply antibiotic ointment to prevent infection",
          "Close small cuts with butterfly bandages or wound closure strips",
          "Cover with sterile bandage and secure with medical tape",
          "For deep cuts that won't stop bleeding, maintain pressure and seek medical help",
          "Change dressing daily. Watch for infection signs: increasing redness, swelling, warmth, red streaks, fever",
          "Ensure tetanus vaccination is up to date. Seek medical care for deep, dirty, or animal-caused wounds."
        ]
      }
    };

    // ===== TRAIL SAFETY TIPS =====
    const trailSafetyTips = {
      mountain: [
        "Start early to avoid afternoon thunderstorms common above treeline",
        "Turn back if weather deteriorates - summits will always be there another day",
        "Watch for signs of altitude sickness: headache, nausea, dizziness above 8,000ft",
        "Carry extra layers - temperature drops about 3.5F per 1,000ft of elevation gain",
        "Stay on marked trails to avoid loose scree and unstable terrain",
        "Be visible to others - wear bright colors especially above treeline",
        "Learn to recognize cairns and trail markers in alpine environments",
        "Carry trekking poles for steep ascents and descents to reduce joint strain"
      ],
      forest: [
        "Tell someone your planned route and expected return time",
        "Carry a whistle - three blasts is the universal distress signal",
        "Watch for falling trees and branches (widow makers) especially in wind",
        "Be bear aware: make noise, carry bear spray, know how to use it",
        "Learn to identify and avoid poison ivy, poison oak, and stinging nettle",
        "Stay on the trail to prevent getting lost in dense vegetation",
        "Check for ticks frequently, especially in tall grass and brushy areas",
        "Carry a map and compass as GPS may not work under heavy canopy"
      ],
      desert: [
        "Carry a minimum of 1 gallon of water per person per day",
        "Hike in early morning or late afternoon to avoid peak heat",
        "Wear sun-protective clothing: long sleeves, wide-brimmed hat, neck shade",
        "Watch where you step and place your hands - snakes and scorpions shelter in shade",
        "Stay on established trails to avoid cryptobiotic soil crusts",
        "Know the signs of heat exhaustion: heavy sweating, weakness, nausea, dizziness",
        "Carry a mirror or whistle for emergency signaling in open terrain",
        "Flash floods can occur even with clear skies - avoid narrow canyons during rain season"
      ],
      coastal: [
        "Check tide tables before hiking coastal trails - some sections may be impassable at high tide",
        "Beware of sneaker waves - never turn your back on the ocean",
        "Watch for slippery rocks covered in algae near the water line",
        "Apply waterproof sunscreen frequently as water and sand reflect UV rays",
        "Be aware of cliff edges - erosion can make edges unstable",
        "Know the signs of rip currents if swimming: channel of choppy water flowing seaward",
        "Carry wind protection - coastal areas can have sustained high winds",
        "Watch for jellyfish and other marine hazards along the shore"
      ],
      arctic: [
        "Never travel alone in arctic conditions - always have a partner",
        "Carry emergency shelter that can be deployed in under 2 minutes",
        "Watch for ice conditions - test ice thickness before crossing frozen surfaces",
        "Protect all exposed skin - frostbite can occur in minutes at extreme cold",
        "Carry high-calorie foods as your body burns significantly more calories in cold",
        "Be aware of polar bear territory - carry deterrent and know safety protocols",
        "Whiteout conditions can cause complete disorientation - stop and shelter if visibility drops",
        "Daylight hours vary dramatically - plan for extended darkness in winter months"
      ]
    };

    // ===== GENERAL HIKING TIPS =====
    const generalTips = [
      "The Ten Essentials: navigation, sun protection, insulation, illumination, first aid, fire, repair tools, nutrition, hydration, emergency shelter.",
      "Break in new boots before a long hike - wear them around town for at least a week first.",
      "Follow Leave No Trace: pack out all trash, stay on trails, leave what you find, minimize campfire impact.",
      "Bring more water than you think you need. A good rule is half a liter per hour of moderate activity.",
      "Layer your clothing: moisture-wicking base layer, insulating mid layer, waterproof outer shell.",
      "Trekking poles reduce knee strain by up to 25% on descents and improve balance on rough terrain.",
      "Always tell someone your hiking plan: where you're going, your route, and when you expect to return.",
      "Hike at your own pace. It's not a race. Consistent moderate effort beats fast starts that lead to exhaustion.",
      "Pack your heaviest items close to your back and centered between your shoulder blades and hips.",
      "Cotton kills in cold, wet conditions. Choose wool or synthetic fabrics that insulate when wet.",
      "Learn to read a topographic map. GPS is great but batteries die and signals can be lost.",
      "Start early. Morning hours offer cooler temperatures, better light, and more time for unexpected delays.",
      "Eat before you're hungry, drink before you're thirsty. Regular small snacks beat large infrequent meals.",
      "Know the symptoms of altitude sickness and descend immediately if they worsen.",
      "A blister felt early is a blister prevented. Stop and treat hot spots immediately with moleskin or tape.",
      "Carry a lightweight emergency bivy or space blanket. They weigh ounces and can save your life.",
      "Learn basic knots: bowline, clove hitch, and trucker's hitch cover most hiking needs.",
      "Right of way on trails: uphill hikers have priority. Step aside for pack animals. Bikers yield to hikers.",
      "Hang food in a bear canister or bear bag at least 200 feet from your campsite in bear country.",
      "Stream crossings are safest in the early morning before snowmelt peaks. Unbuckle your pack hip belt first.",
      "Adjust trekking pole length: shorter for uphill, longer for downhill, equal for flat terrain.",
      "Test your gear at home before relying on it in the field. Practice setting up your shelter in your yard.",
      "Bring a bandana or buff - it has dozens of uses: sun protection, water filter prefilter, bandage, pot holder.",
      "Pace yourself using the talk test: if you can't carry on a conversation, you're going too fast.",
      "Sunscreen and lip balm are essential even on cloudy days. UV penetrates clouds and reflects off snow and water.",
      "Learn to recognize signs of an approaching storm: building cumulus clouds, sudden wind shifts, temperature drops.",
      "Keep your phone in airplane mode to save battery. Turn it on only when needed for navigation or emergency.",
      "A full water bottle can double as a hot water bottle in your sleeping bag on cold nights.",
      "Rest step technique for steep climbs: lock your back knee briefly with each step to let your skeleton bear weight.",
      "Always carry a headlamp even on day hikes. You might not plan to be out after dark, but plans change."
    ];

    // ===== QUERY HANDLERS =====

    if (queryType === "plant_id") {
      if (!jsonData.description) {
        return JSON.stringify({ error: "description is required for plant_id query_type. Describe the plant you observed." });
      }
      const desc = jsonData.description.toLowerCase();
      const descWords = desc.split(/\s+/);

      const scored = plants.map(plant => {
        let score = 0;
        for (const keyword of plant.keywords) {
          if (desc.includes(keyword)) {
            score += 2;
          }
          for (const word of descWords) {
            if (word === keyword) {
              score += 1;
            }
          }
        }
        return { plant, score };
      });

      scored.sort((a, b) => b.score - a.score);
      const matches = scored.filter(s => s.score > 0).slice(0, 3);

      if (matches.length === 0) {
        return JSON.stringify({ result: "PLANT IDENTIFICATION\n\nNo matching plants found in the database based on your description. This does not mean the plant is safe. When in doubt:\n- Do NOT touch or eat unknown plants\n- Take a clear photo for later identification\n- Note the location, leaf shape, flower color, and growth pattern\n- Consult a local field guide or botanist" });
      }

      const maxScore = matches[0].score;
      let output = "PLANT IDENTIFICATION\n";

      matches.forEach((m, idx) => {
        const confidence = m.score >= maxScore * 0.8 ? "HIGH" : m.score >= maxScore * 0.5 ? "MEDIUM" : "LOW";
        const label = idx === 0 ? "Likely Match" : `Possible Match #${idx + 1}`;
        output += `\n${label}: ${m.plant.name.toUpperCase()}`;
        output += `\nScientific Name: ${m.plant.scientific}`;
        output += `\nDanger Level: ${m.plant.danger}`;
        output += `\nConfidence: ${confidence}`;
        output += `\n\nDescription: ${m.plant.features}`;
        output += `\nRegions: ${m.plant.regions}`;
        output += `\nLookalikes: ${m.plant.lookalikes.join(", ")}`;
        output += `\n\nFirst Aid: ${m.plant.firstAid}`;
        output += "\n\n---";
      });

      output += "\n\nWARNING: This is an automated identification aid only. When in doubt, assume the plant is dangerous. Seek professional identification and medical help if exposure occurred.";

      return JSON.stringify({ result: output });
    }

    if (queryType === "weather") {
      const conditions = (jsonData.weather_conditions || "").toLowerCase();
      if (!conditions) {
        return JSON.stringify({ error: "weather_conditions is recommended for weather query_type. Describe the current or expected weather." });
      }

      const matched = weatherPatterns.filter(wp => {
        return wp.keywords.some(kw => conditions.includes(kw));
      });

      if (matched.length === 0) {
        return JSON.stringify({ result: "WEATHER GUIDANCE\n\nNo specific weather pattern matched. General advice:\n- Monitor conditions continuously\n- Have a bailout plan ready\n- Carry layers for temperature changes\n- Check weather forecast before departing\n- Turn back if conditions feel unsafe" });
      }

      let output = "WEATHER GUIDANCE\n";
      matched.forEach(wp => {
        output += `\nCondition: ${wp.condition.toUpperCase()}`;
        output += `\nAction: ${wp.action}`;
        output += "\n";
      });

      return JSON.stringify({ result: output });
    }

    if (queryType === "first_aid") {
      const injuryType = jsonData.injury_type;
      if (!injuryType || !firstAidGuides[injuryType]) {
        const available = Object.keys(firstAidGuides).join(", ");
        return JSON.stringify({ error: `injury_type is required for first_aid query. Available types: ${available}` });
      }

      const guide = firstAidGuides[injuryType];
      let output = `FIRST AID: ${guide.title}\n`;
      guide.steps.forEach((step, idx) => {
        output += `\n${idx + 1}. ${step}`;
      });
      output += "\n\nDISCLAIMER: This is general first aid guidance only. For serious injuries, call emergency services (911) immediately. This information is not a substitute for professional medical advice.";

      return JSON.stringify({ result: output });
    }

    if (queryType === "trail_safety") {
      const trailType = jsonData.trail_type;

      if (trailType && trailSafetyTips[trailType]) {
        const tips = trailSafetyTips[trailType];
        let output = `TRAIL SAFETY: ${trailType.toUpperCase()} HIKING\n`;
        tips.forEach((tip, idx) => {
          output += `\n${idx + 1}. ${tip}`;
        });
        return JSON.stringify({ result: output });
      }

      let output = "TRAIL SAFETY TIPS\n\nAvailable trail types: mountain, forest, desert, coastal, arctic\n\nProvide a trail_type for specific tips. Here are key tips for all environments:\n";
      const allTypes = Object.keys(trailSafetyTips);
      allTypes.forEach(type => {
        output += `\n[${type.toUpperCase()}] ${trailSafetyTips[type][0]}`;
      });

      return JSON.stringify({ result: output });
    }

    if (queryType === "general_tip") {
      const randomIndex = Math.floor(Math.random() * generalTips.length);
      const tip = generalTips[randomIndex];
      return JSON.stringify({ result: `HIKING TIP\n\n${tip}` });
    }

    return JSON.stringify({ error: `Unknown query_type: '${queryType}'. Must be one of: plant_id, weather, first_aid, trail_safety, general_tip` });

  } catch (e) {
    console.error(e);
    return JSON.stringify({ error: `Hiking companion error: ${e.message}` });
  }
};
