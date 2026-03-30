window['ai_edge_gallery_get_result'] = async (data) => {
  try {
  const input = JSON.parse(data);
  const shape = (input.shape || 'circle').toLowerCase();
  const color = input.color || '#4A90D9';
  const size = input.size || 64;
  const bg = input.background || 'transparent';

  const shapes = {
    circle: `<circle cx="${size/2}" cy="${size/2}" r="${size*0.4}" fill="${color}"/>`,
    square: `<rect x="${size*0.1}" y="${size*0.1}" width="${size*0.8}" height="${size*0.8}" rx="${size*0.05}" fill="${color}"/>`,
    star: (function() {
      const cx = size/2, cy = size/2, outerR = size*0.45, innerR = size*0.18;
      let points = '';
      for (let i = 0; i < 5; i++) {
        const outerAngle = (i * 72 - 90) * Math.PI / 180;
        const innerAngle = ((i * 72) + 36 - 90) * Math.PI / 180;
        points += `${cx + outerR * Math.cos(outerAngle)},${cy + outerR * Math.sin(outerAngle)} `;
        points += `${cx + innerR * Math.cos(innerAngle)},${cy + innerR * Math.sin(innerAngle)} `;
      }
      return `<polygon points="${points.trim()}" fill="${color}"/>`;
    })(),
    heart: `<path d="M${size/2} ${size*0.8} C${size*0.1} ${size*0.5} ${size*0.1} ${size*0.2} ${size/2} ${size*0.35} C${size*0.9} ${size*0.2} ${size*0.9} ${size*0.5} ${size/2} ${size*0.8}Z" fill="${color}"/>`,
    arrow: `<path d="M${size*0.5} ${size*0.15} L${size*0.8} ${size*0.5} L${size*0.6} ${size*0.5} L${size*0.6} ${size*0.85} L${size*0.4} ${size*0.85} L${size*0.4} ${size*0.5} L${size*0.2} ${size*0.5} Z" fill="${color}"/>`,
    check: `<polyline points="${size*0.2},${size*0.5} ${size*0.4},${size*0.7} ${size*0.8},${size*0.3}" fill="none" stroke="${color}" stroke-width="${size*0.08}" stroke-linecap="round" stroke-linejoin="round"/>`,
    cross: `<g stroke="${color}" stroke-width="${size*0.08}" stroke-linecap="round"><line x1="${size*0.25}" y1="${size*0.25}" x2="${size*0.75}" y2="${size*0.75}"/><line x1="${size*0.75}" y1="${size*0.25}" x2="${size*0.25}" y2="${size*0.75}"/></g>`,
    home: `<path d="M${size*0.5} ${size*0.15} L${size*0.15} ${size*0.5} L${size*0.25} ${size*0.5} L${size*0.25} ${size*0.85} L${size*0.42} ${size*0.85} L${size*0.42} ${size*0.6} L${size*0.58} ${size*0.6} L${size*0.58} ${size*0.85} L${size*0.75} ${size*0.85} L${size*0.75} ${size*0.5} L${size*0.85} ${size*0.5} Z" fill="${color}"/>`,
    user: `<circle cx="${size/2}" cy="${size*0.32}" r="${size*0.16}" fill="${color}"/><path d="M${size*0.2} ${size*0.85} Q${size*0.2} ${size*0.55} ${size*0.5} ${size*0.55} Q${size*0.8} ${size*0.55} ${size*0.8} ${size*0.85}" fill="${color}"/>`,
    gear: (function() {
      const cx = size/2, cy = size/2, outerR = size*0.42, innerR = size*0.3;
      let path = '';
      for (let i = 0; i < 8; i++) {
        const a1 = (i * 45 - 10) * Math.PI / 180;
        const a2 = (i * 45 + 10) * Math.PI / 180;
        const a3 = (i * 45 + 22.5 - 10) * Math.PI / 180;
        const a4 = (i * 45 + 22.5 + 10) * Math.PI / 180;
        path += `${i===0?'M':'L'}${cx+outerR*Math.cos(a1)},${cy+outerR*Math.sin(a1)} `;
        path += `L${cx+outerR*Math.cos(a2)},${cy+outerR*Math.sin(a2)} `;
        path += `L${cx+innerR*Math.cos(a3)},${cy+innerR*Math.sin(a3)} `;
        path += `L${cx+innerR*Math.cos(a4)},${cy+innerR*Math.sin(a4)} `;
      }
      return `<path d="${path}Z" fill="${color}"/><circle cx="${cx}" cy="${cy}" r="${size*0.12}" fill="${bg === 'transparent' ? '#fff' : bg}"/>`;
    })()
  };

  const shapeContent = shapes[shape] || shapes.circle;
  const bgRect = bg !== 'transparent' ? `<rect width="${size}" height="${size}" fill="${bg}"/>` : '';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${bgRect}${shapeContent}</svg>`;

  const payload = JSON.stringify({ svg, shape, color, size, background: bg });
  const encoded = encodeURIComponent(payload);
  return JSON.stringify({ webview: { url: `webview.html?data=${encoded}` } });
  } catch (e) {
    console.error(e);
    return JSON.stringify({ error: `Failed to generate icon: ${e.message}` });
  }
};
