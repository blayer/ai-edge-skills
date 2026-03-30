window['ai_edge_gallery_get_result'] = async (data) => {
  try {
    const input = JSON.parse(data);
    const category = (input.category || 'mixed').toLowerCase();
    const encoded = encodeURIComponent(JSON.stringify({ category }));
    return JSON.stringify({ webview: { url: `webview.html?data=${encoded}` } });
  } catch (e) {
    return JSON.stringify({ error: e.message });
  }
};
