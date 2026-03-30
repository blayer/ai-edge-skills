window['ai_edge_gallery_get_result'] = async (data) => {
  try {
    const input = JSON.parse(data);
    const action = (input.action || 'start').toLowerCase();

    function makeWebview(state) {
      // Pass game display state to webview — never the secret
      const viewState = {
        min: state.min,
        max: state.max,
        currentLo: state.currentLo,
        currentHi: state.currentHi,
        attempts: state.attempts,
        guessHistory: state.guessHistory,
        status: state.status
      };
      const encoded = encodeURIComponent(JSON.stringify(viewState));
      return { webview: { url: `webview.html?data=${encoded}` }, game_state: state };
    }

    if (action === 'start' || !input.game_state) {
      const min = input.min || 1;
      const max = input.max || 100;
      const secret = input.seed_number || Math.floor(Math.random() * (max - min + 1)) + min;
      const state = {
        secret, min, max,
        currentLo: min, currentHi: max,
        attempts: 0,
        guessHistory: [],
        status: 'playing'
      };
      return JSON.stringify(makeWebview(state));
    }

    if (action === 'guess') {
      const state = typeof input.game_state === 'string' ? JSON.parse(input.game_state) : input.game_state;
      if (state.status !== 'playing') {
        return JSON.stringify(makeWebview(state));
      }

      const guess = parseInt(input.guess);
      if (isNaN(guess)) {
        return JSON.stringify({ error: 'Please provide a valid number.' });
      }

      state.attempts++;
      let hint;
      if (guess === state.secret) {
        hint = 'correct';
        state.status = 'won';
      } else if (guess < state.secret) {
        hint = 'higher';
        state.currentLo = Math.max(state.currentLo, guess + 1);
      } else {
        hint = 'lower';
        state.currentHi = Math.min(state.currentHi, guess - 1);
      }

      state.guessHistory.push({ guess, hint });
      return JSON.stringify(makeWebview(state));
    }

    return JSON.stringify({ error: 'Unknown action. Use "start" or "guess".' });
  } catch (e) {
    return JSON.stringify({ error: e.message });
  }
};
