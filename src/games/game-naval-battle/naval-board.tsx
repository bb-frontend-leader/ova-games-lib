import { useLang } from '@/hooks';

import { i18n } from './lib/constant';
import { NavalIcon } from './naval-icons';

import type { Cell } from './types/types';

import css from './game-naval-battle.module.css';

type View = 'water' | 'ping' | 'miss' | 'hit' | 'sunk';

const ARROWS: Record<string, [number, number]> = {
  ArrowUp: [-1, 0],
  ArrowDown: [1, 0],
  ArrowLeft: [0, -1],
  ArrowRight: [0, 1]
};

interface Props {
  cells: Cell[];
  size: number;
  /** Solo se puede pulsar el mar cuando toca apuntar. */
  interactive?: boolean;
  /** Pulsar una casilla: disparar o, con el sonar activo, escanearla. */
  onPress?: (id: number) => void;
}

/**
 * El mar enemigo: una cuadrícula de casillas. Las flechas del teclado mueven el foco entre casillas. Solo dibuja:
 * quien lo usa decide qué pasa al pulsar.
 */
export const NavalBoard: React.FC<Props> = ({ cells, size, interactive = false, onPress }) => {
  const lang = useLang();
  const t = i18n[lang];

  const viewOf = (cell: Cell): View => {
    if (cell.status !== 'water') return cell.status;

    return cell.ping !== null ? 'ping' : 'water';
  };

  const describe = (cell: Cell, view: View) => {
    const status = {
      water: t.cell.water,
      ping: t.cell.ping(cell.ping ?? 0),
      miss: t.cell.miss,
      hit: t.cell.hit,
      sunk: t.cell.sunk
    }[view];

    return `${t.cell.position(cell.row + 1, cell.col + 1)}: ${status}`;
  };

  const move = (event: React.KeyboardEvent<HTMLButtonElement>, cell: Cell) => {
    const step = ARROWS[event.key];

    if (!step) return;

    const row = cell.row + step[0];
    const col = cell.col + step[1];

    if (row < 0 || row >= size || col < 0 || col >= size) return;

    event.preventDefault();
    event.currentTarget
      .closest('[data-board]')
      ?.querySelector<HTMLElement>(`[data-cell="${row * size + col}"]`)
      ?.focus();
  };

  return (
    <div
      data-board=""
      role="group"
      aria-label={t.boardLabel}
      className={css.field}
      style={{ '--cols': size } as React.CSSProperties}
    >
      {cells.map((cell) => {
        const view = viewOf(cell);
        const settled = view === 'miss' || view === 'hit' || view === 'sunk';

        return (
          <button
            key={cell.id}
            type="button"
            className={css.cell}
            data-cell={cell.id}
            data-view={view}
            data-n={view === 'ping' ? cell.ping : undefined}
            disabled={!interactive}
            aria-disabled={interactive && settled ? true : undefined}
            aria-label={describe(cell, view)}
            onClick={onPress && interactive ? () => onPress(cell.id) : undefined}
            onKeyDown={interactive ? (event) => move(event, cell) : undefined}
          >
            <span aria-hidden="true" className={css['cell-face']}>
              {view === 'ping' && cell.ping}
              {view === 'miss' && <NavalIcon name="drop" />}
              {view === 'hit' && <NavalIcon name="flame" />}
              {view === 'sunk' && <NavalIcon name="ship" />}
            </span>
          </button>
        );
      })}
    </div>
  );
};
