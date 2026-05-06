import type { DifficultyConfig, DifficultyId } from './types';

export const INITIAL_HP = 100;
export const DAMAGE_PER_CORRECT = 10;
export const GAME_DURATION_SECONDS = 60;
export const TILE_COUNT_PER_TEAM = 18;
export const GRID_ROWS = 3;
export const GRID_COLUMNS = 6;
export const WRONG_LOCK_DURATION_MS = 700;
export const ATTACK_ANIMATION_MS = 1000;
export const CORRECT_WORD_BURST_MS = 1500;

export const DIFFICULTIES = [
  { id: 'simple', label: '簡單', tileCount: 9, gridColumns: 3 },
  { id: 'normal', label: '普通', tileCount: 12, gridColumns: 4 },
  { id: 'hard', label: '困難', tileCount: 15, gridColumns: 5 },
] as const satisfies readonly DifficultyConfig[];

export const DEFAULT_DIFFICULTY_ID: DifficultyId = 'hard';

export const getDifficultyConfig = (difficultyId: DifficultyId = DEFAULT_DIFFICULTY_ID) =>
  DIFFICULTIES.find((difficulty) => difficulty.id === difficultyId) ?? DIFFICULTIES[0];
