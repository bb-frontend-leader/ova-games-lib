import { useId } from 'react';

import { useLang } from '@/hooks';

import { EscapeIcon } from './escape-icons';
import { i18n } from './lib/constant';

import type { EscapeQuestion, Verdict } from './types/types';

import css from './game-escape-room.module.css';

const LETTERS = 'ABCDEFGHIJ';

interface Props {
  question: EscapeQuestion;
  /** Nombre del objeto cuyo candado guarda esta pregunta. */
  object: string;
  number: number;
  total: number;
  /** Orden en que se muestran las respuestas (índices de `question.answers`). */
  order: number[];
  selected: number | null;
  /** Respuestas falladas o descartadas por la pista de esta misma pregunta. */
  discarded: number[];
  verdict: Verdict | null;
  /** Pistas que quedan y si se puede usar una ahora (queda una sola respuesta mala por descartar, o ya se usó). */
  hints: number;
  canHint: boolean;
  headingRef: React.Ref<HTMLHeadingElement>;
  verdictRef: React.Ref<HTMLDivElement>;
  nextRef: React.Ref<HTMLButtonElement>;
  onSelect: (answer: number) => void;
  onHint: () => void;
  onCheck: () => void;
  /** Tras comprobar: volver a la sala o ir a la puerta. */
  onNext: () => void;
}

/**
 * La pregunta de un objeto: enunciado, respuestas (en orden aleatorio) y, al comprobar, el veredicto con el dígito
 * que se encontró dentro.
 */
export const EscapeCard: React.FC<Props> = ({
  question,
  object,
  number,
  total,
  order,
  selected,
  discarded,
  verdict,
  hints,
  canHint,
  headingRef,
  verdictRef,
  nextRef,
  onSelect,
  onHint,
  onCheck,
  onNext
}) => {
  const lang = useLang();
  const t = i18n[lang];
  const uid = useId();
  const headingId = `${uid}-q`;
  const checked = verdict !== null;

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
        <span className={css.tag} data-kind="object">
          {object}
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
              {state && <EscapeIcon name={state === 'ok' ? 'check' : 'cross'} className={css['answer-mark']} />}
            </label>
          );
        })}
      </fieldset>

      {!checked ? (
        <div className={css.actions}>
          <button
            type="button"
            className={css.btn}
            data-variant="ghost"
            disabled={!canHint || hints <= 0}
            onClick={onHint}
          >
            <EscapeIcon name="lamp" />
            {t.hint(hints)}
          </button>

          <button type="button" className={css.btn} disabled={selected === null} onClick={onCheck}>
            {t.check}
          </button>
        </div>
      ) : (
        <>
          <div ref={verdictRef} className={css.verdict} data-ok={verdict.ok ? '' : undefined}>
            <p className={css['verdict-title']}>
              <EscapeIcon name={verdict.ok ? 'check' : 'cross'} />
              {verdict.ok ? t.verdict.ok : t.verdict.ko}
              {verdict.ok && <span className={css.points}>+{verdict.points}</span>}
            </p>
            <p className={css['verdict-hint']}>
              {verdict.ok ? t.okHint(object, verdict.slot, verdict.digit) : t.koHint}
            </p>
            {verdict.ok && (verdict.hintGain || verdict.cleared) && (
              <ul className={css.perks}>
                {verdict.hintGain && (
                  <li>
                    <EscapeIcon name="lamp" /> {t.okHintGain}
                  </li>
                )}
                {verdict.cleared && (
                  <li>
                    <EscapeIcon name="door" /> {t.okCleared}
                  </li>
                )}
              </ul>
            )}
          </div>

          <div className={css.actions}>
            <button ref={nextRef} type="button" className={css.btn} onClick={onNext}>
              {verdict.ok && verdict.cleared ? t.toDoor : t.backToRoom}
            </button>
          </div>
        </>
      )}
    </section>
  );
};
