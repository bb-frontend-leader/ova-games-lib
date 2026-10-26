import { useLang } from '@/hooks';

import { i18n } from './lib/constant';
import { SnakesIcon } from './snakes-icons';

import type { SnakesSummary } from './types/types';

import css from './game-snakes-ladders.module.css';

interface Props {
  summary: SnakesSummary;
  headingRef: React.Ref<HTMLHeadingElement>;
  onRestart: () => void;
}

/**
 * Pantalla final: puntos, aciertos a la primera, mejor racha, intentos, tiradas, escaleras, serpientes y escudos.
 */
export const SnakesSummaryCard: React.FC<Props> = ({ summary, headingRef, onRestart }) => {
  const lang = useLang();
  const t = i18n[lang].summary;

  const stats = [
    { label: t.score, value: summary.score },
    { label: t.firstTry, value: `${summary.firstTry}/${summary.total}` },
    { label: t.bestStreak, value: summary.bestStreak },
    { label: t.attempts, value: summary.attempts },
    { label: t.rolls, value: summary.rolls },
    { label: t.ladders, value: summary.ladders },
    { label: t.snakes, value: summary.snakes },
    { label: t.shields, value: summary.shields }
  ];

  return (
    <section className={css.card} data-summary aria-labelledby="snakes-summary-title">
      <span className={css.medal} aria-hidden="true">
        <SnakesIcon name="trophy" />
      </span>

      <h3 id="snakes-summary-title" ref={headingRef} tabIndex={-1} className={css['guide-title']}>
        {t.title}
      </h3>

      <dl className={css.stats}>
        {stats.map(({ label, value }) => (
          <div key={label} className={css.stat}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>

      <div className={css.actions}>
        <button type="button" className={css.btn} data-variant="ghost" onClick={onRestart}>
          {t.again}
        </button>
      </div>
    </section>
  );
};
