import { useLang } from '@/hooks';

import { i18n } from './lib/constant';
import { TowerIcon } from './tower-icons';

import type { TowerSummary } from './types/types';

import css from './game-tower-blocks.module.css';

interface Props {
  summary: TowerSummary;
  headingRef: React.Ref<HTMLHeadingElement>;
  onRestart: () => void;
}

/**
 * Pantalla final: puntos, aciertos a la primera, mejor racha, intentos, altura, encajes justos y bloques caídos.
 */
export const TowerSummaryCard: React.FC<Props> = ({ summary, headingRef, onRestart }) => {
  const lang = useLang();
  const t = i18n[lang].summary;

  const stats = [
    { label: t.score, value: summary.score },
    { label: t.firstTry, value: `${summary.firstTry}/${summary.total}` },
    { label: t.bestStreak, value: summary.bestStreak },
    { label: t.attempts, value: summary.attempts },
    { label: t.height, value: summary.height },
    { label: t.perfects, value: summary.perfects },
    { label: t.bestCombo, value: summary.bestCombo },
    { label: t.fallen, value: summary.fallen }
  ];

  return (
    <section className={css.card} data-summary aria-labelledby="tower-summary-title">
      <span className={css.medal} aria-hidden="true">
        <TowerIcon name="star" />
      </span>

      <h3 id="tower-summary-title" ref={headingRef} tabIndex={-1} className={css['guide-title']}>
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
