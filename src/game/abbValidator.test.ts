import { describe, expect, it } from 'vitest';
import { validABBWords } from '../data/abbWords';
import { hasValidABB, validateSelection } from './abbValidator';
import type { Tile } from './types';

describe('ABB validation', () => {
  it('validates selections by exact dictionary word', () => {
    expect(validateSelection(['亮', '晶', '晶'], validABBWords)).toBe(true);
    expect(validateSelection(['亮', '亮', '晶'], validABBWords)).toBe(false);
  });

  it('requires repeated characters to use enough different tiles', () => {
    const solvableBoard: Tile[] = [
      { id: 'a', char: '亮' },
      { id: 'b', char: '晶' },
      { id: 'c', char: '晶' },
    ];
    const unsolvableBoard: Tile[] = [
      { id: 'a', char: '亮' },
      { id: 'b', char: '晶' },
      { id: 'c', char: '香' },
    ];

    expect(hasValidABB(solvableBoard, ['亮晶晶'])).toBe(true);
    expect(hasValidABB(unsolvableBoard, ['亮晶晶'])).toBe(false);
  });
});
