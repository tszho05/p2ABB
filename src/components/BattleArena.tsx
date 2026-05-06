import type { AttackEffect, GameState } from '../game/types';
import CharacterSprite from './CharacterSprite';
import HealthBar from './HealthBar';
import TeacherPanel from './TeacherPanel';

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = String(seconds % 60).padStart(2, '0');
  return `${mins}:${secs}`;
};

const effectClassName = (effect: AttackEffect | null) => {
  if (!effect) {
    return '';
  }

  return effect;
};

interface BattleArenaProps {
  state: GameState;
  onRestart: () => void;
}

export default function BattleArena({ state, onRestart }: BattleArenaProps) {
  const leftWordBurst =
    state.lastCorrectWord && state.effectFrom === 'left' ? state.lastCorrectWord : null;
  const rightWordBurst =
    state.lastCorrectWord && state.effectFrom === 'right' ? state.lastCorrectWord : null;
  const attackEffectKey = state.activeEffect
    ? [
        state.effectFrom,
        state.activeEffect,
        state.lastCorrectWord,
        state.teams.left.hp,
        state.teams.right.hp,
      ].join('-')
    : null;

  return (
    <section className="battle-arena" data-testid="battle-arena" aria-label="對戰區">
      <div className="arena-hud left">
        <HealthBar hp={state.teams.left.hp} label="左隊" />
      </div>
      <div className="arena-center">
        <div className="vs-mark">VS</div>
        <div className="timer" aria-label={`倒數時間 ${formatTime(state.timeLeft)}`}>
          {formatTime(state.timeLeft)}
        </div>
      </div>
      <div className="arena-hud right">
        <HealthBar hp={state.teams.right.hp} label="右隊" align="right" />
      </div>
      <TeacherPanel onRestart={onRestart} />

      <div className="fighters">
        <div className="fighter-slot left" data-testid="left-fighter-slot">
          <CharacterSprite side="left" pose={state.teams.left.pose} wordBurst={leftWordBurst} />
        </div>
        {state.activeEffect && (
          <div
            className={`attack-effect ${effectClassName(state.activeEffect)} ${
              state.effectFrom === 'right' ? 'from-right' : ''
            }`}
            aria-hidden="true"
            data-testid="attack-effect"
            key={attackEffectKey}
          />
        )}
        <div className="fighter-slot right" data-testid="right-fighter-slot">
          <CharacterSprite side="right" pose={state.teams.right.pose} wordBurst={rightWordBurst} />
        </div>
      </div>
    </section>
  );
}
