window['ai_edge_gallery_get_result'] = async (data) => {
  try {
    const input = JSON.parse(data);
    const text = input.text || '';
    const orientation = (input.orientation || 'vertical').toLowerCase();
    const style = (input.style || 'simple').toLowerCase();

    if (!text.trim()) {
      return JSON.stringify({ error: 'The "text" field is required.' });
    }

    // Parse text into steps
    function parseSteps(text) {
      let lines = text.split(/\n/).map(l => l.trim()).filter(l => l.length > 0);
      // If only one line, try splitting by sentences
      if (lines.length === 1) {
        lines = text.split(/[.;]/).map(l => l.trim()).filter(l => l.length > 0);
      }
      // Remove numbering prefixes like "1.", "2)", "Step 1:", etc.
      return lines.map(l => l.replace(/^\d+[\.\)\:]?\s*/, '').replace(/^step\s+\d+[\.\:\-]?\s*/i, '').trim()).filter(l => l.length > 0);
    }

    function isDecision(step) {
      const lower = step.toLowerCase();
      return /\b(if|whether|decision|check)\b/.test(lower) || step.includes('?');
    }

    const steps = parseSteps(text);
    if (steps.length === 0) {
      return JSON.stringify({ error: 'No steps could be parsed from the text.' });
    }

    // Layout constants
    const boxWidth = style === 'detailed' ? 200 : 160;
    const boxHeight = style === 'detailed' ? 50 : 40;
    const diamondSize = style === 'detailed' ? 60 : 50;
    const spacing = 120;
    const padding = 60;
    const fontSize = style === 'detailed' ? 13 : 12;
    const arrowColor = '#64ffda';
    const rectFill = '#16213e';
    const rectStroke = '#64ffda';
    const diamondFill = '#1a1a2e';
    const diamondStroke = '#ffd700';
    const startFill = '#1b5e20';
    const endFill = '#b71c1c';
    const textColor = '#ffffff';

    // Build node list: Start + steps + End
    const nodes = [];
    nodes.push({ label: 'Start', type: 'start' });
    for (const s of steps) {
      nodes.push({ label: s, type: isDecision(s) ? 'decision' : 'step' });
    }
    nodes.push({ label: 'End', type: 'end' });

    const isVertical = orientation === 'vertical';
    const totalNodes = nodes.length;

    // Calculate positions
    for (let i = 0; i < totalNodes; i++) {
      if (isVertical) {
        nodes[i].x = padding + boxWidth / 2;
        nodes[i].y = padding + i * spacing + boxHeight / 2;
      } else {
        nodes[i].x = padding + i * (boxWidth + spacing / 2);
        nodes[i].y = padding + boxHeight / 2 + diamondSize / 2;
      }
    }

    // SVG dimensions
    let svgWidth, svgHeight;
    if (isVertical) {
      svgWidth = boxWidth + padding * 2;
      svgHeight = totalNodes * spacing + padding * 2;
    } else {
      svgWidth = totalNodes * (boxWidth + spacing / 2) + padding * 2;
      svgHeight = boxHeight + diamondSize + padding * 2 + 40;
    }

    // Word wrap helper
    function wrapText(text, maxChars) {
      const words = text.split(' ');
      const lines = [];
      let current = '';
      for (const w of words) {
        if ((current + ' ' + w).trim().length > maxChars && current.length > 0) {
          lines.push(current.trim());
          current = w;
        } else {
          current = (current + ' ' + w).trim();
        }
      }
      if (current.length > 0) lines.push(current);
      return lines;
    }

    // Build SVG elements
    let elements = '';

    // Defs for arrowhead
    elements += `<defs>
      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="${arrowColor}"/>
      </marker>
    </defs>`;

    // Background
    elements += `<rect width="${svgWidth}" height="${svgHeight}" fill="#0a0a1a" rx="8"/>`;

    // Title
    if (style === 'detailed') {
      elements += `<text x="${svgWidth / 2}" y="25" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="${arrowColor}">Procedure Flow</text>`;
    }

    // Draw arrows
    for (let i = 0; i < totalNodes - 1; i++) {
      const from = nodes[i];
      const to = nodes[i + 1];
      if (isVertical) {
        const fromY = from.y + (from.type === 'decision' ? diamondSize / 2 : boxHeight / 2);
        const toY = to.y - (to.type === 'decision' ? diamondSize / 2 : boxHeight / 2);
        elements += `<line x1="${from.x}" y1="${fromY}" x2="${to.x}" y2="${toY}" stroke="${arrowColor}" stroke-width="2" marker-end="url(#arrowhead)"/>`;
      } else {
        const fromX = from.x + boxWidth / 2;
        const toX = to.x - boxWidth / 2;
        elements += `<line x1="${fromX}" y1="${from.y}" x2="${toX}" y2="${to.y}" stroke="${arrowColor}" stroke-width="2" marker-end="url(#arrowhead)"/>`;
      }
    }

    // Draw nodes
    for (const node of nodes) {
      const cx = node.x;
      const cy = node.y;

      if (node.type === 'start' || node.type === 'end') {
        const fill = node.type === 'start' ? startFill : endFill;
        const rw = boxWidth * 0.6;
        const rh = boxHeight * 0.8;
        elements += `<rect x="${cx - rw / 2}" y="${cy - rh / 2}" width="${rw}" height="${rh}" rx="${rh / 2}" fill="${fill}" stroke="${rectStroke}" stroke-width="2"/>`;
        elements += `<text x="${cx}" y="${cy + fontSize / 3}" text-anchor="middle" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="bold" fill="${textColor}">${node.label}</text>`;
      } else if (node.type === 'decision') {
        const d = diamondSize;
        elements += `<rect x="${cx - d / 2}" y="${cy - d / 2}" width="${d}" height="${d}" transform="rotate(45 ${cx} ${cy})" fill="${diamondFill}" stroke="${diamondStroke}" stroke-width="2"/>`;
        const lines = wrapText(node.label, 14);
        const lineHeight = fontSize + 2;
        const startY = cy - ((lines.length - 1) * lineHeight) / 2;
        for (let li = 0; li < lines.length; li++) {
          elements += `<text x="${cx}" y="${startY + li * lineHeight + fontSize / 3}" text-anchor="middle" font-family="Arial, sans-serif" font-size="${fontSize - 1}" fill="${textColor}">${escapeXml(lines[li])}</text>`;
        }
      } else {
        // Regular step - rectangle
        elements += `<rect x="${cx - boxWidth / 2}" y="${cy - boxHeight / 2}" width="${boxWidth}" height="${boxHeight}" rx="6" fill="${rectFill}" stroke="${rectStroke}" stroke-width="2"/>`;
        const lines = wrapText(node.label, 22);
        const lineHeight = fontSize + 2;
        const startY = cy - ((lines.length - 1) * lineHeight) / 2;
        for (let li = 0; li < lines.length; li++) {
          elements += `<text x="${cx}" y="${startY + li * lineHeight + fontSize / 3}" text-anchor="middle" font-family="Arial, sans-serif" font-size="${fontSize}" fill="${textColor}">${escapeXml(lines[li])}</text>`;
        }

        // Detailed style: add step number
        if (style === 'detailed') {
          const stepIndex = nodes.indexOf(node);
          elements += `<text x="${cx - boxWidth / 2 + 8}" y="${cy - boxHeight / 2 - 5}" font-family="Arial, sans-serif" font-size="10" fill="${arrowColor}">Step ${stepIndex}</text>`;
        }
      }
    }

    function escapeXml(str) {
      return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
    }

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">${elements}</svg>`;

    const payload = JSON.stringify({
      svg: svg,
      orientation: orientation.charAt(0).toUpperCase() + orientation.slice(1),
      style: style.charAt(0).toUpperCase() + style.slice(1),
      steps: String(steps.length),
      dimensions: svgWidth + 'x' + svgHeight
    });
    const encodedPayload = encodeURIComponent(payload);
    return JSON.stringify({ webview: { url: 'webview.html?data=' + encodedPayload } });
  } catch (e) {
    console.error(e);
    return JSON.stringify({ error: `Failed to generate procedure visualization: ${e.message}` });
  }
};
