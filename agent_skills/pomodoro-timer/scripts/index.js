window['ai_edge_gallery_get_result'] = async (data) => {
        try {
          const encoded = encodeURIComponent(data);
          return JSON.stringify({ webview: { url: `webview.html?data=${encoded}` } });
        } catch (e) {
          return JSON.stringify({ error: e.message });
        }
      };
