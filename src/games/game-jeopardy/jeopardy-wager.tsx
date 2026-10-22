import { useLang } from '@/hooks';

import { JeopardyIcon } from './jeopardy-icons';
import { i18n, WAGERS } from './lib/constant';

import css from './game-jeopardy.module.css';

interface Props {
  points: number;
  headingRef: React.Ref<HTMLHeadingElement>;
  cardRef: React.Ref<HTMLElement>;
  onChoose: (multiplier: number) => void;
}

/**
 * Casilla de «Apuesta doble»: antes de ver la pregunta se elige cuánto arriesgar (1x, 2x o 3x la casilla).
 */
export const JeopardyWager: React.FC<Props> = ({ points, headingRef, cardRef, onChoose }) => {
  const lang = useLang();
  const t = i18n[lang].wager;

  return (
    <section ref={cardRef} className={css.card} data-double aria-labelledby="jeopardy-wager-title">
      <span className={css.medal} aria-hidden="true">
        <JeopardyIcon name="star" />
      </span>

      <h3 id="jeopardy-wager-title" ref={headingRef} tabIndex={-1} className={css['wager-title']}>
        {t.title}
      </h3>
      <p className={css['wager-text']}>{t.text}</p>

      <ul className={css.wagers}>
        {WAGERS.map((multiplier, i) => (
          <li key={multiplier}>
            <button type="button" className={css['wager-btn']} onClick={() => onChoose(multiplier)}>
              <span className={css['wager-name']}>{t.options[i]}</span>
              <span className={css['wager-points']}>{points * multiplier}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};
