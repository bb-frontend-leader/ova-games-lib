import { useLang } from '@/hooks';

import { i18n } from './lib/constant';
import { MinesIcon } from './mines-icons';

import type { Cell } from './types/types';

import css from './game-minesweeper.module.css';

type View = 'closed' | 'review' | 'flag' | 'radar' | 'open' | 'boom' | 'mine';

const ARROWS: Record<string, [number, number]> = {
  ArrowUp: [-1, 0],
  ArrowDown: [1, 0],
  ArrowLeft: [0, -1],
  ArrowRight: [0, 1]
};

interface Props {
  cells: Cell[];
  columns: number;
  /** Solo se puede pulsar el campo cuando toca elegir casilla. */
  interactive?: boolean;
  /** Al terminar se enseñan las minas que quedaron sin explotar. */
  reveal?: boolean;
  /** Casillas cuya pregunta se falló y siguen por repasar. */
  review?: number[];
  /** Casilla cuya pregunta se está respondiendo. */
  current?: number | null;
  /** Pulsar una casilla: abrirla o, en modo bandera, marcarla. */
  onPress?: (id: number) => void;
  /** Botón derecho o tecla F sobre una casilla. */
  onFlag?: (id: number) => void;
}

/**
 * El campo de minas: una cuadrícula de casillas. Las flechas del teclado mueven el foco entre casillas y la
 * tecla F pone o quita la bandera. Solo dibuja: quien lo usa decide qué pasa al pulsar.
 */
export const MinesBoard: React.FC<Props> = ({
  cells,
  columns,
  interactive = false,
  reveal = false,
  review = [],
  current = null,
  onPress,
  onFlag
}) => {
  const lang = useLang();
  const t = i18n[lang];
  const rows = Math.ceil(cells.length / columns);

  const viewOf = (cell: Cell): View => {
    if (cell.status !== 'closed') return cell.status;
    if (cell.radar) return 'radar';
    if (cell.flag) return 'flag';
    if (reveal && cell.mine) return 'mine';

    return review.includes(cell.id) ? 'review' : 'closed';
  };

  const describe = (cell: Cell, view: View) => {
    const status = {
      closed: t.cell.closed,
      review: t.cell.review,
      flag: t.cell.flagged,
      radar: t.cell.radar,
      open: t.cell.open(cell.adj),
      boom: t.cell.boom,
      mine: t.cell.mine
    }[view];

    return `${t.cell.position(cell.row + 1, cell.col + 1)}: ${status}`;
  };

  const move = (event: React.KeyboardEvent<HTMLButtonElement>, cell: Cell) => {
    if (event.key === 'f' || event.key === 'F') {
      event.preventDefault();
      onFlag?.(cell.id);
      return;
    }

    const step = ARROWS[event.key];

    if (!step) return;

    const row = cell.row + step[0];
    const col = cell.col + step[1];

    if (row < 0 || row >= rows || col < 0 || col >= columns) return;

    event.preventDefault();
    event.currentTarget
      .closest('[data-board]')
      ?.querySelector<HTMLElement>(`[data-cell="${row * columns + col}"]`)
      ?.focus();
  };

  return (
    <div
      data-board=""
      role="group"
      aria-label={t.boardLabel}
      className={css.field}
      style={{ '--cols': columns } as React.CSSProperties}
    >
      {cells.map((cell) => {
        const view = viewOf(cell);
        const settled = view === 'open' || view === 'boom' || view === 'radar';

        return (
          <button
            key={cell.id}
            type="button"
            className={css.cell}
            data-cell={cell.id}
            data-view={view}
            data-n={view === 'open' ? cell.adj : undefined}
            data-current={current === cell.id ? '' : undefined}
            disabled={!interactive}
            aria-disabled={interactive && settled ? true : undefined}
            aria-label={describe(cell, view)}
            onClick={onPress && interactive ? () => onPress(cell.id) : undefined}
            onContextMenu={
              onFlag && interactive
                ? (event) => {
                    event.preventDefault();
                    onFlag(cell.id);
                  }
                : undefined
            }
            onKeyDown={interactive ? (event) => move(event, cell) : undefined}
          >
            <span aria-hidden="true" className={css['cell-face']}>
              {(view === 'closed' || view === 'review') && '?'}
              {view === 'open' && cell.adj}
              {(view === 'boom' || view === 'mine') && <MinesIcon name="mine" />}
              {view === 'flag' && <MinesIcon name="flag" />}
              {view === 'radar' && <MinesIcon name="radar" />}
            </span>
          </button>
        );
      })}
    </div>
  );
};
