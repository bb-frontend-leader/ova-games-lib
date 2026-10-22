import { useId } from 'react';

import { useLang } from '@/hooks';

import { JeopardyIcon } from './jeopardy-icons';
import { i18n } from './lib/constant';

import type { Cell, CellState } from './types/types';

import css from './game-jeopardy.module.css';

interface Props {
  /** Categorías con sus casillas, en orden. */
  columns: { id: string; title: string; cells: Cell[] }[];
  stateOf: (cell: Cell) => CellState;
  onOpen: (cell: Cell, rect: DOMRect) => void;
}

/**
 * El tablero: una columna por categoría (en pantalla estrecha, una fila por categoría) y una casilla por pregunta.
 * Las acertadas se apagan; las falladas siguen disponibles con borde discontinuo.
 */
export const JeopardyBoard: React.FC<Props> = ({ columns, stateOf, onOpen }) => {
  const lang = useLang();
  const t = i18n[lang];
  const uid = useId();

  return (
    <div className={css.board} style={{ '--cols': columns.length } as React.CSSProperties}>
      {columns.map((column) => (
        <section key={column.id} className={css.column} aria-labelledby={`${uid}-${column.id}`}>
          <h3 id={`${uid}-${column.id}`} className={css.header}>
            {column.title}
          </h3>

          <ul className={css.cells}>
            {column.cells.map((cell) => {
              const state = stateOf(cell);

              return (
                <li key={cell.id}>
                  <button
                    type="button"
                    className={css.cell}
                    data-state={state}
                    data-cell={cell.id}
                    style={{ '--i': cell.c + cell.q } as React.CSSProperties}
                    disabled={state === 'solved'}
                    onClick={(event) => onOpen(cell, event.currentTarget.getBoundingClientRect())}
                  >
                    {state === 'solved' ? (
                      <JeopardyIcon name="check" className={css['cell-mark']} />
                    ) : (
                      <span aria-hidden="true">{cell.points}</span>
                    )}
                    <span className="u-sr-only">
                      {cell.points} {t.points}
                      {state === 'solved' && `, ${t.solved}`}
                      {state === 'review' && `, ${t.review}`}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
};
