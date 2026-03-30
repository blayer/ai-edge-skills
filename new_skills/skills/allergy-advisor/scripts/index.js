window['ai_edge_gallery_get_result'] = async (data) => {
  try {
    const jsonData = JSON.parse(data);
    const location = (jsonData.location || "Unknown").trim();
    const season = (jsonData.season || "spring").toLowerCase();
    const skinType = (jsonData.skin_type || "combination").toLowerCase();
    const hairType = (jsonData.hair_type || "straight").toLowerCase();
    const allergies = jsonData.allergies || [];

    // Hardcoded city allergen data: { pollenTypes, aqiRange, humidity }
    const cityData = {
      "new york": {
        spring: { pollen: ["Tree pollen (oak, birch)", "Grass pollen"], aqi: [45, 80], humidity: 58 },
        summer: { pollen: ["Grass pollen", "Ragweed"], aqi: [50, 95], humidity: 68 },
        fall: { pollen: ["Ragweed", "Mold spores"], aqi: [35, 70], humidity: 62 },
        winter: { pollen: ["Indoor dust mites", "Mold spores"], aqi: [25, 55], humidity: 45 }
      },
      "los angeles": {
        spring: { pollen: ["Tree pollen (olive, mulberry)", "Grass pollen"], aqi: [55, 110], humidity: 42 },
        summer: { pollen: ["Grass pollen", "Smog particulates"], aqi: [65, 130], humidity: 38 },
        fall: { pollen: ["Ragweed", "Sagebrush pollen"], aqi: [50, 100], humidity: 40 },
        winter: { pollen: ["Mountain cedar", "Indoor allergens"], aqi: [40, 85], humidity: 48 }
      },
      "chicago": {
        spring: { pollen: ["Tree pollen (elm, maple)", "Grass pollen"], aqi: [40, 75], humidity: 55 },
        summer: { pollen: ["Grass pollen", "Ragweed"], aqi: [45, 90], humidity: 70 },
        fall: { pollen: ["Ragweed", "Mold spores"], aqi: [35, 65], humidity: 65 },
        winter: { pollen: ["Indoor dust mites", "Pet dander"], aqi: [20, 50], humidity: 40 }
      },
      "houston": {
        spring: { pollen: ["Oak pollen", "Grass pollen", "Mold spores"], aqi: [50, 95], humidity: 72 },
        summer: { pollen: ["Grass pollen", "Ragweed", "Mold spores"], aqi: [55, 105], humidity: 78 },
        fall: { pollen: ["Ragweed", "Elm pollen"], aqi: [45, 85], humidity: 70 },
        winter: { pollen: ["Mountain cedar", "Mold spores"], aqi: [30, 65], humidity: 65 }
      },
      "phoenix": {
        spring: { pollen: ["Mulberry pollen", "Olive pollen", "Bermuda grass"], aqi: [45, 90], humidity: 20 },
        summer: { pollen: ["Bermuda grass", "Dust particulates"], aqi: [55, 110], humidity: 25 },
        fall: { pollen: ["Ragweed", "Sagebrush"], aqi: [40, 80], humidity: 22 },
        winter: { pollen: ["Juniper pollen", "Indoor allergens"], aqi: [30, 60], humidity: 30 }
      },
      "miami": {
        spring: { pollen: ["Oak pollen", "Bayberry pollen", "Grass pollen"], aqi: [35, 70], humidity: 72 },
        summer: { pollen: ["Grass pollen", "Mold spores"], aqi: [40, 80], humidity: 80 },
        fall: { pollen: ["Ragweed", "Mold spores"], aqi: [35, 65], humidity: 75 },
        winter: { pollen: ["Australian pine", "Brazilian pepper"], aqi: [25, 55], humidity: 65 }
      },
      "seattle": {
        spring: { pollen: ["Alder pollen", "Birch pollen", "Grass pollen"], aqi: [30, 60], humidity: 72 },
        summer: { pollen: ["Grass pollen", "Nettle pollen"], aqi: [35, 75], humidity: 58 },
        fall: { pollen: ["Mold spores", "Ragweed"], aqi: [30, 65], humidity: 75 },
        winter: { pollen: ["Indoor dust mites", "Mold spores"], aqi: [20, 45], humidity: 80 }
      },
      "denver": {
        spring: { pollen: ["Juniper pollen", "Cottonwood pollen"], aqi: [35, 70], humidity: 35 },
        summer: { pollen: ["Grass pollen", "Thistle pollen"], aqi: [40, 85], humidity: 30 },
        fall: { pollen: ["Ragweed", "Sagebrush"], aqi: [35, 65], humidity: 32 },
        winter: { pollen: ["Indoor allergens", "Dust"], aqi: [25, 55], humidity: 28 }
      },
      "atlanta": {
        spring: { pollen: ["Pine pollen", "Oak pollen", "Birch pollen"], aqi: [50, 95], humidity: 60 },
        summer: { pollen: ["Grass pollen", "Ragweed"], aqi: [55, 100], humidity: 72 },
        fall: { pollen: ["Ragweed", "Mold spores"], aqi: [40, 80], humidity: 65 },
        winter: { pollen: ["Cedar pollen", "Indoor allergens"], aqi: [30, 60], humidity: 55 }
      },
      "boston": {
        spring: { pollen: ["Tree pollen (oak, birch, maple)", "Grass pollen"], aqi: [35, 70], humidity: 55 },
        summer: { pollen: ["Grass pollen", "Ragweed"], aqi: [40, 80], humidity: 65 },
        fall: { pollen: ["Ragweed", "Mold spores"], aqi: [30, 60], humidity: 62 },
        winter: { pollen: ["Indoor dust mites", "Mold spores"], aqi: [20, 45], humidity: 48 }
      },
      "san francisco": {
        spring: { pollen: ["Cypress pollen", "Grass pollen"], aqi: [30, 65], humidity: 70 },
        summer: { pollen: ["Grass pollen", "Dock/sorrel pollen"], aqi: [35, 75], humidity: 72 },
        fall: { pollen: ["Mold spores", "Ragweed"], aqi: [30, 60], humidity: 68 },
        winter: { pollen: ["Alder pollen", "Indoor allergens"], aqi: [25, 50], humidity: 75 }
      },
      "dallas": {
        spring: { pollen: ["Oak pollen", "Pecan pollen", "Grass pollen"], aqi: [50, 90], humidity: 60 },
        summer: { pollen: ["Grass pollen", "Ragweed"], aqi: [55, 100], humidity: 55 },
        fall: { pollen: ["Ragweed", "Elm pollen"], aqi: [45, 85], humidity: 58 },
        winter: { pollen: ["Mountain cedar", "Mold spores"], aqi: [30, 60], humidity: 52 }
      },
      "minneapolis": {
        spring: { pollen: ["Tree pollen (birch, elm)", "Grass pollen"], aqi: [30, 60], humidity: 55 },
        summer: { pollen: ["Grass pollen", "Ragweed"], aqi: [35, 75], humidity: 68 },
        fall: { pollen: ["Ragweed", "Mold spores"], aqi: [30, 55], humidity: 65 },
        winter: { pollen: ["Indoor dust mites", "Pet dander"], aqi: [15, 40], humidity: 38 }
      },
      "washington dc": {
        spring: { pollen: ["Cherry blossom pollen", "Oak pollen", "Grass pollen"], aqi: [40, 78], humidity: 58 },
        summer: { pollen: ["Grass pollen", "Ragweed"], aqi: [50, 95], humidity: 70 },
        fall: { pollen: ["Ragweed", "Mold spores"], aqi: [35, 70], humidity: 62 },
        winter: { pollen: ["Indoor allergens", "Dust mites"], aqi: [25, 50], humidity: 48 }
      },
      "portland": {
        spring: { pollen: ["Alder pollen", "Birch pollen", "Grass pollen"], aqi: [30, 58], humidity: 72 },
        summer: { pollen: ["Grass pollen", "Nettle pollen"], aqi: [35, 80], humidity: 55 },
        fall: { pollen: ["Mold spores", "Ragweed"], aqi: [30, 65], humidity: 78 },
        winter: { pollen: ["Indoor mold", "Dust mites"], aqi: [20, 45], humidity: 82 }
      },
      "philadelphia": {
        spring: { pollen: ["Tree pollen (oak, maple)", "Grass pollen"], aqi: [40, 75], humidity: 56 },
        summer: { pollen: ["Grass pollen", "Ragweed"], aqi: [50, 90], humidity: 68 },
        fall: { pollen: ["Ragweed", "Mold spores"], aqi: [35, 70], humidity: 60 },
        winter: { pollen: ["Indoor dust mites", "Pet dander"], aqi: [25, 50], humidity: 45 }
      },
      "nashville": {
        spring: { pollen: ["Tree pollen (cedar, oak)", "Grass pollen"], aqi: [45, 82], humidity: 60 },
        summer: { pollen: ["Grass pollen", "Ragweed"], aqi: [50, 92], humidity: 70 },
        fall: { pollen: ["Ragweed", "Mold spores"], aqi: [38, 72], humidity: 63 },
        winter: { pollen: ["Cedar pollen", "Indoor allergens"], aqi: [25, 55], humidity: 55 }
      },
      "detroit": {
        spring: { pollen: ["Tree pollen (elm, oak)", "Grass pollen"], aqi: [38, 72], humidity: 55 },
        summer: { pollen: ["Grass pollen", "Ragweed"], aqi: [45, 88], humidity: 68 },
        fall: { pollen: ["Ragweed", "Mold spores"], aqi: [32, 65], humidity: 65 },
        winter: { pollen: ["Indoor dust mites", "Mold spores"], aqi: [20, 48], humidity: 42 }
      },
      "salt lake city": {
        spring: { pollen: ["Juniper pollen", "Cottonwood pollen", "Grass pollen"], aqi: [40, 78], humidity: 32 },
        summer: { pollen: ["Grass pollen", "Sagebrush"], aqi: [50, 100], humidity: 22 },
        fall: { pollen: ["Ragweed", "Sagebrush"], aqi: [42, 82], humidity: 30 },
        winter: { pollen: ["Inversion particulates", "Indoor allergens"], aqi: [55, 120], humidity: 50 }
      },
      "orlando": {
        spring: { pollen: ["Oak pollen", "Grass pollen", "Mold spores"], aqi: [35, 68], humidity: 68 },
        summer: { pollen: ["Grass pollen", "Mold spores"], aqi: [40, 78], humidity: 78 },
        fall: { pollen: ["Ragweed", "Mold spores"], aqi: [32, 62], humidity: 72 },
        winter: { pollen: ["Australian pine", "Indoor allergens"], aqi: [25, 50], humidity: 60 }
      },
      "las vegas": {
        spring: { pollen: ["Mulberry pollen", "Olive pollen"], aqi: [40, 82], humidity: 18 },
        summer: { pollen: ["Bermuda grass", "Dust particulates"], aqi: [50, 105], humidity: 15 },
        fall: { pollen: ["Ragweed", "Sagebrush"], aqi: [38, 75], humidity: 20 },
        winter: { pollen: ["Juniper pollen", "Indoor allergens"], aqi: [28, 58], humidity: 28 }
      }
    };

    const key = location.toLowerCase();
    const cityInfo = cityData[key] && cityData[key][season]
      ? cityData[key][season]
      : { pollen: ["General pollen", "Dust", "Mold spores"], aqi: [30, 70], humidity: 50 };

    // Rate pollen severity
    const severityMap = { spring: "HIGH", summer: "MODERATE-HIGH", fall: "MODERATE", winter: "LOW" };
    const severity = severityMap[season] || "MODERATE";

    // Build allergen section
    let allergenLines = "Top Allergens:\n";
    cityInfo.pollen.forEach(p => {
      allergenLines += `- ${p} (${severity})\n`;
    });
    allergenLines += `\nTypical AQI Range: ${cityInfo.aqi[0]} - ${cityInfo.aqi[1]}`;
    allergenLines += `\nAverage Humidity: ${cityInfo.humidity}%`;

    // Personal allergy warnings
    let personalWarnings = "";
    if (allergies.length > 0) {
      personalWarnings = "\n\nPersonal Allergy Alerts:\n";
      allergies.forEach(a => {
        const lower = a.toLowerCase();
        const matched = cityInfo.pollen.filter(p => p.toLowerCase().includes(lower));
        if (matched.length > 0) {
          personalWarnings += `- WARNING: Your "${a}" allergy may be triggered by ${matched.join(", ")}\n`;
        } else {
          personalWarnings += `- "${a}" allergen: Low risk this season in ${location}\n`;
        }
      });
    }

    // Skin care recommendations based on skin_type + humidity
    const isHumid = cityInfo.humidity >= 60;
    const isDry = cityInfo.humidity < 40;
    const skinRecs = {
      oily: isHumid
        ? "Use oil-free, water-based moisturizer. Gel cleansers recommended. Apply mattifying primer before going out. Blotting papers for midday shine."
        : "Lightweight moisturizer is fine. Don't skip moisturizer even in dry air -- dehydrated skin overproduces oil.",
      dry: isHumid
        ? "Rich cream moisturizer works well. The humidity helps, but still apply SPF 30+. Hydrating toner recommended."
        : "Heavy-duty ceramide moisturizer essential. Use humidifier indoors. Layer hydrating serum under cream. Avoid foaming cleansers.",
      combination: isHumid
        ? "Gel moisturizer on T-zone, cream on dry patches. Use gentle cleanser. SPF 30+ non-comedogenic sunscreen."
        : "Hydrating serum all over, mattifying moisturizer on T-zone. Cream on cheeks. Don't over-cleanse.",
      sensitive: isHumid
        ? "Fragrance-free, minimal ingredient moisturizer. High humidity may cause irritation -- keep skin clean and dry. Mineral sunscreen preferred."
        : "Rich, fragrance-free barrier cream. Avoid exfoliants in dry weather. Hypoallergenic everything. Patch test new products."
    };
    const skinAdvice = skinRecs[skinType] || skinRecs.combination;

    // Hair care recommendations based on hair_type + humidity
    const hairRecs = {
      straight: isHumid
        ? "Use lightweight anti-humidity serum. Avoid heavy products that weigh hair down. Dry shampoo for volume."
        : "Hydrating conditioner recommended. Leave-in treatment to prevent static. Minimize heat styling.",
      curly: isHumid
        ? "Humidity enhances curls but may cause frizz. Use anti-frizz cream and scrunch dry. Avoid brushing dry hair."
        : "Deep conditioning mask weekly. Use curl cream generously. Sleep with satin pillowcase to prevent breakage.",
      wavy: isHumid
        ? "Light hold gel to define waves without frizz. Air dry when possible. Anti-humidity spray helps."
        : "Moisturizing wave cream. Diffuse on low heat. Protein treatment monthly to maintain wave pattern.",
      coily: isHumid
        ? "Humidity can help moisture retention. Use leave-in conditioner and seal with oil. Protective styles recommended."
        : "Extra moisture is critical. LOC method (liquid, oil, cream). Deep condition biweekly. Minimize manipulation."
    };
    const hairAdvice = hairRecs[hairType] || hairRecs.straight;

    // AQI advisory
    const avgAqi = Math.round((cityInfo.aqi[0] + cityInfo.aqi[1]) / 2);
    let aqiAdvice = "";
    if (avgAqi > 100) {
      aqiAdvice = "\n\nAir Quality Warning: AQI often exceeds 100. Wear N95 mask outdoors. Use air purifier indoors. Limit outdoor exercise.";
    } else if (avgAqi > 70) {
      aqiAdvice = "\n\nAir Quality Note: Moderate AQI levels. Sensitive individuals should limit prolonged outdoor exertion.";
    } else {
      aqiAdvice = "\n\nAir Quality: Generally good. Normal outdoor activities are fine.";
    }

    const climateDesc = isHumid ? "humid" : isDry ? "dry" : "moderate humidity";

    const result = `ALLERGY ADVISORY: ${location}, ${season.charAt(0).toUpperCase() + season.slice(1)}

${allergenLines}${personalWarnings}

Skin Care (${skinType.charAt(0).toUpperCase() + skinType.slice(1)} skin + ${climateDesc} climate):
${skinAdvice}

Hair Care (${hairType.charAt(0).toUpperCase() + hairType.slice(1)} hair + ${climateDesc} climate):
${hairAdvice}${aqiAdvice}`;

    return JSON.stringify({ result });
  } catch (e) {
    console.error(e);
    return JSON.stringify({ error: `Failed to generate allergy advisory: ${e.message}` });
  }
};
