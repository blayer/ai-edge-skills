window['ai_edge_gallery_get_result'] = async (data) => {
  try {
    const input = JSON.parse(data);
    const count = Math.min(Math.max(input.count || 1, 1), 100);
    const sides = Math.min(Math.max(input.sides || 6, 2), 1000);
    const modifier = input.modifier || 0;
    const advantage = input.advantage || false;
    const disadvantage = input.disadvantage || false;

    function rollSet() {
      const rolls = [];
      for (let i = 0; i < count; i++) {
        rolls.push(Math.floor(Math.random() * sides) + 1);
      }
      return rolls;
    }

    const notation = `${count}d${sides}${modifier > 0 ? '+' + modifier : modifier < 0 ? modifier : ''}`;
    const lines = [];
    lines.push(`Rolling ${notation}...`);

    if (advantage || disadvantage) {
      const roll1 = rollSet();
      const roll2 = rollSet();
      const sum1 = roll1.reduce((a, b) => a + b, 0);
      const sum2 = roll2.reduce((a, b) => a + b, 0);
      const useFirst = advantage ? sum1 >= sum2 : sum1 <= sum2;
      const chosen = useFirst ? roll1 : roll2;
      const chosenSum = useFirst ? sum1 : sum2;

      lines.push(`Roll 1: [${roll1.join(', ')}] = ${sum1}`);
      lines.push(`Roll 2: [${roll2.join(', ')}] = ${sum2}`);
      lines.push(`${advantage ? 'Advantage' : 'Disadvantage'}: Taking ${advantage ? 'higher' : 'lower'} (${chosenSum})`);
      const total = chosenSum + modifier;
      if (modifier !== 0) lines.push(`Modifier: ${modifier > 0 ? '+' : ''}${modifier}`);
      lines.push(`Total: ${total}`);
    } else {
      const rolls = rollSet();
      const sum = rolls.reduce((a, b) => a + b, 0);

      if (count > 1) {
        lines.push(`Rolls: [${rolls.join(', ')}]`);
        lines.push(`Sum: ${sum}`);
      } else {
        lines.push(`Result: ${rolls[0]}`);
      }

      const total = sum + modifier;
      if (modifier !== 0) {
        lines.push(`Modifier: ${modifier > 0 ? '+' : ''}${modifier}`);
        lines.push(`Total: ${total}`);
      }

      if (count > 1) {
        lines.push(`Min: ${Math.min(...rolls)} | Max: ${Math.max(...rolls)} | Avg: ${(sum / count).toFixed(1)}`);
      }
    }

    return JSON.stringify({ result: lines.join('\n') });
  } catch (e) {
    return JSON.stringify({ error: e.message });
  }
};
