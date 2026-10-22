import { useId } from 'react';

import { useLang } from '@/hooks';

import { i18n } from './lib/constant';
import { RouletteIcon } from './roulette-icons';

import type { RouletteQuestion, Verdict } from './types/types';

import css from './game-roulette.module.css';

const LETTERS = 'ABCDEFGHIJ';

interface Props {
  question: RouletteQuestion;
  number: number;
  total: number;
  bg: string;
  ink: string;
  /** Orden en que se muestran las respuestas (índices de `question.answers`). */
  order: number[];
  selected: number | null;
  /** Respuestas eliminadas por el comodín en esta pregunta. */
  hidden: number[];
  /** Respuestas falladas en intentos anteriores de esta misma pregunta. */
  discarded: number[];
  verdict: Verdict | null;
  jokers: number;
  canJoker: boolean;
  doubleArmed: boolean;
  /** Tras comprobar: acertó la última pregunta pendiente (el botón lleva a los resultados). */
  finishing: boolean;
  headingRef: React.Ref<HTMLHeadingElement>;
  verdictRef: React.Ref<HTMLDivElement>;
  nextRef: React.Ref<HTMLButtonElement>;
  onSelect: (answer: number) => void;
  onCheck: () => void;
  onJoker: () => void;
  onNext: () => void;
}

/**
 * La pregunta a la que llegó la ruleta: enunciado, respuestas (en orden aleatorio), comodín 50:50 y, al comprobar,
 * el veredicto con el desglose de puntos.
 */
export const RouletteCard: React.FC<Props> = ({
  question,
  number,
  total,
  bg,
  ink,
  order,
  selected,
  hidden,
  discarded,
  verdict,
  jokers,
  canJoker,
  doubleArmed,
  finishing,
  headingRef,
  verdictRef,
  nextRef,
  onSelect,
  onCheck,
  onJoker,
  onNext
}) => {
  const lang = useLang();
  const t = i18n[lang];
  const uid = useId();
  const headingId = `${uid}-q`;
  const checked = verdict !== null;
  const visible = order.filter((answer) => !hidden.includes(answer));

  return (
    <section
      className={css.card}
      aria-labelledby={headingId}
      data-checked={checked ? '' : undefined}
      data-ok={verdict?.ok ? '' : undefined}
      style={{ '--w': bg, '--ink': ink } as React.CSSProperties}
    >
      <header className={css['card-head']}>
        <span className={css.tag}>
          {t.question} {number} {t.of} {total}
          {question.category && <span className={css['tag-category']}> · {question.category}</span>}
        </span>

        {doubleArmed && !checked && (
          <span className={css.x2}>
            <RouletteIcon name="star" /> {t.hud.double}
          </span>
        )}
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

        {visible.map((answerIndex, position) => {
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
              {state && <RouletteIcon name={state === 'ok' ? 'check' : 'cross'} className={css['answer-mark']} />}
            </label>
          );
        })}
      </fieldset>

      {!checked ? (
        <div className={css.actions}>
          <button type="button" className={css.btn} data-variant="ghost" disabled={!canJoker} onClick={onJoker}>
            <RouletteIcon name="card" />
            {t.joker}
            <span className={css.count}>x{jokers}</span>
          </button>

          <button type="button" className={css.btn} disabled={selected === null} onClick={onCheck}>
            {t.check}
          </button>
        </div>
      ) : (
        <>
          <div ref={verdictRef} className={css.verdict} data-ok={verdict.ok ? '' : undefined}>
            <p className={css['verdict-title']}>
              <RouletteIcon name={verdict.ok ? 'check' : 'cross'} />
              {verdict.ok ? t.verdict.ok : t.verdict.ko}
              {verdict.ok && <span className={css.points}>+{verdict.points}</span>}
            </p>

            {verdict.ok ? (
              <ul className={css.breakdown}>
                <li>
                  {t.breakdown.base} {verdict.base}
                </li>
                {verdict.bonus > 0 && (
                  <li>
                    {t.breakdown.streak} +{verdict.bonus}
                  </li>
                )}
                {verdict.halved && <li>{t.breakdown.joker} ÷2</li>}
                {verdict.doubled && <li>{t.breakdown.double} x2</li>}
              </ul>
            ) : (
              <p className={css['verdict-hint']}>{t.koHint}</p>
            )}
          </div>

          <div className={css.actions}>
            <button ref={nextRef} type="button" className={css.btn} onClick={onNext}>
              {finishing ? t.results : t.next}
            </button>
          </div>
        </>
      )}
    </section>
  );
};
