import { useLang } from '@/hooks';

import { i18n } from './lib/constant';
import { PlinkoIcon } from './plinko-icons';

import type { PlinkoSummary } from './types/types';

import css from './game-plinko.module.css';

interface Props {
  summary: PlinkoSummary;
  headingRef: React.Ref<HTMLHeadingElement>;
  onRestart: () => void;
}

/**
 * Pantalla final: puntos, aciertos a la primera, mejor racha, intentos, fichas y mejor premio.
 */
export const PlinkoSummaryCard: React.FC<Props> = ({ summary, headingRef, onRestart }) => {
  const lang = useLang();
  const t = i18n[lang].summary;

  const stats = [
    { label: t.score, value: summary.score },
    { label: t.firstTry, value: `${summary.firstTry}/${summary.total}` },
    { label: t.bestStreak, value: summary.bestStreak },
    { label: t.attempts, value: summary.attempts },
    { label: t.balls, value: summary.balls },
    { label: t.bestPrize, value: summary.bestPrize }
  ];

  return (
    <section className={css.card} data-summary aria-labelledby="plinko-summary-title">
      <span className={css.medal} aria-hidden="true">
        <PlinkoIcon name="star" />
      </span>

      <h3 id="plinko-summary-title" ref={headingRef} tabIndex={-1} className={css['drop-title']}>
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
