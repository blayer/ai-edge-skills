window['ai_edge_gallery_get_result'] = async (data) => {
  try {
    const jsonData = JSON.parse(data);
    const action = jsonData.action || 'analyze';
    const text = jsonData.text || '';
    const date = jsonData.date || new Date().toISOString().split('T')[0];
    const gameState = jsonData.game_state || {};

    if (!gameState.entries) gameState.entries = [];

    const negativeWords = ['exhausted', 'overwhelmed', 'frustrated', 'stressed', 'anxious', 'burned out', 'burnout', 'drained', 'miserable', 'hopeless', 'depressed', 'angry', 'resentful', 'defeated', 'struggling'];
    const positiveWords = ['great', 'happy', 'excited', 'accomplished', 'motivated', 'energized', 'grateful', 'peaceful', 'confident', 'proud', 'relaxed', 'joyful', 'fulfilled', 'optimistic'];
    const urgencyMarkers = ['asap', 'deadline', 'urgent', 'immediately', 'rush', 'emergency', 'critical', 'overdue', 'behind schedule', 'time crunch'];
    const fatigueMarkers = ['tired', "can't sleep", 'no energy', 'insomnia', 'exhaustion', 'worn out', 'no motivation', 'dragging', 'sluggish', 'fatigue'];

    function countMatches(text, wordList) {
      const lower = text.toLowerCase();
      let count = 0;
      for (const word of wordList) {
        const regex = new RegExp('\\b' + word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'gi');
        const matches = lower.match(regex);
        if (matches) count += matches.length;
      }
      return count;
    }

    function analyzeText(text) {
      const negCount = countMatches(text, negativeWords);
      const posCount = countMatches(text, positiveWords);
      const urgCount = countMatches(text, urgencyMarkers);
      const fatCount = countMatches(text, fatigueMarkers);

      const totalSentiment = negCount + posCount;
      const negPct = totalSentiment > 0 ? Math.round((negCount / totalSentiment) * 100) : 0;

      // Stress score: weighted combination, clamped 1-10
      let score = 1 + (negCount * 1.5) + (urgCount * 1.2) + (fatCount * 1.8) - (posCount * 0.8);
      score = Math.max(1, Math.min(10, Math.round(score)));

      let level = 'Low';
      if (score >= 7) level = 'High';
      else if (score >= 4) level = 'Moderate';

      let recommendation = 'Keep up the good work! Your stress levels appear manageable.';
      if (score >= 7) recommendation = 'Consider activating Focus Mode. Take breaks, delegate tasks, and prioritize rest.';
      else if (score >= 4) recommendation = 'Monitor your workload. Consider scheduling downtime and reviewing priorities.';

      return { score, level, negCount, posCount, urgCount, fatCount, negPct, recommendation };
    }

    if (action === 'analyze') {
      if (!text) {
        return JSON.stringify({ error: 'Text is required for analyze action.' });
      }
      const a = analyzeText(text);
      return JSON.stringify({
        result: `BURNOUT ANALYSIS\n\nStress Level: ${a.score}/10 (${a.level})\n\nIndicators:\n- Fatigue language: ${a.fatCount} instance(s)\n- Urgency markers: ${a.urgCount} instance(s)\n- Negative sentiment: ${a.negPct}%\n- Positive indicators: ${a.posCount} instance(s)\n\nRecommendation: ${a.recommendation}`
      });
    }

    if (action === 'track') {
      if (!text) {
        return JSON.stringify({ error: 'Text is required for track action.' });
      }
      const a = analyzeText(text);
      gameState.entries.push({ date, score: a.score, level: a.level, negPct: a.negPct });

      return JSON.stringify({
        result: `BURNOUT TRACKING\n\nEntry recorded for ${date}\nStress Level: ${a.score}/10 (${a.level})\n\nTotal tracked entries: ${gameState.entries.length}\n\nRecommendation: ${a.recommendation}`,
        game_state: gameState
      });
    }

    if (action === 'report') {
      if (gameState.entries.length === 0) {
        return JSON.stringify({ result: 'BURNOUT REPORT\n\nNo entries tracked yet. Use action "track" to log daily entries.' });
      }
      const entries = gameState.entries;
      const avgScore = (entries.reduce((s, e) => s + e.score, 0) / entries.length).toFixed(1);
      const maxEntry = entries.reduce((a, b) => a.score > b.score ? a : b);
      const minEntry = entries.reduce((a, b) => a.score < b.score ? a : b);

      const recent = entries.slice(-5);
      const trend = recent.map(e => `  ${e.date}: ${e.score}/10 (${e.level})`).join('\n');

      let trendDir = 'Stable';
      if (recent.length >= 2) {
        const first = recent[0].score;
        const last = recent[recent.length - 1].score;
        if (last - first >= 2) trendDir = 'Increasing (worsening)';
        else if (first - last >= 2) trendDir = 'Decreasing (improving)';
      }

      return JSON.stringify({
        result: `BURNOUT REPORT\n\nEntries: ${entries.length}\nAverage Stress: ${avgScore}/10\nPeak Stress: ${maxEntry.score}/10 on ${maxEntry.date}\nLowest Stress: ${minEntry.score}/10 on ${minEntry.date}\nTrend: ${trendDir}\n\nRecent Entries:\n${trend}`,
        game_state: gameState
      });
    }

    return JSON.stringify({ error: `Unknown action '${action}'. Use analyze, track, or report.` });
  } catch (e) {
    console.error(e);
    return JSON.stringify({ error: `Burnout Predictor error: ${e.message}` });
  }
};
