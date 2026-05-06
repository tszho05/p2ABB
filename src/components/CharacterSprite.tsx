import type { CharacterPose, TeamSide } from '../game/types';

interface CharacterSpriteProps {
  side: TeamSide;
  pose: CharacterPose;
  wordBurst?: string | null;
}

const spriteSources: Record<TeamSide, Record<CharacterPose, string>> = {
  left: {
    idle: '/assets/generated/characters/left-hero/idle/animation.gif',
    attack: '/assets/generated/characters/left-hero/attack/animation.gif',
    hurt: '/assets/generated/characters/left-hero/hurt/animation.gif',
  },
  right: {
    idle: '/assets/generated/characters/right-hero/idle/animation.gif',
    attack: '/assets/generated/characters/right-hero/attack/animation.gif',
    hurt: '/assets/generated/characters/right-hero/hurt/animation.gif',
  },
};

export default function CharacterSprite({ side, pose, wordBurst = null }: CharacterSpriteProps) {
  return (
    <div
      className={`character ${side} ${pose}`}
      aria-label={`${side === 'left' ? '左隊' : '右隊'}功夫小俠`}
      data-testid={`${side}-character`}
    >
      {wordBurst && (
        <div
          className="character-word-burst behind-character"
          data-testid={`${side}-word-burst`}
          role="status"
        >
          {wordBurst}！
        </div>
      )}
      <div className="ink-splash" />
      <img
        alt=""
        aria-hidden="true"
        className="character-image"
        data-testid={`${side}-character-image`}
        src={spriteSources[side][pose]}
      />
    </div>
  );
}
