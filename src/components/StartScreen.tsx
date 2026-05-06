import { DIFFICULTIES } from '../game/constants';
import type { DifficultyId } from '../game/types';

interface StartScreenProps {
  onStart: (difficulty: DifficultyId) => void;
}

const instructions = [
  '全班分成左隊和右隊。',
  '在自己一邊按順序點 3 個字，組成 ABB 疊詞。',
  '答對會出招攻擊對方，扣對方血量。',
  '血量先歸零，或時間結束時血量較低的一隊落敗。',
];

export default function StartScreen({ onStart }: StartScreenProps) {
  return (
    <main className="start-screen" data-testid="start-screen">
      <section className="start-panel" aria-labelledby="game-title">
        <h1 id="game-title">ABB 疊詞功夫擂台</h1>
        <div className="instruction-lines">
          {instructions.map((instruction) => (
            <p key={instruction}>{instruction}</p>
          ))}
        </div>
        <div className="difficulty-buttons" aria-label="選擇難度">
          {DIFFICULTIES.map((difficulty) => (
            <button
              className="start-button difficulty-button"
              key={difficulty.id}
              type="button"
              onClick={() => onStart(difficulty.id)}
            >
              {difficulty.label}
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
