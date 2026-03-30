window['ai_edge_gallery_get_result'] = async (data) => {
        try {
          const jsonData = JSON.parse(data);
          const length = Math.max(jsonData.length || 16, 4);
          const count = Math.min(jsonData.count || 1, 100);
          const useUpper = jsonData.uppercase !== false;
          const useLower = jsonData.lowercase !== false;
          const useNumbers = jsonData.numbers !== false;
          const useSymbols = jsonData.symbols !== false;
          const excludeAmbiguous = jsonData.exclude_ambiguous || false;

          let upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
          let lower = 'abcdefghijklmnopqrstuvwxyz';
          let numbers = '0123456789';
          let symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

          if (excludeAmbiguous) {
            upper = upper.replace(/[OI]/g, '');
            lower = lower.replace(/[l]/g, '');
            numbers = numbers.replace(/[01]/g, '');
          }

          let charset = '';
          const required = [];
          if (useUpper) { charset += upper; required.push(upper); }
          if (useLower) { charset += lower; required.push(lower); }
          if (useNumbers) { charset += numbers; required.push(numbers); }
          if (useSymbols) { charset += symbols; required.push(symbols); }
          if (!charset) { charset = lower + numbers; }

          function generateOne() {
            const arr = new Uint32Array(length);
            crypto.getRandomValues(arr);
            let pwd = Array.from(arr).map(n => charset[n % charset.length]).join('');
            for (let i = 0; i < required.length && i < length; i++) {
              const rnd = new Uint32Array(1);
              crypto.getRandomValues(rnd);
              const c = required[i][rnd[0] % required[i].length];
              pwd = pwd.substring(0, i) + c + pwd.substring(i + 1);
            }
            const chars = pwd.split('');
            for (let i = chars.length - 1; i > 0; i--) {
              const rnd = new Uint32Array(1);
              crypto.getRandomValues(rnd);
              const j = rnd[0] % (i + 1);
              [chars[i], chars[j]] = [chars[j], chars[i]];
            }
            return chars.join('');
          }

          const results = [];
          for (let i = 0; i < count; i++) results.push(generateOne());
          return JSON.stringify({ result: results.join('\n') });
        } catch (e) {
          console.error(e);
          return JSON.stringify({ error: `Failed to generate password: ${e.message}` });
        }
      };
