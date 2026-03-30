window['ai_edge_gallery_get_result'] = async (data) => {
  try {
    const input = JSON.parse(data);
    const action = (input.action || 'deal').toLowerCase();
    let state = input.game_state ? (typeof input.game_state === 'string' ? JSON.parse(input.game_state) : input.game_state) : null;

    const SUITS = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const SUIT_SYMBOLS = { Hearts: '\u2665', Diamonds: '\u2666', Clubs: '\u2663', Spades: '\u2660' };

    function createDeck(numDecks) {
      const deck = [];
      for (let d = 0; d < numDecks; d++) {
        for (const suit of SUITS) {
          for (const rank of RANKS) {
            deck.push({ rank, suit });
          }
        }
      }
      // Fisher-Yates shuffle
      for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
      }
      return deck;
    }

    function cardValue(card) {
      if (['J', 'Q', 'K'].includes(card.rank)) return 10;
      if (card.rank === 'A') return 11;
      return parseInt(card.rank);
    }

    function handValue(hand) {
      let total = 0;
      let aces = 0;
      for (const card of hand) {
        total += cardValue(card);
        if (card.rank === 'A') aces++;
      }
      while (total > 21 && aces > 0) {
        total -= 10;
        aces--;
      }
      return total;
    }

    function cardStr(card) {
      return `${card.rank}${SUIT_SYMBOLS[card.suit]}`;
    }

    function handStr(hand) {
      return hand.map(cardStr).join(' ');
    }

    function formatResult(state, message) {
      const viewState = {
        dealer: state.dealer,
        player: state.player,
        status: state.status,
        outcome: state.outcome,
        message: message,
        dealerValue: state.status === 'playing' ? null : handValue(state.dealer),
        playerValue: handValue(state.player)
      };
      const encoded = encodeURIComponent(JSON.stringify(viewState));
      return {
        webview: { url: `webview.html?data=${encoded}` },
        game_state: state
      };
    }

    // Start new game
    if (action === 'deal' || !state) {
      const numDecks = input.decks || 1;
      const deck = createDeck(numDecks);
      state = {
        deck,
        player: [deck.pop(), deck.pop()],
        dealer: [deck.pop(), deck.pop()],
        status: 'playing',
        outcome: null
      };

      // Check for natural blackjack
      if (handValue(state.player) === 21) {
        if (handValue(state.dealer) === 21) {
          state.status = 'done';
          state.outcome = 'Push! Both have Blackjack.';
        } else {
          state.status = 'done';
          state.outcome = 'Blackjack! You win!';
        }
        return JSON.stringify(formatResult(state, 'Blackjack dealt!'));
      }

      return JSON.stringify(formatResult(state, 'Cards dealt!'));
    }

    // Hit
    if (action === 'hit') {
      if (state.status !== 'playing') {
        return JSON.stringify(formatResult(state, 'Game is over. Deal a new hand.'));
      }

      state.player.push(state.deck.pop());
      const pv = handValue(state.player);

      if (pv > 21) {
        state.status = 'done';
        state.outcome = `Bust! You went over with ${pv}. Dealer wins.`;
        return JSON.stringify(formatResult(state, 'You hit and busted!'));
      }
      if (pv === 21) {
        // Auto-stand on 21
        return stand(state);
      }
      return JSON.stringify(formatResult(state, 'You hit.'));
    }

    // Stand
    if (action === 'stand') {
      if (state.status !== 'playing') {
        return JSON.stringify(formatResult(state, 'Game is over. Deal a new hand.'));
      }
      return JSON.stringify(stand(state));
    }

    function stand(state) {
      // Dealer draws to 17
      while (handValue(state.dealer) < 17) {
        state.dealer.push(state.deck.pop());
      }

      const pv = handValue(state.player);
      const dv = handValue(state.dealer);
      state.status = 'done';

      if (dv > 21) {
        state.outcome = `Dealer busts with ${dv}! You win!`;
      } else if (pv > dv) {
        state.outcome = `You win! ${pv} beats ${dv}.`;
      } else if (dv > pv) {
        state.outcome = `Dealer wins. ${dv} beats ${pv}.`;
      } else {
        state.outcome = `Push! Both have ${pv}.`;
      }

      return formatResult(state, 'You stand.');
    }

    return JSON.stringify({ error: `Unknown action: ${action}. Use "deal", "hit", or "stand".` });
  } catch (e) {
    console.error(e);
    return JSON.stringify({ error: `Blackjack error: ${e.message}` });
  }
};
