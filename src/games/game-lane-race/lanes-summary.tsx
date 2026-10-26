import { useLang } from '@/hooks';

import { LanesIcon } from './lanes-icons';
import { i18n } from './lib/constant';

import type { LaneRaceSummary } from './types/types';

import css from './game-lane-race.module.css';

interface Props {
  summary: LaneRaceSummary;
  headingRef: React.Ref<HTMLHeadingElement>;
  onRestart: () => void;
}

/**
 * Pantalla final: el puesto en la carrera, los puntos, los aciertos a la primera, la mejor racha, los intentos, los
 * choques y los turbos.
 */
export const LanesSummaryCard: React.FC<Props> = ({ summary, headingRef, onRestart }) => {
  const lang = useLang();
  const t = i18n[lang];
  const idx = Math.min(summary.rank - 1, 3);

  const stats = [
    { label: t.summary.rank, value: t.rankOf(summary.rank, summary.cars) },
    { label: t.summary.score, value: summary.score },
    { label: t.summary.firstTry, value: `${summary.firstTry}/${summary.total}` },
    { label: t.summary.bestStreak, value: summary.bestStreak },
    { label: t.summary.attempts, value: summary.attempts },
    { label: t.summary.crashes, value: summary.crashes },
    { label: t.summary.nitros, value: summary.nitros }
  ];

  return (
    <section className={css.card} data-summary aria-labelledby="lanes-summary-title">
      <span className={css.medal} aria-hidden="true" data-rank={summary.rank}>
        <LanesIcon name="trophy" />
      </span>

      <h3 id="lanes-summary-title" ref={headingRef} tabIndex={-1} className={css['guide-title']}>
        {t.summary.title[idx]}
      </h3>
      <p className={css['summary-text']}>{t.summary.text[idx]}</p>

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
          {t.summary.again}
        </button>
      </div>
    </section>
  );
};
