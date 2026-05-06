import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { validABBWords } from './data/abbWords';
import { hasValidABB } from './game/abbValidator';
import { CORRECT_WORD_BURST_MS, WRONG_LOCK_DURATION_MS } from './game/constants';

const startGame = (difficulty = '困難') => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: difficulty }));
};

const getTileButtons = (side: 'left' | 'right') =>
  screen.getAllByTestId(`${side}-tile`) as HTMLButtonElement[];

const getTileChars = (tiles: HTMLButtonElement[]) =>
  tiles.map((tile) => tile.dataset.char ?? '');

const findValidWordTiles = (side: 'left' | 'right') => {
  const tiles = getTileButtons(side);

  for (const word of validABBWords) {
    const used = new Set<HTMLButtonElement>();
    const wordTiles: HTMLButtonElement[] = [];

    for (const char of word) {
      const tile = tiles.find(
        (candidate) => candidate.dataset.char === char && !used.has(candidate),
      );

      if (!tile) {
        break;
      }

      used.add(tile);
      wordTiles.push(tile);
    }

    if (wordTiles.length === 3) {
      return wordTiles;
    }
  }

  throw new Error(`No valid ABB tiles found for ${side}`);
};

const findInvalidTiles = (side: 'left' | 'right') => {
  const tiles = getTileButtons(side);
  const validWordSet = new Set<string>(validABBWords);

  for (let first = 0; first < tiles.length; first += 1) {
    for (let second = 0; second < tiles.length; second += 1) {
      for (let third = 0; third < tiles.length; third += 1) {
        if (new Set([first, second, third]).size !== 3) {
          continue;
        }

        const word = [tiles[first], tiles[second], tiles[third]]
          .map((tile) => tile.dataset.char)
          .join('');

        if (!validWordSet.has(word)) {
          return [tiles[first], tiles[second], tiles[third]];
        }
      }
    }
  }

  throw new Error(`No invalid tile sequence found for ${side}`);
};

