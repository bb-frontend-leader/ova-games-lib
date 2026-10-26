import { useLang } from '@/hooks';

import { i18n } from './lib/constant';
import { ParquesIcon } from './parques-icons';

import type { ParquesSummary } from './types/types';

import css from './game-parques.module.css';

interface Props {
  summary: ParquesSummary;
  headingRef: React.Ref<HTMLHeadingElement>;
  onRestart: () => void;
}

/**
 * Pantalla final: quién ganó la partida, los puntos, los aciertos a la primera, la mejor racha, las tiradas, las
 * fichas en el cielo y las capturas de cada lado.
 */
export const ParquesSummaryCard: React.FC<Props> = ({ summary, headingRef, onRestart }) => {
  const lang = useLang();
  const t = i18n[lang].summary;

  const stats = [
    { label: t.score, value: summary.score },
    { label: t.firstTry, value: `${summary.firstTry}/${summary.total}` },
    { label: t.bestStreak, value: summary.bestStreak },
    { label: t.attempts, value: summary.attempts },
    { label: t.rolls, value: summary.rolls },
    { label: t.home, value: summary.home },
    { label: t.rivalHome, value: summary.rivalHome },
    { label: t.captures, value: summary.captures },
    { label: t.captured, value: summary.captured }
  ];

  return (
    <section className={css.card} data-summary aria-labelledby="parques-summary-title">
      <span className={css.medal} aria-hidden="true">
        <ParquesIcon name="trophy" />
      </span>

      <h3 id="parques-summary-title" ref={headingRef} tabIndex={-1} className={css['guide-title']}>
        {summary.won ? t.win : t.lose}
      </h3>
      <p className={css['summary-text']}>{summary.won ? t.winText : t.loseText}</p>

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
