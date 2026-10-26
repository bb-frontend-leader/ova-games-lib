import { useLang } from '@/hooks';

import { CatapultIcon } from './catapult-icons';
import { i18n } from './lib/constant';

import type { CatapultSummary } from './types/types';

import css from './game-catapult.module.css';

interface Props {
  summary: CatapultSummary;
  headingRef: React.Ref<HTMLHeadingElement>;
  onRestart: () => void;
}

/**
 * Pantalla final: puntos, aciertos a la primera, mejor racha, intentos, torres derribadas, impactos directos y
 * puntería.
 */
export const CatapultSummaryCard: React.FC<Props> = ({ summary, headingRef, onRestart }) => {
  const lang = useLang();
  const t = i18n[lang].summary;

  const stats = [
    { label: t.score, value: summary.score },
    { label: t.firstTry, value: `${summary.firstTry}/${summary.total}` },
    { label: t.bestStreak, value: summary.bestStreak },
    { label: t.attempts, value: summary.attempts },
    { label: t.hits, value: `${summary.hits}/${summary.shots}` },
    { label: t.directs, value: summary.directs },
    { label: t.bestCombo, value: summary.bestCombo },
    { label: t.accuracy, value: `${summary.shots ? Math.round((summary.hits / summary.shots) * 100) : 0} %` }
  ];

  return (
    <section className={css.card} data-summary aria-labelledby="catapult-summary-title">
      <span className={css.medal} aria-hidden="true">
        <CatapultIcon name="tower" />
      </span>

      <h3 id="catapult-summary-title" ref={headingRef} tabIndex={-1} className={css['guide-title']}>
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
