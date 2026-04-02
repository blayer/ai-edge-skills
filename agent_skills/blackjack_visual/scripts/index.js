window['ai_edge_gallery_get_result'] = async (data) => {
  try {
    const input = JSON.parse(data);
    const action = (input.action || 'deal').toLowerCase();

    const SUITS = { H: 'Hearts', D: 'Diamonds', C: 'Clubs', S: 'Spades' };
    const SUIT_SYMBOLS = { H: '\u2665', D: '\u2666', C: '\u2663', S: '\u2660' };
    const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

    // Parse card string like "7H", "10C", "AS"
    function parseCard(s) {
      s = String(s).trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
      if (s.length < 2) return { rank: s || '?', suit: '?' };
      const suit = s[s.length - 1];
      const rank = s.slice(0, -1);
      if (!RANKS.includes(rank) || !SUITS[suit]) return { rank: rank || '?', suit: suit || '?' };
      return { rank, suit };
    }

    // Obfuscate hidden card: prefix with "x" so model passes it as opaque token
    function encodeHidden(s) {
      return 'x' + String(s);
    }

    // Decode: strip "x" prefix
    function decodeHidden(s) {
      s = String(s).trim().toUpperCase();
      if (s.startsWith('X')) return s.slice(1);
      return s;
    }

    function cardValue(rank) {
      if (['J', 'Q', 'K'].includes(rank)) return 10;
      if (rank === 'A') return 11;
      return parseInt(rank);
    }

    function handTotal(cards) {
      let total = 0, aces = 0;
      for (const c of cards) {
        const { rank } = parseCard(c);
        total += cardValue(rank);
        if (rank === 'A') aces++;
      }
      while (total > 21 && aces > 0) { total -= 10; aces--; }
      return total;
    }

    function prettyCard(c) {
      const { rank, suit } = parseCard(c);
      return rank + (SUIT_SYMBOLS[suit] || suit);
    }

    function prettyHand(cards) {
      return cards.map(prettyCard).join(' ');
    }

    // Pick a random card not in usedSet
    function randomCard(usedSet) {
      const all = [];
      for (const r of RANKS) for (const s of Object.keys(SUITS)) all.push(r + s);
      const available = all.filter(c => !usedSet.has(c));
      return available[Math.floor(Math.random() * available.length)];
    }

    function makeWebview(playerCards, dealerCards, status, outcome, message) {
      const viewState = {
        dealer: dealerCards.map(c => { const p = parseCard(c); return { rank: p.rank, suit: SUITS[p.suit] || p.suit }; }),
        player: playerCards.map(c => { const p = parseCard(c); return { rank: p.rank, suit: SUITS[p.suit] || p.suit }; }),
        status,
        outcome,
        message,
        dealerValue: status === 'playing' ? null : handTotal(dealerCards),
        playerValue: handTotal(playerCards)
      };
      return { url: 'webview.html?data=' + encodeURIComponent(JSON.stringify(viewState)) };
    }

    // === DEAL ===
    if (action === 'deal') {
      const used = new Set();
      const p1 = randomCard(used); used.add(p1);
      const p2 = randomCard(used); used.add(p2);
      const d1 = randomCard(used); used.add(d1);
      const d2 = randomCard(used); used.add(d2);

      const playerCards = [p1, p2];
      const pv = handTotal(playerCards);
      const dv = handTotal([d1, d2]);
      const hiddenCard = encodeHidden(d2);

      // Natural blackjack check
      if (pv === 21) {
        const allDealer = [d1, d2];
        if (dv === 21) {
          const txt = `Your hand: ${prettyHand(playerCards)} (21). Dealer: ${prettyHand(allDealer)} (21). Push — both have Blackjack! Ask the player if they want to play again.\n\nIMPORTANT: If the player wants to play again, call run_js with data: {"action": "deal"}`;
          return JSON.stringify({ result: txt, player_cards: playerCards, dealer_cards: allDealer, player_value: 21, dealer_value: 21, status: 'push', webview: makeWebview(playerCards, allDealer, 'done', 'Push! Both have Blackjack.', txt) });
        }
        const txt = `Blackjack! Your hand: ${prettyHand(playerCards)} (21). Dealer: ${prettyHand(allDealer)} (${dv}). You win! Ask the player if they want to play again.\n\nIMPORTANT: If the player wants to play again, call run_js with data: {"action": "deal"}`;
        return JSON.stringify({ result: txt, player_cards: playerCards, dealer_cards: allDealer, player_value: 21, dealer_value: dv, status: 'blackjack', webview: makeWebview(playerCards, allDealer, 'done', 'Blackjack! You win!', txt) });
      }

      const txt = `Your hand: ${prettyHand(playerCards)} (${pv}). Dealer shows: ${prettyCard(d1)} [?]. Ask the player: hit or stand?\n\nIMPORTANT: When the player says "hit" or "stand", you MUST call run_js with data: {"action": "hit_or_stand", "player_cards": ${JSON.stringify(playerCards)}, "dealer_visible": "${d1}", "dealer_hidden": "${hiddenCard}"}. Replace hit_or_stand with "hit" or "stand". Copy the exact card values above.`;
      return JSON.stringify({ result: txt, player_cards: playerCards, dealer_visible: d1, dealer_hidden: hiddenCard, player_value: pv, status: 'playing', webview: makeWebview(playerCards, [d1], 'playing', null, txt) });
    }

    // === HIT ===
    if (action === 'hit') {
      const playerCards = (input.player_cards || []).map(c => String(c).toUpperCase());
      const dealerVis = String(input.dealer_visible || '').toUpperCase();
      const dealerHid = String(input.dealer_hidden || '');

      if (!playerCards.length || !dealerVis) {
        return JSON.stringify({ error: 'Missing player_cards or dealer_visible. Pass the card values from the previous result.' });
      }

      // Collect used cards to avoid duplicates
      const used = new Set(playerCards);
      used.add(dealerVis);
      const realHidden = decodeHidden(dealerHid);
      used.add(realHidden);

      // Draw new card
      const drawn = randomCard(used);
      playerCards.push(drawn);
      const pv = handTotal(playerCards);

      if (pv > 21) {
        const dealerCards = [dealerVis, realHidden];
        const dv = handTotal(dealerCards);
        const txt = `You drew ${prettyCard(drawn)}. Your hand: ${prettyHand(playerCards)} (${pv}). Bust! Dealer wins. Ask the player if they want to play again.\n\nIMPORTANT: If the player wants to play again, call run_js with data: {"action": "deal"}`;
        return JSON.stringify({ result: txt, player_cards: playerCards, dealer_cards: dealerCards, player_value: pv, dealer_value: dv, status: 'bust', webview: makeWebview(playerCards, dealerCards, 'done', 'Bust! Dealer wins.', txt) });
      }

      if (pv === 21) {
        // Auto-stand
        return doStand(playerCards, dealerVis, realHidden, used);
      }

      const txt = `You drew ${prettyCard(drawn)}. Your hand: ${prettyHand(playerCards)} (${pv}). Dealer shows: ${prettyCard(dealerVis)} [?]. Ask the player: hit or stand?\n\nIMPORTANT: When the player says "hit" or "stand", you MUST call run_js with data: {"action": "hit_or_stand", "player_cards": ${JSON.stringify(playerCards)}, "dealer_visible": "${dealerVis}", "dealer_hidden": "${dealerHid}"}. Replace hit_or_stand with "hit" or "stand". Copy the exact card values above.`;
      return JSON.stringify({ result: txt, player_cards: playerCards, dealer_visible: dealerVis, dealer_hidden: dealerHid, player_value: pv, status: 'playing', webview: makeWebview(playerCards, [dealerVis], 'playing', null, txt) });
    }

    // === STAND ===
    if (action === 'stand') {
      const playerCards = (input.player_cards || []).map(c => String(c).toUpperCase());
      const dealerVis = String(input.dealer_visible || '').toUpperCase();
      const dealerHid = String(input.dealer_hidden || '');

      if (!playerCards.length || !dealerVis) {
        return JSON.stringify({ error: 'Missing player_cards or dealer_visible. Pass the card values from the previous result.' });
      }

      const realHidden = decodeHidden(dealerHid);
      const used = new Set(playerCards);
      used.add(dealerVis);
      used.add(realHidden);

      return doStand(playerCards, dealerVis, realHidden, used);
    }

    function doStand(playerCards, dealerVis, dealerHoleCard, used) {
      const dealerCards = [dealerVis, dealerHoleCard];
      const dealerDraws = [];

      while (handTotal(dealerCards) < 17) {
        const c = randomCard(used);
        used.add(c);
        dealerCards.push(c);
        dealerDraws.push(c);
      }

      const pv = handTotal(playerCards);
      const dv = handTotal(dealerCards);
      let outcome;

      if (dv > 21) {
        outcome = `Dealer busts with ${dv}! You win!`;
      } else if (pv > dv) {
        outcome = `You win! ${pv} beats ${dv}.`;
      } else if (dv > pv) {
        outcome = `Dealer wins. ${dv} beats ${pv}.`;
      } else {
        outcome = `Push! Both have ${pv}.`;
      }

      let txt = `Dealer reveals: ${prettyHand(dealerCards)} (${dv}).`;
      if (dealerDraws.length > 0) {
        txt += ` Dealer drew: ${dealerDraws.map(prettyCard).join(', ')}.`;
      }
      txt += ` ${outcome} Ask the player if they want to play again.\n\nIMPORTANT: If the player wants to play again, call run_js with data: {"action": "deal"}`;

      const status = dv > 21 || pv > dv ? 'win' : dv > pv ? 'lose' : 'push';
      return JSON.stringify({ result: txt, player_cards: playerCards, dealer_cards: dealerCards, player_value: pv, dealer_value: dv, status, webview: makeWebview(playerCards, dealerCards, 'done', outcome, txt) });
    }

    return JSON.stringify({ error: 'Unknown action: ' + action + '. Use "deal", "hit", or "stand".' });
  } catch (e) {
    console.error(e);
    return JSON.stringify({ error: 'Blackjack error: ' + e.message });
  }
};
