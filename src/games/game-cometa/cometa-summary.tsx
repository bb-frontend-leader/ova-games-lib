import { useLang } from '@/hooks';

import { CometaIcon } from './cometa-icons';
import { i18n } from './lib/constant';

import type { CometaSummary } from './types/types';

import css from './game-cometa.module.css';

interface Props {
  summary: CometaSummary;
  headingRef: React.Ref<HTMLHeadingElement>;
  onRestart: () => void;
}

/**
 * Pantalla final: puntos, aciertos a la primera, mejor racha, intentos, lanzamientos que puntuaron, embocinadas, mechas
 * reventadas y puntería.
 */
export const CometaSummaryCard: React.FC<Props> = ({ summary, headingRef, onRestart }) => {
  const lang = useLang();
  const t = i18n[lang].summary;

  const rank = t.ranks[summary.rank];
  const stats = [
    { label: t.score, value: summary.score },
    { label: t.firstTry, value: `${summary.firstTry}/${summary.total}` },
    { label: t.bestStreak, value: summary.bestStreak },
    { label: t.attempts, value: summary.attempts },
    { label: t.falls, value: summary.falls },
    { label: t.saves, value: summary.saves }
  ];

  return (
    <section className={css.card} data-summary aria-labelledby="cometa-summary-title">
      <span className={css.medal} data-rank={summary.rank} aria-hidden="true">
        <CometaIcon name="star" />
      </span>

      <p className={css['summary-kicker']}>{t.title}</p>

      <h3 id="cometa-summary-title" ref={headingRef} tabIndex={-1} className={css['guide-title']}>
        {rank.title}
      </h3>

      <p className={css['summary-text']}>{rank.text}</p>

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
