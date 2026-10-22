import { useLang } from '@/hooks';

import { i18n } from './lib/constant';
import { MinesIcon } from './mines-icons';

import type { MinesSummary } from './types/types';

import css from './game-minesweeper.module.css';

interface Props {
  summary: MinesSummary;
  headingRef: React.Ref<HTMLHeadingElement>;
  onRestart: () => void;
}

/**
 * Pantalla final: puntos, aciertos a la primera, mejor racha, intentos, minas pisadas, minas marcadas y bonus.
 */
export const MinesSummaryCard: React.FC<Props> = ({ summary, headingRef, onRestart }) => {
  const lang = useLang();
  const t = i18n[lang].summary;

  const stats = [
    { label: t.score, value: summary.score },
    { label: t.firstTry, value: `${summary.firstTry}/${summary.total}` },
    { label: t.bestStreak, value: summary.bestStreak },
    { label: t.attempts, value: summary.attempts },
    { label: t.minesHit, value: summary.minesHit },
    { label: t.flagsOk, value: summary.flagsOk },
    { label: t.bonus, value: `+${summary.bonus}` }
  ];

  return (
    <section className={css.card} data-summary aria-labelledby="mines-summary-title">
      <span className={css.medal} aria-hidden="true">
        <MinesIcon name="star" />
      </span>

      <h3 id="mines-summary-title" ref={headingRef} tabIndex={-1} className={css['guide-title']}>
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
