import { useId } from 'react';

import { useLang } from '@/hooks';

import { CometaIcon } from './cometa-icons';
import { i18n } from './lib/constant';

import type { CometaQuestion, Verdict } from './types/types';

import css from './game-cometa.module.css';

const LETTERS = 'ABCDEFGHIJ';

interface Props {
  question: CometaQuestion;
  number: number;
  total: number;
  /** Orden en que se muestran las respuestas (índices de `question.answers`). */
  order: number[];
  selected: number | null;
  /** Respuestas falladas en intentos anteriores de esta misma pregunta. */
  discarded: number[];
  verdict: Verdict | null;
  /** Es la última pregunta: tras acertarla el botón abre los resultados. */
  finishing: boolean;
  headingRef: React.Ref<HTMLHeadingElement>;
  verdictRef: React.Ref<HTMLDivElement>;
  nextRef: React.Ref<HTMLButtonElement>;
  onSelect: (answer: number) => void;
  onCheck: () => void;
  /** Tras comprobar: cargar la cometa (acierto) o reintentar (fallo). */
  onNext: () => void;
}

/**
 * La pregunta de cada tramo: enunciado, respuestas (en orden aleatorio) y, al comprobar, el veredicto con lo que
 * pasa a continuación.
 */
export const CometaCard: React.FC<Props> = ({
  question,
  number,
  total,
  order,
  selected,
  discarded,
  verdict,
  finishing,
  headingRef,
  verdictRef,
  nextRef,
  onSelect,
  onCheck,
  onNext
}) => {
  const lang = useLang();
  const t = i18n[lang];
  const uid = useId();
  const headingId = `${uid}-q`;
  const checked = verdict !== null;
  const nextLabel = !verdict ? '' : verdict.ok ? (finishing ? t.results : t.load) : t.retry;

  return (
    <section
      className={css.card}
      aria-labelledby={headingId}
      data-checked={checked ? '' : undefined}
      data-ok={verdict?.ok ? '' : undefined}
    >
      <header className={css['card-head']}>
        <span className={css.tag}>
          {t.question} {number} {t.of} {total}
        </span>
      </header>

      <h3
        id={headingId}
        ref={headingRef}
        tabIndex={-1}
        className={css['card-question']}
        dangerouslySetInnerHTML={{ __html: question.question }}
      />

      <fieldset className={css.answers} disabled={checked}>
        <legend className="u-sr-only">{t.answers}</legend>

        {order.map((answerIndex, position) => {
          const answer = question.answers[answerIndex];
          const isDiscarded = discarded.includes(answerIndex);
          const isPicked = selected === answerIndex;
          const state = checked && isPicked ? (verdict.ok ? 'ok' : 'ko') : undefined;

          return (
            <label
              key={answerIndex}
              className={css.answer}
              data-state={state}
              data-discarded={isDiscarded ? '' : undefined}
              data-picked={isPicked ? '' : undefined}
            >
              <input
                type="radio"
                name={`${uid}-answers`}
                className={css['answer-input']}
                checked={isPicked}
                disabled={isDiscarded}
                onChange={() => onSelect(answerIndex)}
              />
              <span className={css.letter} aria-hidden="true">
                {LETTERS[position]}
              </span>
              <span className={css['answer-text']}>
                <span dangerouslySetInnerHTML={{ __html: answer.label }} />
                {isDiscarded && <span className="u-sr-only"> ({t.discarded})</span>}
              </span>
              {state && <CometaIcon name={state === 'ok' ? 'check' : 'cross'} className={css['answer-mark']} />}
            </label>
          );
        })}
      </fieldset>

      {!checked ? (
        <div className={css.actions}>
          <button type="button" className={css.btn} disabled={selected === null} onClick={onCheck}>
            {t.check}
          </button>
        </div>
      ) : (
        <>
          <div ref={verdictRef} className={css.verdict} data-ok={verdict.ok ? '' : undefined}>
            <p className={css['verdict-title']}>
              <CometaIcon name={verdict.ok ? 'check' : 'cross'} />
              {verdict.ok ? t.verdict.ok : t.verdict.ko}
              {verdict.ok && <span className={css.points}>+{verdict.points}</span>}
            </p>
            <p className={css['verdict-hint']}>{verdict.ok ? t.okHint : verdict.saved ? t.koSaved : t.koHint}</p>
            {verdict.ok && (verdict.firstTry || verdict.spool) && (
              <ul className={css.perks}>
                {verdict.firstTry && (
                  <li>
                    <CometaIcon name="star" /> {t.okBow}
                  </li>
                )}
                {verdict.spool && (
                  <li>
                    <CometaIcon name="disc" /> {t.okSpool}
                  </li>
                )}
              </ul>
            )}
          </div>

          <div className={css.actions}>
            <button ref={nextRef} type="button" className={css.btn} onClick={onNext}>
              <CometaIcon name={verdict.ok ? 'arrow' : 'cross'} />
              {nextLabel}
            </button>
          </div>
        </>
      )}
    </section>
  );
};
