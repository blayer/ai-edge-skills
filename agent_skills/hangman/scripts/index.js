window['ai_edge_gallery_get_result'] = async (data) => {
  try {
    const input = JSON.parse(data);

    // The model's only job is to launch the webview with a category.
    // The webview handles word selection, game logic, and all interaction.
    // No word or game state is ever passed back to the model.
    const categories = ['animals', 'countries', 'fruits', 'colors', 'sports'];
    const category = categories.includes(input.category) ? input.category : categories[Math.floor(Math.random() * categories.length)];

    const encoded = encodeURIComponent(JSON.stringify({ category }));
    return JSON.stringify({ webview: { url: `webview.html?data=${encoded}` } });
  } catch (e) {
    return JSON.stringify({ error: e.message });
  }
};
