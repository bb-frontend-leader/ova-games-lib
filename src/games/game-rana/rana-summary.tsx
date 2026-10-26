import { useLang } from '@/hooks';

import { i18n } from './lib/constant';
import { RanaIcon } from './rana-icons';

import type { RanaSummary } from './types/types';

import css from './game-rana.module.css';

interface Props {
  summary: RanaSummary;
  headingRef: React.Ref<HTMLHeadingElement>;
  onRestart: () => void;
}

/**
 * Pantalla final: puntos, aciertos a la primera, mejor racha, intentos, lanzamientos que puntuaron, embocinadas, mechas
 * reventadas y puntería.
 */
export const RanaSummaryCard: React.FC<Props> = ({ summary, headingRef, onRestart }) => {
  const lang = useLang();
  const t = i18n[lang].summary;

  const stats = [
    { label: t.score, value: summary.score },
    { label: t.firstTry, value: `${summary.firstTry}/${summary.total}` },
    { label: t.bestStreak, value: summary.bestStreak },
    { label: t.attempts, value: summary.attempts },
    { label: t.scored, value: `${summary.scored}/${summary.throws}` },
    { label: t.ranas, value: summary.ranas },
    { label: t.hots, value: summary.hots },
    { label: t.bestCombo, value: summary.bestCombo },
    { label: t.accuracy, value: `${summary.throws ? Math.round((summary.scored / summary.throws) * 100) : 0} %` }
  ];

  return (
    <section className={css.card} data-summary aria-labelledby="rana-summary-title">
      <span className={css.medal} aria-hidden="true">
        <RanaIcon name="frog" />
      </span>

      <h3 id="rana-summary-title" ref={headingRef} tabIndex={-1} className={css['guide-title']}>
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
