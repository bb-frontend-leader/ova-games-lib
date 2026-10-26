import { useId } from 'react';

import { useLang } from '@/hooks';

import { ENERGY_MAX, i18n } from './lib/constant';
import { MountainIcon } from './mountain-icons';

import type { MountainQuestion, Verdict } from './types/types';

import css from './game-mountain-climb.module.css';

const LETTERS = 'ABCDEFGHIJ';

interface Props {
  question: MountainQuestion;
  number: number;
  total: number;
  /** Orden en que se muestran las respuestas (índices de `question.answers`). */
  order: number[];
  selected: number | null;
  /** Respuestas falladas en intentos anteriores de esta misma pregunta. */
  discarded: number[];
  verdict: Verdict | null;
  /** Fuerzas que quedan tras comprobar (para el aviso de resbalón). */
  energy: number;
  headingRef: React.Ref<HTMLHeadingElement>;
  verdictRef: React.Ref<HTMLDivElement>;
  nextRef: React.Ref<HTMLButtonElement>;
  onSelect: (answer: number) => void;
  onCheck: () => void;
  /** Tras comprobar: subir (acierto), reintentar (fallo) o caer al campamento (fallo sin fuerzas). */
  onNext: () => void;
}

/**
 * La pregunta de cada tramo: enunciado, respuestas (en orden aleatorio) y, al comprobar, el veredicto con lo que
 * pasa a continuación.
 */
export const MountainCard: React.FC<Props> = ({
  question,
  number,
  total,
  order,
  selected,
  discarded,
  verdict,
  energy,
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
  const nextLabel = !verdict
    ? ''
    : verdict.ok
      ? t.climb
      : verdict.fall
        ? verdict.lost > 0
          ? t.slide
          : t.rest
        : t.retry;

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
              {state && <MountainIcon name={state === 'ok' ? 'check' : 'cross'} className={css['answer-mark']} />}
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
              <MountainIcon name={verdict.ok ? 'check' : 'cross'} />
              {verdict.ok ? t.verdict.ok : t.verdict.ko}
              {verdict.ok && <span className={css.points}>+{verdict.points}</span>}
            </p>
            <p className={css['verdict-hint']}>
              {verdict.ok ? t.okHint : verdict.fall ? t.koFall(verdict.lost) : t.koHint}
            </p>
            {!verdict.ok && !verdict.fall && (
              <p className={css['verdict-hint']}>
                {t.hud.energy}: {t.energyOf(energy, ENERGY_MAX)}
              </p>
            )}
            {verdict.ok && verdict.rested && (
              <ul className={css.perks}>
                <li>
                  <MountainIcon name="bolt" /> {t.okRested}
                </li>
              </ul>
            )}
          </div>

          <div className={css.actions}>
            <button ref={nextRef} type="button" className={css.btn} onClick={onNext}>
              <MountainIcon name={verdict.ok ? 'arrow' : 'cross'} />
              {nextLabel}
            </button>
          </div>
        </>
      )}
    </section>
  );
};
