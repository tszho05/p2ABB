export type TeamSide = 'left' | 'right';
export type Winner = TeamSide | 'draw' | null;
export type DifficultyId = 'simple' | 'normal' | 'hard';

export interface DifficultyConfig {
  id: DifficultyId;
  label: string;
  tileCount: number;
  gridColumns: number;
}

export interface Tile {
  id: string;
  char: string;
}

export type AttackEffect = 'ink-wave' | 'ink-brush-slash' | 'ink-dragon' | 'ink-splash-burst';

export type CharacterPose = 'idle' | 'attack' | 'hurt';

export interface PendingCorrect {
  tileIds: string[];
  word: string;
}

export interface TeamState {
  board: Tile[];
  hp: number;
  selectedTileIds: string[];
  wrongTileIds: string[];
  pendingCorrect: PendingCorrect | null;
  locked: boolean;
  pose: CharacterPose;
}

export interface GameState {
  phase: 'start' | 'playing' | 'gameOver';
  difficulty: DifficultyConfig;
  teams: Record<TeamSide, TeamState>;
  timeLeft: number;
  winner: Winner;
  lastCorrectWord: string | null;
  activeEffect: AttackEffect | null;
  effectFrom: TeamSide | null;
}
