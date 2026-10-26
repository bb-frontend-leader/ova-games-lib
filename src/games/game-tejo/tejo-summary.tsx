import { useLang } from '@/hooks';

import { i18n } from './lib/constant';
import { TejoIcon } from './tejo-icons';

import type { TejoSummary } from './types/types';

import css from './game-tejo.module.css';

interface Props {
  summary: TejoSummary;
  headingRef: React.Ref<HTMLHeadingElement>;
  onRestart: () => void;
}

/**
 * Pantalla final: puntos, aciertos a la primera, mejor racha, intentos, lanzamientos que puntuaron, embocinadas, mechas
 * reventadas y puntería.
 */
export const TejoSummaryCard: React.FC<Props> = ({ summary, headingRef, onRestart }) => {
  const lang = useLang();
  const t = i18n[lang].summary;

  const stats = [
    { label: t.score, value: summary.score },
    { label: t.firstTry, value: `${summary.firstTry}/${summary.total}` },
    { label: t.bestStreak, value: summary.bestStreak },
    { label: t.attempts, value: summary.attempts },
    { label: t.scored, value: `${summary.scored}/${summary.throws}` },
    { label: t.bocines, value: summary.bocines },
    { label: t.mechas, value: summary.mechas },
    { label: t.bestCombo, value: summary.bestCombo },
    { label: t.accuracy, value: `${summary.throws ? Math.round((summary.scored / summary.throws) * 100) : 0} %` }
  ];

  return (
    <section className={css.card} data-summary aria-labelledby="tejo-summary-title">
      <span className={css.medal} aria-hidden="true">
        <TejoIcon name="bocin" />
      </span>

      <h3 id="tejo-summary-title" ref={headingRef} tabIndex={-1} className={css['guide-title']}>
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
