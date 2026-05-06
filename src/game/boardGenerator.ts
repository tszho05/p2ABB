import { TILE_COUNT_PER_TEAM } from './constants';
import { hasValidABB } from './abbValidator';
import type { Tile } from './types';

let nextTileId = 1;

const createTile = (char: string): Tile => ({
  id: `tile-${nextTileId++}`,
  char,
});

const pickOne = <T>(items: readonly T[]) =>
  items[Math.floor(Math.random() * items.length)];

const shuffle = <T>(items: T[]) => {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
};

const buildCharPool = (validABBWords: readonly string[]) =>
  [...new Set(validABBWords.flatMap((word) => [...word]))];

export const generateBoard = (
  validABBWords: readonly string[],
  size = TILE_COUNT_PER_TEAM,
): Tile[] => {
  if (validABBWords.length === 0) {
    throw new Error('validABBWords must contain at least one word.');
  }

  if (size < 3) {
    throw new Error('Board size must be at least 3.');
  }

  const guaranteedWord = pickOne(validABBWords);
  const charPool = buildCharPool(validABBWords);
  const chars = [...guaranteedWord];

  while (chars.length < size) {
    if (Math.random() < 0.45) {
      chars.push(pickOne([...pickOne(validABBWords)]));
    } else {
      chars.push(pickOne(charPool));
    }
  }

  const board = shuffle(chars).slice(0, size).map(createTile);

  if (!hasValidABB(board, validABBWords)) {
    return generateBoard(validABBWords, size);
  }

  return board;
};

export const refillBoardAfterCorrect = (
  board: readonly Tile[],
  selectedTileIds: readonly string[],
  validABBWords: readonly string[],
): Tile[] => {
  const selectedIdSet = new Set(selectedTileIds);
  const keptTiles = board.filter((tile) => !selectedIdSet.has(tile.id));
  const refillCount = Math.max(0, board.length - keptTiles.length);
  const charPool = buildCharPool(validABBWords);
  const newTiles = Array.from({ length: refillCount }, () => createTile(pickOne(charPool)));
  const refilledBoard = shuffle([...keptTiles, ...newTiles]);

  if (!hasValidABB(refilledBoard, validABBWords)) {
    return generateBoard(validABBWords, board.length);
  }

  return refilledBoard;
};
