import { useId } from 'react';

import { useLang } from '@/hooks';

import { LanesCar } from './lanes-car';
import { LanesIcon } from './lanes-icons';
import { i18n, PLAYER_COLOR } from './lib/constant';

import type { LaneRaceQuestion, Phase, Verdict } from './types/types';

import css from './game-lane-race.module.css';

const LETTERS = 'ABCDEFGHIJ';

interface Props {
  question: LaneRaceQuestion;
  number: number;
  total: number;
  phase: Extract<Phase, 'question' | 'driving' | 'checked'>;
  /** Orden en que se muestran las respuestas (índices de `question.answers`): un carril por cada una. */
  order: number[];
  selected: number | null;
  /** Respuestas falladas en intentos anteriores de esta misma pregunta: su carril está bloqueado. */
  discarded: number[];
  verdict: Verdict | null;
  headingRef: React.Ref<HTMLHeadingElement>;
  verdictRef: React.Ref<HTMLDivElement>;
  nextRef: React.Ref<HTMLButtonElement>;
  onSelect: (answer: number) => void;
  onCheck: () => void;
  /** Tras comprobar: la pregunta siguiente (acierto), los resultados (última) o reintentar (fallo). */
  onNext: () => void;
}

/**
 * La pregunta de cada turno como una pista: un cartel con el enunciado y, debajo, un carril por respuesta que acaba en
 * su puerta. El coche se coloca en el carril elegido; al comprobar acelera hacia la puerta (la abre o choca).
 */
export const LanesCard: React.FC<Props> = ({
  question,
  number,
  total,
  phase,
  order,
  selected,
  discarded,
  verdict,
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
  const checked = phase === 'checked' && verdict !== null;
  const locked = phase !== 'question';
  const lane = selected === null ? -1 : order.indexOf(selected);
  const nextLabel = !verdict ? '' : !verdict.ok ? t.retry : verdict.last ? t.results : t.next;

  return (
    <section
      className={css.card}
      aria-labelledby={headingId}
      data-checked={checked ? '' : undefined}
      data-ok={checked && verdict.ok ? '' : undefined}
    >
      <div className={css.gantry}>
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
      </div>

      <fieldset className={css.road} disabled={locked}>
        <legend className="u-sr-only">{t.answers}</legend>

        <div className={css.lanes} style={{ '--n': order.length } as React.CSSProperties} data-lanes="">
          {order.map((answerIndex, position) => {
            const answer = question.answers[answerIndex];
            const isDiscarded = discarded.includes(answerIndex);
            const isPicked = selected === answerIndex;
            const state = checked && isPicked ? (verdict.ok ? 'ok' : 'ko') : undefined;

            return (
              <label
                key={answerIndex}
                className={css.lane}
                data-lane={answerIndex}
                data-state={state}
                data-discarded={isDiscarded ? '' : undefined}
                data-picked={isPicked ? '' : undefined}
              >
                <input
                  type="radio"
                  name={`${uid}-answers`}
                  className={css['lane-input']}
                  checked={isPicked}
                  disabled={isDiscarded}
                  onChange={() => onSelect(answerIndex)}
                />
                <span className={css.pit} aria-hidden="true">
                  <span className={css['lane-number']}>{position + 1}</span>
                </span>
                <span className={css.gate} data-gate="">
                  <span className={css.barrier} aria-hidden="true" />
                  <span className={css.letter} aria-hidden="true">
                    {LETTERS[position]}
                  </span>
                  <span className={css['answer-text']}>
                    <span dangerouslySetInnerHTML={{ __html: answer.label }} />
                    {isDiscarded && <span className="u-sr-only"> ({t.discarded})</span>}
                  </span>
                  {isDiscarded && <LanesIcon name="cone" className={css['gate-mark']} />}
                  {state && <LanesIcon name={state === 'ok' ? 'check' : 'cross'} className={css['gate-mark']} />}
                </span>
              </label>
            );
          })}

          {/* El coche espera en el centro de la pista hasta que se elige carril; luego se coloca en el suyo */}
          <div
            className={css.car}
            data-car=""
            data-idle={lane < 0 ? '' : undefined}
            style={{ top: `${((lane < 0 ? (order.length - 1) / 2 : lane) + 0.5) * (100 / order.length)}%` }}
          >
            <LanesCar className={css['car-svg']} color={PLAYER_COLOR} />
          </div>
        </div>
      </fieldset>

      {!checked ? (
        <div className={css.actions}>
          {selected === null && phase === 'question' && <span className={css.hint}>{t.pick}</span>}
          <button type="button" className={css.btn} disabled={selected === null || locked} onClick={onCheck}>
            {phase === 'driving' ? t.driving : t.check}
          </button>
        </div>
      ) : (
        <>
          <div ref={verdictRef} className={css.verdict} data-ok={verdict.ok ? '' : undefined}>
            <p className={css['verdict-title']}>
              <LanesIcon name={verdict.ok ? 'check' : 'cross'} />
              {verdict.ok ? t.verdict.ok : t.verdict.ko}
              {verdict.ok && <span className={css.points}>+{verdict.points}</span>}
            </p>
            <p className={css['verdict-hint']}>{!verdict.ok ? t.koHint : verdict.last ? t.okLast : t.okHint}</p>
            {verdict.ok && verdict.nitro && (
              <p className={css['verdict-hint']}>
                <LanesIcon name="bolt" /> {t.okNitro}
              </p>
            )}
          </div>

          <div className={css.actions}>
            <button ref={nextRef} type="button" className={css.btn} onClick={onNext}>
              <LanesIcon name={verdict.ok ? 'arrow' : 'cross'} />
              {nextLabel}
            </button>
          </div>
        </>
      )}
    </section>
  );
};
