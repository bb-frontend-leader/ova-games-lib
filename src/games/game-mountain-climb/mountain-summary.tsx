import { useLang } from '@/hooks';

import { i18n } from './lib/constant';
import { MountainIcon } from './mountain-icons';

import type { MountainSummary } from './types/types';

import css from './game-mountain-climb.module.css';

interface Props {
  summary: MountainSummary;
  headingRef: React.Ref<HTMLHeadingElement>;
  onRestart: () => void;
}

/**
 * Pantalla final: puntos, aciertos a la primera, mejor racha, intentos, caídas y tramos repetidos.
 */
export const MountainSummaryCard: React.FC<Props> = ({ summary, headingRef, onRestart }) => {
  const lang = useLang();
  const t = i18n[lang].summary;

  const stats = [
    { label: t.score, value: summary.score },
    { label: t.firstTry, value: `${summary.firstTry}/${summary.total}` },
    { label: t.bestStreak, value: summary.bestStreak },
    { label: t.attempts, value: summary.attempts },
    { label: t.falls, value: summary.falls },
    { label: t.retraced, value: summary.retraced }
  ];

  return (
    <section className={css.card} data-summary aria-labelledby="mountain-summary-title">
      <span className={css.medal} aria-hidden="true">
        <MountainIcon name="flag" />
      </span>

      <h3 id="mountain-summary-title" ref={headingRef} tabIndex={-1} className={css['guide-title']}>
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
