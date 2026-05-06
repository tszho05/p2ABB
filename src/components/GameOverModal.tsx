import type { Winner } from '../game/types';

interface GameOverModalProps {
  winner: Winner;
  onRestart: () => void;
}

const getResultText = (winner: Winner) => {
  if (winner === 'draw') {
    return '平手！';
  }

  return winner === 'left' ? '左隊勝出！' : '右隊勝出！';
};

export default function GameOverModal({ winner, onRestart }: GameOverModalProps) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="game-over-title">
      <div className="game-over-modal" data-testid="game-over-modal">
        <h2 id="game-over-title">比賽結束</h2>
        <p>{getResultText(winner)}</p>
        <button type="button" onClick={onRestart}>
          再玩一次
        </button>
      </div>
    </div>
  );
}
