import { useId } from 'react';

import { useLang } from '@/hooks';

import { i18n } from './lib/constant';
import { LoteriaIcon } from './loteria-icons';

import type { LoteriaQuestion, Phase, Verdict } from './types/types';

import css from './game-loteria.module.css';

interface Props {
  question: LoteriaQuestion;
  number: number;
  total: number;
  phase: Extract<Phase, 'pick' | 'marking' | 'checked'>;
  verdict: Verdict | null;
  /** El cantor ya dejó solo dos cartas posibles en esta pista. */
  hinted: boolean;
  headingRef: React.Ref<HTMLHeadingElement>;
  verdictRef: React.Ref<HTMLDivElement>;
  nextRef: React.Ref<HTMLButtonElement>;
  /** Tras tocar una carta: la pista siguiente (acierto), los resultados (última) o reintentar (fallo). */
  onNext: () => void;
}

/**
 * El cantor: la baraja con la carta que se canta (se voltea con cada pista), la pista y, tras tocar una carta de la
 * tabla, el veredicto con el botón para seguir.
 */
export const LoteriaCaller: React.FC<Props> = ({
  question,
  number,
  total,
  phase,
  verdict,
  hinted,
  headingRef,
  verdictRef,
  nextRef,
  onNext
}) => {
  const lang = useLang();
  const t = i18n[lang];
  const headingId = `${useId()}-q`;
  const checked = phase === 'checked' && verdict !== null;
  const nextLabel = !verdict ? '' : !verdict.ok ? t.retry : verdict.last ? t.results : t.next;

  return (
    <section
      className={css.caller}
      aria-labelledby={headingId}
      data-checked={checked ? '' : undefined}
      data-ok={checked && verdict.ok ? '' : undefined}
    >
      <div className={css.deck} aria-hidden="true">
        <div key={question.id} className={css['deck-card']}>
          <LoteriaIcon name="cards" className={css['deck-icon']} />
          <span className={css['deck-number']}>{number}</span>
        </div>
      </div>

      <div className={css.clue}>
        <p className={css['clue-kicker']}>
          <span className={css.tag}>
            {t.question} {number} {t.of} {total}
          </span>
          {t.callerSays}
        </p>

        <h3
          id={headingId}
          ref={headingRef}
          tabIndex={-1}
          className={css['clue-text']}
          dangerouslySetInnerHTML={{ __html: question.question }}
        />

        {!checked && (
          <p className={css.hint} data-hot={hinted ? '' : undefined}>
            {hinted && <LoteriaIcon name="bulb" />}
            {hinted ? t.hintOn : t.pick}
          </p>
        )}
      </div>

      {checked && (
        <div className={css.result}>
          <div ref={verdictRef} className={css.verdict} data-ok={verdict.ok ? '' : undefined}>
            <p className={css['verdict-title']}>
              <LoteriaIcon name={verdict.ok ? 'check' : 'cross'} />
              {verdict.ok ? t.verdict.ok : t.verdict.ko}
              {verdict.ok && <span className={css.points}>+{verdict.points}</span>}
            </p>
            <p className={css['verdict-hint']}>{verdict.ok ? (verdict.last ? t.okLast : t.okHint) : t.koHint}</p>
            {verdict.ok && verdict.lines.length > 0 && (
              <p className={css['verdict-hint']}>
                <LoteriaIcon name="grid" /> {t.okLine(verdict.lines.length)}
              </p>
            )}
            {!verdict.ok && verdict.hint && (
              <p className={css['verdict-hint']}>
                <LoteriaIcon name="bulb" /> {t.koClue}
              </p>
            )}
          </div>

          <button ref={nextRef} type="button" className={css.btn} onClick={onNext}>
            <LoteriaIcon name={verdict.ok ? 'arrow' : 'cross'} />
            {nextLabel}
          </button>
        </div>
      )}
    </section>
  );
};
