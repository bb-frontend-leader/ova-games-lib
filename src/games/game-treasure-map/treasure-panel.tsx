import { useId } from 'react';

import { useLang } from '@/hooks';

import { i18n } from './lib/constant';
import { TreasureIcon } from './treasure-icons';

import type { Phase, TreasureQuestion, Verdict } from './types/types';

import css from './game-treasure-map.module.css';

const LETTERS = 'ABCDEFGHIJ';

export type NextKind = 'retry' | 'route' | 'next';

interface Props {
  phase: Exclude<Phase, 'done'>;
  /** Pregunta de la isla elegida (no hay en la fase de elegir ruta). */
  question: TreasureQuestion | null;
  number: number;
  islandName: string;
  /** Islas que quedan por explorar. */
  left: number;
  /** Orden en que se muestran las respuestas (índices de `question.answers`). */
  order: number[];
  selected: number | null;
  /** Respuestas falladas en intentos anteriores de esta misma isla. */
  discarded: number[];
  verdict: Verdict | null;
  headingRef: React.Ref<HTMLHeadingElement>;
  verdictRef: React.Ref<HTMLDivElement>;
  nextRef: React.Ref<HTMLButtonElement>;
  onSelect: (answer: number) => void;
  onCheck: () => void;
  onNext: (kind: NextKind) => void;
}

/**
 * El pergamino bajo el mapa: según la fase pide elegir isla, plantea la pregunta de la isla elegida (con sus respuestas
 * y «Zarpar») o muestra el veredicto con los botones para seguir.
 */
export const TreasurePanel: React.FC<Props> = ({
  phase,
  question,
  number,
  islandName,
  left,
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
  const headingId = `${uid}-h`;
  const checked = phase === 'checked' && verdict !== null;

  if (phase === 'route' || phase === 'finale' || !question) {
    return (
      <section className={css.panel} aria-labelledby={headingId} data-kind="route">
        <TreasureIcon name={phase === 'finale' ? 'ship' : 'compass'} className={css['panel-icon']} />
        <div className={css['panel-body']}>
          <h3 id={headingId} ref={headingRef} tabIndex={-1} className={css['panel-title']}>
            {t.routeTitle}
          </h3>
          <p className={css['panel-text']}>{phase === 'finale' ? t.finaleText : t.routeText}</p>
          {phase === 'route' && <p className={css['panel-left']}>{t.left(left)}</p>}
        </div>
      </section>
    );
  }

  const locked = phase !== 'question';
  const nextLabel = !verdict ? '' : verdict.ok ? (verdict.last ? t.toTreasure : t.next) : t.retry;

  return (
    <section
      className={css.panel}
      aria-labelledby={headingId}
      data-kind="question"
      data-checked={checked ? '' : undefined}
      data-ok={checked && verdict.ok ? '' : undefined}
    >
      <div className={css['panel-body']}>
        <p className={css['panel-kicker']}>
          <span className={css.tag}>{t.island(number)}</span>
          {islandName}
        </p>

        <h3
          id={headingId}
          ref={headingRef}
          tabIndex={-1}
          className={css['panel-question']}
          dangerouslySetInnerHTML={{ __html: question.question }}
        />

        <fieldset className={css.answers} disabled={locked}>
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
                data-picked={isPicked ? '' : undefined}
                data-discarded={isDiscarded ? '' : undefined}
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
                {isDiscarded && <TreasureIcon name="cross" className={css['answer-mark']} />}
                {state && <TreasureIcon name={state === 'ok' ? 'check' : 'cross'} className={css['answer-mark']} />}
              </label>
            );
          })}
        </fieldset>
      </div>

      {!checked ? (
        <div className={css.actions}>
          {selected === null && phase === 'question' && <span className={css.hint}>{t.pick}</span>}
          <button
            type="button"
            className={css.btn}
            data-variant="ghost"
            disabled={phase !== 'question'}
            onClick={() => onNext('route')}
          >
            <TreasureIcon name="compass" />
            {t.change}
          </button>
          <button type="button" className={css.btn} disabled={selected === null || locked} onClick={onCheck}>
            <TreasureIcon name="anchor" />
            {phase === 'sailing' ? t.sailing : t.check}
          </button>
        </div>
      ) : (
        <>
          <div ref={verdictRef} className={css.verdict} data-ok={verdict.ok ? '' : undefined}>
            <p className={css['verdict-title']}>
              <TreasureIcon name={verdict.ok ? 'flag' : 'bolt'} />
              {verdict.ok ? t.verdict.ok : t.verdict.ko}
              {verdict.ok && <span className={css.points}>+{verdict.points}</span>}
            </p>
            <p className={css['verdict-hint']}>{verdict.ok ? (verdict.last ? t.okLast : t.okHint) : t.koHint}</p>
            {verdict.ok && verdict.chest && (
              <p className={css['verdict-hint']}>
                <TreasureIcon name="chest" /> {t.okChest}
              </p>
            )}
          </div>

          <div className={css.actions}>
            {!verdict.ok && (
              <button type="button" className={css.btn} data-variant="ghost" onClick={() => onNext('route')}>
                <TreasureIcon name="compass" />
                {t.change}
              </button>
            )}
            <button
              ref={nextRef}
              type="button"
              className={css.btn}
              onClick={() => onNext(verdict.ok ? 'next' : 'retry')}
            >
              <TreasureIcon name={verdict.ok ? 'arrow' : 'anchor'} />
              {nextLabel}
            </button>
          </div>
        </>
      )}
    </section>
  );
};
