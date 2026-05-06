import { useEffect, useReducer } from 'react';
import BattleArena from './components/BattleArena';
import GameOverModal from './components/GameOverModal';
import StartScreen from './components/StartScreen';
import TeamBoard from './components/TeamBoard';
import {
  correctRefillDelayMs,
  createInitialGameState,
  gameReducer,
} from './game/gameReducer';
import { CORRECT_WORD_BURST_MS, WRONG_LOCK_DURATION_MS } from './game/constants';
import type { TeamSide } from './game/types';

export default function App() {
  const [state, dispatch] = useReducer(gameReducer, undefined, () => createInitialGameState());

  useEffect(() => {
    if (state.phase !== 'playing') {
      return undefined;
    }

    const timer = window.setInterval(() => {
      dispatch({ type: 'tick' });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [state.phase]);

  useEffect(() => {
    if (!state.teams.left.locked) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      dispatch({ type: 'releaseWrongLock', team: 'left' });
    }, WRONG_LOCK_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, [state.teams.left.locked]);

  useEffect(() => {
    if (!state.teams.right.locked) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      dispatch({ type: 'releaseWrongLock', team: 'right' });
    }, WRONG_LOCK_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, [state.teams.right.locked]);

  useEffect(() => {
    if (!state.teams.left.pendingCorrect) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      dispatch({ type: 'finishCorrectRefill', team: 'left' });
    }, correctRefillDelayMs);

    return () => window.clearTimeout(timer);
  }, [state.teams.left.pendingCorrect]);

  useEffect(() => {
    if (!state.teams.right.pendingCorrect) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      dispatch({ type: 'finishCorrectRefill', team: 'right' });
    }, correctRefillDelayMs);

    return () => window.clearTimeout(timer);
  }, [state.teams.right.pendingCorrect]);

  useEffect(() => {
    if (!state.lastCorrectWord) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      dispatch({ type: 'clearAnimations' });
    }, CORRECT_WORD_BURST_MS);

    return () => window.clearTimeout(timer);
  }, [state.lastCorrectWord]);

  const handleTilePointerDown = (team: TeamSide, tileId: string) => {
    dispatch({ type: 'selectTile', team, tileId });
  };

  if (state.phase === 'start') {
    return <StartScreen onStart={(difficulty) => dispatch({ type: 'startGame', difficulty })} />;
  }

  return (
    <main className="game-shell" data-testid="game-screen">
      <BattleArena state={state} onRestart={() => dispatch({ type: 'startGame' })} />
      <section className="answer-zone" aria-label="答題區">
        <TeamBoard
          gridColumns={state.difficulty.gridColumns}
          side="left"
          team={state.teams.left}
          onTilePointerDown={handleTilePointerDown}
        />
        <div className="board-divider" aria-hidden="true" />
        <TeamBoard
          gridColumns={state.difficulty.gridColumns}
          side="right"
          team={state.teams.right}
          onTilePointerDown={handleTilePointerDown}
        />
      </section>
      {state.phase === 'gameOver' && (
        <GameOverModal winner={state.winner} onRestart={() => dispatch({ type: 'startGame' })} />
      )}
    </main>
  );
}
