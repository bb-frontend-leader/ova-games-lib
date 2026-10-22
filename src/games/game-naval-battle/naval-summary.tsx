import { useLang } from '@/hooks';

import { i18n } from './lib/constant';
import { NavalIcon } from './naval-icons';

import type { NavalSummary } from './types/types';

import css from './game-naval-battle.module.css';

interface Props {
  summary: NavalSummary;
  headingRef: React.Ref<HTMLHeadingElement>;
  onRestart: () => void;
}

/**
 * Pantalla final: puntos, aciertos a la primera, mejor racha, intentos, disparos, tocados y barcos hundidos.
 */
export const NavalSummaryCard: React.FC<Props> = ({ summary, headingRef, onRestart }) => {
  const lang = useLang();
  const t = i18n[lang].summary;

  const stats = [
    { label: t.score, value: summary.score },
    { label: t.firstTry, value: `${summary.firstTry}/${summary.total}` },
    { label: t.bestStreak, value: summary.bestStreak },
    { label: t.attempts, value: summary.attempts },
    { label: t.shots, value: summary.shots },
    { label: t.hits, value: summary.hits },
    { label: t.shipsSunk, value: summary.shipsSunk },
    { label: t.fleetsSunk, value: summary.fleetsSunk }
  ];

  return (
    <section className={css.card} data-summary aria-labelledby="naval-summary-title">
      <span className={css.medal} aria-hidden="true">
        <NavalIcon name="star" />
      </span>

      <h3 id="naval-summary-title" ref={headingRef} tabIndex={-1} className={css['guide-title']}>
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
