export function generateSecurePassword(length = 10): string {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower = 'abcdefghijkmnopqrstuvwxyz';
  const numbers = '23456789';
  const symbols = '#$@!&?';

  const all = upper + lower + numbers + symbols;
  const safeLength = Math.max(8, length);
  const array = new Uint32Array(safeLength);
  crypto.getRandomValues(array);

  const mandatory = [
    upper[array[0] % upper.length],
    lower[array[1] % lower.length],
    numbers[array[2] % numbers.length],
    symbols[array[3] % symbols.length],
  ];

  const rest = Array.from(
    { length: safeLength - mandatory.length },
    (_, i) => all[array[i + mandatory.length] % all.length]
  );

  const combined = [...mandatory, ...rest];

  const shuffleArray = new Uint32Array(combined.length);
  crypto.getRandomValues(shuffleArray);

  for (let i = combined.length - 1; i > 0; i--) {
    const j = shuffleArray[i] % (i + 1);
    const temp = combined[i];
    combined[i] = combined[j];
    combined[j] = temp;
  }

  return combined.join('');
}

