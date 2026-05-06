import type { Tile } from '../game/types';
import { GRID_ROWS } from '../game/constants';

interface TileGridProps {
  board: Tile[];
  selectedTileIds: string[];
  wrongTileIds: string[];
  correctTileIds: string[];
  disabled: boolean;
  gridColumns: number;
  side: 'left' | 'right';
  onTilePointerDown: (tileId: string) => void;
}

export default function TileGrid({
  board,
  selectedTileIds,
  wrongTileIds,
  correctTileIds,
  disabled,
  gridColumns,
  side,
  onTilePointerDown,
}: TileGridProps) {
  return (
    <div
      className="tile-grid"
      data-testid={`${side}-grid`}
      style={{
        gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${GRID_ROWS}, minmax(0, 1fr))`,
      }}
    >
      {board.map((tile) => {
        const selected = selectedTileIds.includes(tile.id);
        const wrong = wrongTileIds.includes(tile.id);
        const correct = correctTileIds.includes(tile.id);

        return (
          <button
            className={`tile ${selected ? 'selected' : ''} ${wrong ? 'wrong' : ''} ${
              correct ? 'correct' : ''
            }`}
            data-testid={`${side}-tile`}
            data-char={tile.char}
            data-tile-id={tile.id}
            disabled={disabled}
            key={tile.id}
            type="button"
            onPointerDown={(event) => {
              event.preventDefault();
              onTilePointerDown(tile.id);
            }}
          >
            {tile.char}
          </button>
        );
      })}
    </div>
  );
}
