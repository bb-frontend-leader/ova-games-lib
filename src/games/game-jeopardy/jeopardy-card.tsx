import { useId } from 'react';

import { useLang } from '@/hooks';

import { JeopardyIcon } from './jeopardy-icons';
import { i18n } from './lib/constant';

import type { Cell, Verdict } from './types/types';

import css from './game-jeopardy.module.css';

const LETTERS = 'ABCDEFGHIJ';

interface Props {
  cell: Cell;
  /** Orden en que se muestran las respuestas (índices de `question.answers`). */
  order: number[];
  selected: number | null;
  /** Respuestas eliminadas por el comodín en esta pregunta. */
  hidden: number[];
  /** Respuestas falladas en intentos anteriores de esta misma pregunta. */
  discarded: number[];
  verdict: Verdict | null;
  wager: number | null;
  lifelines: number;
  canJoker: boolean;
  /** Tras comprobar: era la última casilla pendiente (el botón lleva a los resultados). */
  finishing: boolean;
  cardRef: React.Ref<HTMLElement>;
  headingRef: React.Ref<HTMLHeadingElement>;
  verdictRef: React.Ref<HTMLDivElement>;
  nextRef: React.Ref<HTMLButtonElement>;
  onSelect: (answer: number) => void;
  onCheck: () => void;
  onJoker: () => void;
  onNext: () => void;
}

/**
 * La pregunta de la casilla abierta: enunciado, respuestas (en orden aleatorio), comodín 50:50 y, al comprobar,
 * el veredicto con el desglose de puntos.
 */
export const JeopardyCard: React.FC<Props> = ({
  cell,
  order,
  selected,
  hidden,
  discarded,
  verdict,
  wager,
  lifelines,
  canJoker,
  finishing,
  cardRef,
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
  const { question } = cell;
  const checked = verdict !== null;
  const visible = order.filter((answer) => !hidden.includes(answer));

  return (
    <section
      ref={cardRef}
      className={css.card}
      aria-labelledby={headingId}
      data-checked={checked ? '' : undefined}
      data-ok={verdict?.ok ? '' : undefined}
    >
      <header className={css['card-head']}>
        <span className={css.tag}>
          {cell.category} · {cell.points}
        </span>

        {wager && (
          <span className={css.x2}>
            <JeopardyIcon name="star" /> {t.breakdown.wager} x{wager}
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
              {state && <JeopardyIcon name={state === 'ok' ? 'check' : 'cross'} className={css['answer-mark']} />}
            </label>
          );
        })}
      </fieldset>

      {!checked ? (
        <div className={css.actions}>
          <button type="button" className={css.btn} data-variant="ghost" disabled={!canJoker} onClick={onJoker}>
            <JeopardyIcon name="card" />
            {t.joker}
            <span className={css.count}>x{lifelines}</span>
          </button>

          <button type="button" className={css.btn} disabled={selected === null} onClick={onCheck}>
            {t.check}
          </button>
        </div>
      ) : (
        <>
          <div ref={verdictRef} className={css.verdict} data-ok={verdict.ok ? '' : undefined}>
            <p className={css['verdict-title']}>
              <JeopardyIcon name={verdict.ok ? 'check' : 'cross'} />
              {verdict.ok ? t.verdict.ok : t.verdict.ko}
              {verdict.points !== 0 && (
                <span className={css.points}>
                  {verdict.points > 0 ? '+' : ''}
                  {verdict.points}
                </span>
              )}
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
                {verdict.wager && (
                  <li>
                    {t.breakdown.wager} x{verdict.wager}
                  </li>
                )}
                {verdict.halved && <li>{t.breakdown.joker} ÷2</li>}
                {verdict.retry && !verdict.wager && <li>{t.breakdown.retry} ÷2</li>}
              </ul>
            ) : (
              <p className={css['verdict-hint']}>{verdict.wager ? t.koHintDouble : t.koHint}</p>
            )}
          </div>

          <div className={css.actions}>
            <button ref={nextRef} type="button" className={css.btn} onClick={onNext}>
              {finishing ? t.results : t.back}
            </button>
          </div>
        </>
      )}
    </section>
  );
};
