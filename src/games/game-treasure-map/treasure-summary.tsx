import { useLang } from '@/hooks';

import { i18n } from './lib/constant';
import { TreasureIcon } from './treasure-icons';

import type { TreasureSummary } from './types/types';

import css from './game-treasure-map.module.css';

interface Props {
  summary: TreasureSummary;
  headingRef: React.Ref<HTMLHeadingElement>;
  onRestart: () => void;
}

/** Pantalla final: la valoración del viaje y sus cifras (puntos, islas a la primera, racha, tormentas, cofres…). */
export const TreasureSummaryCard: React.FC<Props> = ({ summary, headingRef, onRestart }) => {
  const lang = useLang();
  const t = i18n[lang];
  const idx = Math.min(summary.rank - 1, 3);

  const stats = [
    { label: t.summary.score, value: summary.score },
    { label: t.summary.firstTry, value: `${summary.firstTry}/${summary.total}` },
    { label: t.summary.bestStreak, value: summary.bestStreak },
    { label: t.summary.attempts, value: summary.attempts },
    { label: t.summary.storms, value: summary.storms },
    { label: t.summary.chests, value: `${summary.chests}/${summary.chestTotal}` }
  ];

  return (
    <section className={css.panel} data-kind="summary" aria-labelledby="treasure-summary-title">
      <span className={css.medal} aria-hidden="true" data-rank={summary.rank}>
        <TreasureIcon name="trophy" />
      </span>

      <h3 id="treasure-summary-title" ref={headingRef} tabIndex={-1} className={css['summary-title']}>
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