const pointerDownTiles = (tiles: HTMLButtonElement[]) => {
  tiles.forEach((tile, pointerId) => {
    fireEvent.pointerDown(tile, { pointerId: pointerId + 1, pointerType: 'touch' });
  });
};

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('ABB 疊詞功夫擂台', () => {
  it('shows the start screen before entering the game', () => {
    render(<App />);

    expect(screen.getByTestId('start-screen')).toBeInTheDocument();
    expect(screen.queryByTestId('game-screen')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '開始' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: '簡單' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '普通' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '困難' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '困難' }));

    expect(screen.getByTestId('game-screen')).toBeInTheDocument();
  });

  it.each([
    ['簡單', 9],
    ['普通', 12],
    ['困難', 15],
  ])('starts %s mode with different solvable %i-tile boards', (difficulty, tileCount) => {
    startGame(difficulty);

    const leftTiles = getTileButtons('left');
    const rightTiles = getTileButtons('right');
    const leftChars = getTileChars(leftTiles);
    const rightChars = getTileChars(rightTiles);

    expect(leftTiles).toHaveLength(tileCount);
    expect(rightTiles).toHaveLength(tileCount);
    expect(leftChars.join('')).not.toBe(rightChars.join(''));
    expect(hasValidABB(leftChars, validABBWords)).toBe(true);
    expect(hasValidABB(rightChars, validABBWords)).toBe(true);
  });

  it('mirrors the right HP label and keeps restart inside the battle arena', () => {
    startGame();

    expect(screen.getByTestId('left-health-bar')).toHaveTextContent(/^左隊100$/);
    expect(screen.getByTestId('right-health-bar')).toHaveTextContent(/^100右隊$/);
    expect(
      within(screen.getByTestId('battle-arena')).getByRole('button', { name: '重新開始' }),
    ).toBeInTheDocument();
  });

  it('renders generated character sprites for both teams', () => {
    startGame();

    expect(screen.getByTestId('left-character-image')).toHaveAttribute(
      'src',
      '/assets/generated/characters/left-hero/idle/animation.gif',
    );
    expect(screen.getByTestId('right-character-image')).toHaveAttribute(
      'src',
      '/assets/generated/characters/right-hero/idle/animation.gif',
    );
    expect(screen.getByTestId('left-fighter-slot')).toContainElement(
      screen.getByTestId('left-character'),
    );
    expect(screen.getByTestId('right-fighter-slot')).toContainElement(
      screen.getByTestId('right-character'),
    );
  });

  it('still restarts the game from the battle arena control', () => {
    startGame();
    pointerDownTiles(findValidWordTiles('left'));
    expect(screen.getByLabelText('右隊 HP 90')).toBeInTheDocument();

    fireEvent.click(
      within(screen.getByTestId('battle-arena')).getByRole('button', { name: '重新開始' }),
    );

    expect(screen.getByLabelText('右隊 HP 100')).toBeInTheDocument();
  });

  it('cancels selection when the same selected tile is touched again', () => {
    startGame();
    const [tile] = getTileButtons('left');

    fireEvent.pointerDown(tile, { pointerId: 1, pointerType: 'touch' });
    expect(tile).toHaveClass('selected');

    fireEvent.pointerDown(tile, { pointerId: 1, pointerType: 'touch' });
    expect(tile).not.toHaveClass('selected');
  });

  it('deducts opponent HP after a correct ABB word', () => {
    startGame();
    pointerDownTiles(findValidWordTiles('left'));

    expect(screen.getByLabelText('右隊 HP 90')).toBeInTheDocument();
  });

  it('switches character poses and activates a generated attack effect after a correct ABB word', () => {
    startGame();
    const wordTiles = findValidWordTiles('left');
    const word = wordTiles.map((tile) => tile.dataset.char).join('');
    pointerDownTiles(wordTiles);

    expect(screen.getByTestId('left-character')).toHaveClass('attack');
    expect(screen.getByTestId('right-character')).toHaveClass('hurt');
    const attackEffectClassName = screen.getByTestId('attack-effect').className;
    expect(attackEffectClassName).toMatch(
      /\b(ink-wave|ink-brush-slash|ink-dragon|ink-splash-burst)\b/,
    );
    expect(attackEffectClassName).not.toContain('rainbow-beam');
    expect(within(screen.getByTestId('left-character')).getByTestId('left-word-burst')).toHaveTextContent(
      `${word}！`,
    );
    expect(within(screen.getByTestId('left-character')).getByTestId('left-word-burst')).toHaveClass(
      'behind-character',
    );
    expect(screen.queryByTestId('right-word-burst')).not.toBeInTheDocument();
  });

  it('keeps the correct word burst visible for 1.5 seconds', () => {
    vi.useFakeTimers();
    startGame();
    const wordTiles = findValidWordTiles('left');
    pointerDownTiles(wordTiles);

    expect(screen.getByTestId('left-word-burst')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(CORRECT_WORD_BURST_MS - 1);
    });

    expect(screen.getByTestId('left-word-burst')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(screen.queryByTestId('left-word-burst')).not.toBeInTheDocument();
  });

  it('shows the right team correct word behind the right character with upright text', () => {
    startGame();
    const wordTiles = findValidWordTiles('right');
    const word = wordTiles.map((tile) => tile.dataset.char).join('');
    pointerDownTiles(wordTiles);

    const rightWordBurst = within(screen.getByTestId('right-character')).getByTestId(
      'right-word-burst',
    );
    expect(rightWordBurst).toHaveTextContent(`${word}！`);
    expect(rightWordBurst).toHaveClass('behind-character');
    expect(screen.queryByTestId('left-word-burst')).not.toBeInTheDocument();
  });

  it('locks only the wrong team for 0.7 seconds', () => {
    vi.useFakeTimers();
    startGame();

    pointerDownTiles(findInvalidTiles('left'));

    const leftBoard = screen.getByTestId('left-board');
    expect(leftBoard).toHaveClass('locked');
    expect(getTileButtons('left').every((tile) => tile.disabled)).toBe(true);
    expect(getTileButtons('right').some((tile) => tile.disabled)).toBe(false);

    act(() => {
      vi.advanceTimersByTime(WRONG_LOCK_DURATION_MS);
    });

    expect(leftBoard).not.toHaveClass('locked');
    expect(getTileButtons('left').some((tile) => tile.disabled)).toBe(false);
  });

  it('lets the other team keep playing while one team is locked', () => {
    vi.useFakeTimers();
    startGame();

    pointerDownTiles(findInvalidTiles('left'));
    const rightTile = getTileButtons('right')[0];

    fireEvent.pointerDown(rightTile, { pointerId: 8, pointerType: 'touch' });

    expect(screen.getByTestId('left-board')).toHaveClass('locked');
    expect(rightTile).toHaveClass('selected');
  });

  it('shows a draw when the timer ends with equal HP', () => {
    vi.useFakeTimers();
    startGame();

    act(() => {
      vi.advanceTimersByTime(60_000);
    });

    const modal = screen.getByTestId('game-over-modal');
    expect(within(modal).getByText('平手！')).toBeInTheDocument();
  });
});
