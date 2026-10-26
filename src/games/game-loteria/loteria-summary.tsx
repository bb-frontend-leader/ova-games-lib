import { useLang } from '@/hooks';

import { i18n } from './lib/constant';
import { LoteriaIcon } from './loteria-icons';

import type { LoteriaSummary } from './types/types';

import css from './game-loteria.module.css';

interface Props {
  summary: LoteriaSummary;
  headingRef: React.Ref<HTMLHeadingElement>;
  onRestart: () => void;
}

/** Pantalla final: la valoración de la partida y sus cifras (puntos, aciertos a la primera, racha, líneas, pistas…). */
export const LoteriaSummaryCard: React.FC<Props> = ({ summary, headingRef, onRestart }) => {
  const lang = useLang();
  const t = i18n[lang];
  const idx = Math.min(summary.rank - 1, 3);

  const stats = [
    { label: t.summary.score, value: summary.score },
    { label: t.summary.firstTry, value: `${summary.firstTry}/${summary.total}` },
    { label: t.summary.bestStreak, value: summary.bestStreak },
    { label: t.summary.lines, value: summary.lines },
    { label: t.summary.attempts, value: summary.attempts },
    { label: t.summary.errors, value: summary.errors },
    { label: t.summary.hints, value: summary.hints }
  ];

  return (
    <section className={css.caller} data-summary aria-labelledby="loteria-summary-title">
      <span className={css.medal} aria-hidden="true" data-rank={summary.rank}>
        <LoteriaIcon name="trophy" />
      </span>

      <h3 id="loteria-summary-title" ref={headingRef} tabIndex={-1} className={css['summary-title']}>
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
