import { useLang } from '@/hooks';

import { i18n } from './lib/constant';
import { SlotsIcon } from './slots-icons';

import type { SlotsSummary } from './types/types';

import css from './game-slots.module.css';

interface Props {
  summary: SlotsSummary;
  headingRef: React.Ref<HTMLHeadingElement>;
  onRestart: () => void;
}

/**
 * Pantalla final: puntos, aciertos a la primera, mejor racha, intentos, tiradas, mejor premio y jackpots.
 */
export const SlotsSummaryCard: React.FC<Props> = ({ summary, headingRef, onRestart }) => {
  const lang = useLang();
  const t = i18n[lang].summary;

  const stats = [
    { label: t.score, value: summary.score },
    { label: t.firstTry, value: `${summary.firstTry}/${summary.total}` },
    { label: t.bestStreak, value: summary.bestStreak },
    { label: t.attempts, value: summary.attempts },
    { label: t.pulls, value: summary.pulls },
    { label: t.bestWin, value: summary.bestWin },
    { label: t.jackpots, value: summary.jackpots }
  ];

  return (
    <section className={css.card} data-summary aria-labelledby="slots-summary-title">
      <span className={css.medal} aria-hidden="true">
        <SlotsIcon name="star" />
      </span>

      <h3 id="slots-summary-title" ref={headingRef} tabIndex={-1} className={css['pull-title']}>
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
