window['ai_edge_gallery_get_result'] = async (data) => {
  try {
    const input = JSON.parse(data);
    const nums = input.numbers;

    if (!Array.isArray(nums) || nums.length !== 4) {
      return JSON.stringify({ error: 'Please provide exactly 4 numbers.' });
    }

    const ops = ['+', '-', '*', '/'];
    const EPS = 1e-9;

    // Generate all permutations of 4 numbers
    function permutations(arr) {
      if (arr.length <= 1) return [arr];
      const result = [];
      for (let i = 0; i < arr.length; i++) {
        const rest = arr.slice(0, i).concat(arr.slice(i + 1));
        for (const perm of permutations(rest)) {
          result.push([arr[i], ...perm]);
        }
      }
      return result;
    }

    function apply(a, op, b) {
      switch (op) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': return b !== 0 ? a / b : NaN;
      }
    }

    function fmt(expr) {
      // Clean up: remove unnecessary outer parens
      return expr;
    }

    // Try all 5 binary tree structures for 4 numbers:
    // 1. ((a op b) op c) op d
    // 2. (a op (b op c)) op d
    // 3. (a op b) op (c op d)
    // 4. a op ((b op c) op d)
    // 5. a op (b op (c op d))
    function solve(nums) {
      const perms = permutations(nums);
      for (const [a, b, c, d] of perms) {
        for (const op1 of ops) {
          for (const op2 of ops) {
            for (const op3 of ops) {
              // Structure 1: ((a op1 b) op2 c) op3 d
              let r = apply(apply(apply(a, op1, b), op2, c), op3, d);
              if (Math.abs(r - 24) < EPS) {
                return `((${a} ${op1} ${b}) ${op2} ${c}) ${op3} ${d} = 24`;
              }

              // Structure 2: (a op1 (b op2 c)) op3 d
              r = apply(apply(a, op1, apply(b, op2, c)), op3, d);
              if (Math.abs(r - 24) < EPS) {
                return `(${a} ${op1} (${b} ${op2} ${c})) ${op3} ${d} = 24`;
              }

              // Structure 3: (a op1 b) op3 (c op2 d)
              r = apply(apply(a, op1, b), op3, apply(c, op2, d));
              if (Math.abs(r - 24) < EPS) {
                return `(${a} ${op1} ${b}) ${op3} (${c} ${op2} ${d}) = 24`;
              }

              // Structure 4: a op3 ((b op1 c) op2 d)
              r = apply(a, op3, apply(apply(b, op1, c), op2, d));
              if (Math.abs(r - 24) < EPS) {
                return `${a} ${op3} ((${b} ${op1} ${c}) ${op2} ${d}) = 24`;
              }

              // Structure 5: a op3 (b op1 (c op2 d))
              r = apply(a, op3, apply(b, op1, apply(c, op2, d)));
              if (Math.abs(r - 24) < EPS) {
                return `${a} ${op3} (${b} ${op1} (${c} ${op2} ${d})) = 24`;
              }
            }
          }
        }
      }
      return null;
    }

    const solution = solve(nums);
    if (solution) {
      return JSON.stringify({ result: solution });
    } else {
      return JSON.stringify({ result: `No solution found for [${nums.join(', ')}]. These numbers cannot make 24.` });
    }
  } catch (e) {
    console.error(e);
    return JSON.stringify({ error: `Failed to solve: ${e.message}` });
  }
};
