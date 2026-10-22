import { useLang } from '@/hooks';

import { EscapeIcon } from './escape-icons';
import { i18n } from './lib/constant';

import type { EscapeSummary } from './types/types';

import css from './game-escape-room.module.css';

interface Props {
  summary: EscapeSummary;
  headingRef: React.Ref<HTMLHeadingElement>;
  onRestart: () => void;
}

/**
 * Pantalla final: puntos, aciertos a la primera, mejor racha, intentos, salas, pistas, códigos fallidos y bonus.
 */
export const EscapeSummaryCard: React.FC<Props> = ({ summary, headingRef, onRestart }) => {
  const lang = useLang();
  const t = i18n[lang].summary;

  const stats = [
    { label: t.score, value: summary.score },
    { label: t.firstTry, value: `${summary.firstTry}/${summary.total}` },
    { label: t.bestStreak, value: summary.bestStreak },
    { label: t.attempts, value: summary.attempts },
    { label: t.rooms, value: summary.rooms },
    { label: t.hintsUsed, value: summary.hintsUsed },
    { label: t.badCodes, value: summary.badCodes },
    { label: t.bonus, value: `+${summary.bonus}` }
  ];

  return (
    <section className={css.card} data-summary aria-labelledby="escape-summary-title">
      <span className={css.medal} aria-hidden="true">
        <EscapeIcon name="star" />
      </span>

      <h3 id="escape-summary-title" ref={headingRef} tabIndex={-1} className={css['guide-title']}>
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
