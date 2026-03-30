window['ai_edge_gallery_get_result'] = async (data) => {
  try {
    const input = JSON.parse(data);
    const action = (input.action || 'start').toLowerCase();
    const ALL_COLORS = ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'cyan'];
    const MAX_ATTEMPTS = 10;

    function evaluate(secret, guess) {
      let exact = 0, misplaced = 0;
      const sRemain = [], gRemain = [];
      for (let i = 0; i < 4; i++) {
        if (guess[i] === secret[i]) exact++;
        else { sRemain.push(secret[i]); gRemain.push(guess[i]); }
      }
      for (const g of gRemain) {
        const idx = sRemain.indexOf(g);
        if (idx !== -1) { misplaced++; sRemain.splice(idx, 1); }
      }
      return { exact, misplaced };
    }

    function makeWebview(state) {
      const viewState = {
        palette: state.palette,
        history: state.history,
        attempts: state.attempts,
        maxAttempts: MAX_ATTEMPTS,
        status: state.status,
        secret: state.status !== 'playing' ? state.secret : null
      };
      const encoded = encodeURIComponent(JSON.stringify(viewState));
      return { webview: { url: `webview.html?data=${encoded}` }, game_state: state };
    }

    if (action === 'start' || !input.game_state) {
      const numColors = Math.min(Math.max(input.colors || 6, 4), 8);
      const palette = ALL_COLORS.slice(0, numColors);
      const secret = input.seed_code || Array.from({ length: 4 }, () => palette[Math.floor(Math.random() * palette.length)]);
      const state = { secret, palette, history: [], attempts: 0, status: 'playing' };
      return JSON.stringify(makeWebview(state));
    }

    if (action === 'guess') {
      const state = typeof input.game_state === 'string' ? JSON.parse(input.game_state) : input.game_state;
      if (state.status !== 'playing') {
        return JSON.stringify(makeWebview(state));
      }

      const guess = input.guess;
      if (!Array.isArray(guess) || guess.length !== 4) {
        return JSON.stringify({ error: 'Provide exactly 4 colors.' });
      }
      const normalized = guess.map(c => c.toLowerCase());
      for (const c of normalized) {
        if (!state.palette.includes(c)) {
          return JSON.stringify({ error: `Invalid color "${c}". Use: ${state.palette.join(', ')}` });
        }
      }

      state.attempts++;
      const result = evaluate(state.secret, normalized);
      state.history.push({ guess: normalized, exact: result.exact, misplaced: result.misplaced });

      if (result.exact === 4) {
        state.status = 'won';
      } else if (state.attempts >= MAX_ATTEMPTS) {
        state.status = 'lost';
      }

      return JSON.stringify(makeWebview(state));
    }

    return JSON.stringify({ error: 'Unknown action. Use "start" or "guess".' });
  } catch (e) {
    return JSON.stringify({ error: e.message });
  }
};
