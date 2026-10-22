import { useId } from 'react';

import { useLang } from '@/hooks';
import { cn } from '@/utils';

import { useCrosswordActivityContext } from './crossword-activity-context';
import { CrosswordCell } from './crossword-cell';
import { i18n } from './lib/constant';
import { cellKey } from './lib/layout';

import css from './crossword.module.css';

interface Props {
  addClass?: string;
}

export const CrosswordBoard: React.FC<Props> = ({ addClass }) => {
  const lang = useLang();
  const t = i18n[lang];
  const { layout, activeWord } = useCrosswordActivityContext();
  const helpId = useId();

  const rows = Array.from({ length: layout.rows }, (_, row) => row);
  const columns = Array.from({ length: layout.cols }, (_, col) => col);

  return (
    <div className={cn(css['board'], addClass)}>
      {/* Pista activa. Es una región en vivo: al cambiar de palabra se anuncia; al teclear dentro de ella, no. */}
      <p className={css['board__clue']} role="status" aria-live="polite" aria-atomic="true">
        {/* El <p> es flex: un único hijo evita que se pierdan los espacios entre los fragmentos de texto. */}
        <span>
          {activeWord ? (
            <>
              <strong className={css['board__clue-title']}>
                {activeWord.number} {t[activeWord.direction]}
              </strong>{' '}
              <span aria-hidden="true">({activeWord.lengthHint})</span>
              <span className="u-sr-only">
                , {activeWord.lengthHint} {t.letters}
              </span>
              : {activeWord.clue}
            </>
          ) : (
            t.noActive
          )}
        </span>
      </p>

      <div className={css['board__scroller']}>
        <div
          role="grid"
          aria-label={t.grid}
          aria-describedby={helpId}
          aria-rowcount={layout.rows}
          aria-colcount={layout.cols}
          className={css['board__grid']}
        >
          {rows.map((row) => {
            const rowCells = columns.map((col) => layout.cells.get(cellKey(row, col)));
            const hasCells = rowCells.some(Boolean);

            return (
              <div
                key={row}
                className={css['board__row']}
                {...(hasCells
                  ? { role: 'row', 'aria-rowindex': row + 1 }
                  : { role: 'presentation', 'aria-hidden': true })}
              >
                {rowCells.map((cell, col) =>
                  cell ? (
                    <CrosswordCell key={col} cell={cell} />
                  ) : (
                    <div key={col} role="gridcell" aria-hidden="true" className={css['cell--blank']} />
                  )
                )}
              </div>
            );
          })}
        </div>
      </div>

      <p id={helpId} className={css['board__help']}>
        {t.help}
      </p>
    </div>
  );
};
