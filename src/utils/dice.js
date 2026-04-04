export function rollAll(count = 5) {
  return Array.from({ length: count }, () => Math.floor(Math.random() * 6) + 1);
}

export function reroll(dice, lockedDice) {
  return dice.map((d, i) => (lockedDice[i] ? d : Math.floor(Math.random() * 6) + 1));
}

export function detectHands(dice) {
  const freq = {};
  dice.forEach((d) => { freq[d] = (freq[d] || 0) + 1; });
  const counts = Object.values(freq).sort((a, b) => b - a);
  const sorted = dice.slice().sort((a, b) => a - b);
  const unique = [...new Set(sorted)];
  const hands = [];

  if (counts[0] === 5) { hands.push('fiveOfAKind'); return hands; }
  if (counts[0] === 4) { hands.push('fourOfAKind'); hands.push('pair'); return hands; }
  if (counts[0] === 3 && counts[1] === 2) { hands.push('fullHouse'); hands.push('threeOfAKind'); hands.push('pair'); return hands; }
  if (counts[0] === 3) { hands.push('threeOfAKind'); hands.push('pair'); return hands; }
  if (unique.length === 5 && sorted[4] - sorted[0] === 4) { hands.push('straight'); return hands; }
  if (counts[0] >= 2) hands.push('pair');
  return hands;
}

export function canAttackBoss(detectedHands, bossHand) {
  return Array.isArray(bossHand)
    ? bossHand.some((h) => detectedHands.includes(h))
    : detectedHands.includes(bossHand);
}
