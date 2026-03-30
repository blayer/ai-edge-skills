window['ai_edge_gallery_get_result'] = async (data) => {
  try {
    const input = JSON.parse(data);
    const baseColor = input.base_color || '#FF5733';
    const paletteType = (input.palette_type || 'complementary').toLowerCase();
    const count = input.count || 5;

    // Hex to RGB
    function hexToRgb(hex) {
      hex = hex.replace('#', '');
      if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return { r, g, b };
    }

    // RGB to HSL
    function rgbToHsl(r, g, b) {
      r /= 255; g /= 255; b /= 255;
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      let h, s, l = (max + min) / 2;
      if (max === min) {
        h = s = 0;
      } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
          case g: h = ((b - r) / d + 2) / 6; break;
          case b: h = ((r - g) / d + 4) / 6; break;
        }
      }
      return { h: h * 360, s: s * 100, l: l * 100 };
    }

    // HSL to RGB
    function hslToRgb(h, s, l) {
      h /= 360; s /= 100; l /= 100;
      let r, g, b;
      if (s === 0) {
        r = g = b = l;
      } else {
        const hue2rgb = (p, q, t) => {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1/6) return p + (q - p) * 6 * t;
          if (t < 1/2) return q;
          if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
          return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
      }
      return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
    }

    // RGB to hex
    function rgbToHex(r, g, b) {
      return '#' + [r, g, b].map(c => c.toString(16).padStart(2, '0').toUpperCase()).join('');
    }

    // Generate key hue offsets based on palette type
    function getKeyHues(baseHsl, type) {
      const h = baseHsl.h;
      switch (type) {
        case 'complementary':
          return [h, (h + 180) % 360];
        case 'triadic':
          return [h, (h + 120) % 360, (h + 240) % 360];
        case 'analogous':
          return [h, (h + 30) % 360, (h + 60) % 360, (h - 30 + 360) % 360, (h - 60 + 360) % 360];
        case 'split_complementary':
          return [h, (h + 150) % 360, (h + 210) % 360];
        case 'tetradic':
          return [h, (h + 90) % 360, (h + 180) % 360, (h + 270) % 360];
        case 'monochromatic':
          return [h]; // same hue, vary s/l
        default:
          return [h, (h + 180) % 360];
      }
    }

    const rgb = hexToRgb(baseColor);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const keyHues = getKeyHues(hsl, paletteType);

    // Generate palette colors
    let colors = [];
    if (paletteType === 'monochromatic') {
      // Vary lightness and saturation
      for (let i = 0; i < count; i++) {
        const lStep = 80 / (count + 1);
        const newL = Math.max(10, Math.min(90, 10 + lStep * (i + 1)));
        const sVar = Math.max(20, Math.min(100, hsl.s + (i % 2 === 0 ? 10 : -10)));
        const c = hslToRgb(hsl.h, sVar, newL);
        colors.push({ hex: rgbToHex(c.r, c.g, c.b), rgb: c, hsl: { h: hsl.h, s: sVar, l: newL } });
      }
    } else {
      // Start with key hues at base saturation/lightness
      for (const hue of keyHues) {
        const c = hslToRgb(hue, hsl.s, hsl.l);
        colors.push({ hex: rgbToHex(c.r, c.g, c.b), rgb: c, hsl: { h: hue, s: hsl.s, l: hsl.l } });
      }
      // Fill to count by interpolating
      let idx = 0;
      while (colors.length < count) {
        const baseC = colors[idx % keyHues.length];
        const nextC = colors[(idx + 1) % keyHues.length];
        const midH = (baseC.hsl.h + nextC.hsl.h) / 2;
        const midS = Math.max(20, Math.min(100, hsl.s + (colors.length % 2 === 0 ? 15 : -15)));
        const midL = Math.max(25, Math.min(85, hsl.l + (colors.length % 2 === 0 ? 10 : -10)));
        const c = hslToRgb(midH, midS, midL);
        colors.push({ hex: rgbToHex(c.r, c.g, c.b), rgb: c, hsl: { h: midH, s: midS, l: midL } });
        idx++;
      }
      // Trim to count
      colors = colors.slice(0, count);
    }

    // Palette type descriptions
    const descriptions = {
      complementary: 'Colors opposite on the color wheel, creating high contrast.',
      triadic: 'Three colors evenly spaced (120 degrees apart) on the color wheel.',
      analogous: 'Colors adjacent on the color wheel, creating harmonious blends.',
      split_complementary: 'Base color plus two colors adjacent to its complement.',
      tetradic: 'Four colors forming a rectangle on the color wheel.',
      monochromatic: 'Variations in lightness and saturation of a single hue.'
    };

    // Generate SVG
    const swatchW = 100;
    const swatchH = 120;
    const swatchGap = 20;
    const topPadding = 80;
    const bottomPadding = 60;
    const sidePadding = 40;

    const totalWidth = sidePadding * 2 + count * swatchW + (count - 1) * swatchGap;
    const totalHeight = topPadding + swatchH + bottomPadding + 60;

    let svgContent = '';

    // Background
    svgContent += `<rect width="${totalWidth}" height="${totalHeight}" fill="#1a1a2e" rx="12"/>`;

    // Title
    const typeLabel = paletteType.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    svgContent += `<text x="${totalWidth / 2}" y="30" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#ffffff">${typeLabel} Palette</text>`;

    // Description
    const desc = descriptions[paletteType] || '';
    svgContent += `<text x="${totalWidth / 2}" y="52" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" fill="#aaaaaa">${desc}</text>`;

    // Base color indicator
    svgContent += `<text x="${totalWidth / 2}" y="68" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" fill="#64ffda">Base: ${baseColor.toUpperCase()}</text>`;

    // Swatches
    for (let i = 0; i < colors.length; i++) {
      const c = colors[i];
      const x = sidePadding + i * (swatchW + swatchGap);
      const y = topPadding;

      // Swatch rectangle
      svgContent += `<rect x="${x}" y="${y}" width="${swatchW}" height="${swatchH}" rx="8" fill="${c.hex}" stroke="#ffffff22" stroke-width="1"/>`;

      // Hex label
      svgContent += `<text x="${x + swatchW / 2}" y="${y + swatchH + 18}" text-anchor="middle" font-family="monospace" font-size="12" font-weight="bold" fill="#ffffff">${c.hex}</text>`;

      // RGB label
      svgContent += `<text x="${x + swatchW / 2}" y="${y + swatchH + 34}" text-anchor="middle" font-family="monospace" font-size="10" fill="#aaaaaa">rgb(${c.rgb.r},${c.rgb.g},${c.rgb.b})</text>`;

      // Mark base color
      if (i === 0) {
        svgContent += `<circle cx="${x + swatchW / 2}" cy="${y + 12}" r="4" fill="#ffffff" opacity="0.8"/>`;
      }
    }

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${totalHeight}" viewBox="0 0 ${totalWidth} ${totalHeight}">${svgContent}</svg>`;

    const payload = JSON.stringify({
      svg: svg,
      palette_type: paletteType.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      base_color: baseColor.toUpperCase(),
      color_count: String(count),
      colors: colors.map(c => c.hex).join(', ')
    });
    const encodedPayload = encodeURIComponent(payload);
    return JSON.stringify({ webview: { url: 'webview.html?data=' + encodedPayload } });
  } catch (e) {
    console.error(e);
    return JSON.stringify({ error: `Failed to generate palette: ${e.message}` });
  }
};
