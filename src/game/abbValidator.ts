import type { Tile } from './types';

type BoardEntry = Tile | string;

const getChar = (entry: BoardEntry) => (typeof entry === 'string' ? entry : entry.char);

const countChars = (chars: string[]) =>
  chars.reduce<Record<string, number>>((counts, char) => {
    counts[char] = (counts[char] ?? 0) + 1;
    return counts;
  }, {});

export const validateSelection = (
  selectedChars: string[],
  validABBWords: readonly string[],
) => validABBWords.includes(selectedChars.join(''));

export const hasValidABB = (
  board: readonly BoardEntry[],
  validABBWords: readonly string[],
) => {
  const boardCounts = countChars(board.map(getChar));

  return validABBWords.some((word) => {
    const wordCounts = countChars([...word]);

    return Object.entries(wordCounts).every(
      ([char, requiredCount]) => (boardCounts[char] ?? 0) >= requiredCount,
    );
  });
};
