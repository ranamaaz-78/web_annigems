// Splits CMS copy after its first sentence, so it keeps the two-line layout of the design.
export const splitFirstSentence = (text = '') => {
  const i = text.indexOf('. ');
  return i < 0 ? [text, ''] : [text.slice(0, i + 1), text.slice(i + 2)];
};
