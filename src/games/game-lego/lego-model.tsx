import { MODEL } from './lib/constant';

import css from './game-lego.module.css';

interface Props {
  modelRef?: React.Ref<HTMLDivElement>;
  slotRef?: React.Ref<HTMLDivElement>;
  /** Estado del hueco: vacío, con una pieza elegida o con el resultado. */
  slotState?: 'empty' | 'picked' | 'correct' | 'wrong';
  /** Color y letra de la pieza elegida */
  color?: number;
  letter?: string | null;
  filled?: boolean;
}

/** El modelo de ladrillos al que le falta una pieza. Es decorativo (aria-hidden en quien lo usa). */
export const LegoModel: React.FC<Props> = ({ modelRef, slotRef, slotState = 'empty', color, letter, filled }) => (
  <div ref={modelRef} className={css.model}>
    {MODEL.map((row, r) => (
      <div key={r} className={css['model-row']} data-row>
        {row.map((brick, i) =>
          brick.slot ? (
            <div
              key={i}
              ref={slotRef}
              className={css.slot}
              data-state={slotState}
              data-color={color}
              style={{ '--span': brick.span } as React.CSSProperties}
            >
              {/* Con `key` React no reutiliza el nodo de la pieza (GSAP le deja estilos en línea al soltarla) */}
              {filled ? (
                <span key="piece" data-piece className={css.piece}>
                  {letter}
                </span>
              ) : (
                <span key="mark" className={css['slot-mark']}>
                  ?
                </span>
              )}
            </div>
          ) : (
            <div
              key={i}
              className={css.mini}
              data-color={brick.color}
              data-top={r === 0 || undefined}
              style={{ '--span': brick.span } as React.CSSProperties}
            />
          )
        )}
      </div>
    ))}
  </div>
);
