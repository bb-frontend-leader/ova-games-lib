import { useEffect, useId, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';

import { ValidationStatus } from '@/components/ui';
import { burst, centerIn, flyChip, ring } from '@/games/lib/fx';
import { useCanAnimate, useLang } from '@/hooks';
import { useGSAP } from '@gsap/react';

import { GameQuestionCardProvider, useGameQuestionContext } from './game-question-context';
import { FX_COLORS, i18n } from './lib/constant';

import css from './game-question.module.css';

interface Props extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  addClass?: string;
  questionNumber?: string;
  /** Imagen de fondo del escritorio (por defecto, una mesa de trabajo en CSS). */
  background?: string;
  /** Imagen de la pregunta: sin ella no se muestra ninguna. */
  imagen?: string;
  imageAlt?: string;
  /** Pista opcional: se muestra al pulsar «Pista» y no cuenta en el resultado. */
  hint?: string;
  /** Con un bloque de `___` en el enunciado, la respuesta elegida lo completa; sin él, es una pregunta normal. */
  question: string;
  children: JSX.Element | JSX.Element[];
}

const CONFETTI_SHAPES = ['polygon(0 0, 100% 0, 100% 100%, 0 100%)', 'circle(50%)'];

/**
 * Una tarjeta de estudio sobre un escritorio: la pregunta en una hoja con cinta, las respuestas como notas adhesivas.
 * La elegida vuela hasta el hueco `___` del enunciado (si lo tiene); al comprobar, un sello dice si fue correcta.
 */
export const GameQuestionCard: React.FC<Props> = ({
  question,
  imagen,
  imageAlt = 'Imagen descriptiva de la pregunta',
  questionNumber,
  background,
  hint,
  children,
  addClass,
  style,
  ...props
}) => {
  const lang = useLang();
  const t = i18n[lang];
  const canAnimate = useCanAnimate();
  const { options, validation } = useGameQuestionContext();

  const questionId = useId();
  const hintId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const fxRef = useRef<HTMLDivElement>(null);
  const blankRef = useRef<HTMLSpanElement>(null);
  const ids = useRef(new Set<string>());
  const validationRef = useRef(validation);
  const wasValidated = useRef(validation);

  const [hintOpen, setHintOpen] = useState(false);
  // La respuesta aparece en el hueco cuando la nota termina de volar hasta él
  const [shownId, setShownId] = useState<string | null>(null);

  validationRef.current = validation;

  // Sus respuestas se registran aquí: así la tarjeta sabe cuál es su elección aunque el juego tenga varias tarjetas
  const card = useMemo(() => ({ register: (id: string) => void ids.current.add(id) }), []);

  const picked = options.find((option) => ids.current.has(option.id)) ?? null;
  const pickedId = picked?.id ?? null;
  const ok = picked?.state === 'success';

  const blank = /_{3,}/.exec(question);
  const hasBlank = Boolean(blank);
  const before = blank ? question.slice(0, blank.index) : question;
  const after = blank ? question.slice(blank.index + blank[0].length) : '';

  const shownLabel = picked && shownId === picked.id ? picked.label : null;
  const sentence = blank && picked ? `${before}${picked.label ?? ''}${after}` : question;

  // Sin hueco o sin movimiento, la respuesta aparece al instante; al deseleccionar, se vacía
  useEffect(() => {
    if (!pickedId) setShownId(null);
    else if (!canAnimate || !hasBlank || validation) setShownId(pickedId);
  }, [pickedId, canAnimate, hasBlank, validation]);

  // Al reintentar, el foco vuelve a la primera respuesta (el botón «Reintentar» queda desactivado)
  useEffect(() => {
    if (wasValidated.current && !validation) {
      rootRef.current?.querySelector<HTMLElement>('input[type="radio"]:not(:disabled)')?.focus({ preventScroll: true });
    }

    wasValidated.current = validation;
  }, [validation]);

  /**
   * La nota elegida vuela hasta el hueco del enunciado y, al aterrizar, la respuesta queda escrita en él.
   */
  useGSAP(
    () => {
      const fx = fxRef.current;
      const slot = blankRef.current;

      if (!pickedId || !hasBlank || !canAnimate || !fx || !slot || validationRef.current) return;

      const from = rootRef.current?.querySelector<HTMLElement>(`label[for="${CSS.escape(pickedId)}"]`);
      if (!from) return;

      setShownId(null);

      flyChip(
        fx,
        fx.getBoundingClientRect(),
        from.getBoundingClientRect(),
        slot.getBoundingClientRect(),
        picked?.label ?? '',
        css.flyer,
        () => {
          setShownId(pickedId);
          gsap.fromTo(slot, { scale: 1.12 }, { scale: 1, duration: 0.4, ease: 'back.out(3)' });
        }
      );

      return () => fx.replaceChildren();
    },
    { scope: rootRef, dependencies: [pickedId, canAnimate] }
  );

  /**
   * Al comprobar: el acierto suelta confeti desde el hueco (o desde la hoja); el fallo sacude la hoja.
   */
  useGSAP(
    () => {
      const fx = fxRef.current;
      const paper = paperRef.current;

      if (!validation || !picked || !canAnimate || !fx || !paper) return;

      if (ok) {
        const at = centerIn((blankRef.current ?? paper).getBoundingClientRect(), fx.getBoundingClientRect());

        ring(fx, at, css.ring, '#ffd23f');
        burst(fx, at, {
          className: css.spark,
          colors: FX_COLORS,
          shapes: CONFETTI_SHAPES,
          count: 22,
          reach: [50, 140],
          size: [7, 13],
          gravity: 40
        });
      } else {
        gsap.fromTo(paper, { x: -10 }, { x: 0, duration: 0.6, ease: 'elastic.out(1, 0.25)' });
      }

      return () => fx.replaceChildren();
    },
    { scope: rootRef, dependencies: [validation, ok, canAnimate] }
  );

  const customStyle = background ? ({ ...style, '--bg-image': `url("${background}")` } as React.CSSProperties) : style;

  return (
    <div
      ref={rootRef}
      className={`${css.desk} ${addClass ?? ''}`}
      data-custom-bg={background ? '' : undefined}
      style={customStyle}
      {...props}
    >
      <GameQuestionCardProvider value={card}>
        <div ref={paperRef} data-id="card" className={css.paper}>
          <div className={css.head}>
            {questionNumber && (
              <p className={css.number} data-id="number-question">
                <span className="u-sr-only">{t.question} </span>
                {questionNumber}
              </p>
            )}

            {validation && picked && (
              <p className={css.stamp} data-result={ok ? 'ok' : 'ko'} aria-hidden="true">
                {ok ? t.stamp.ok : t.stamp.ko}
              </p>
            )}
          </div>

          <p id={questionId} className={css.question} data-id="question">
            {before}
            {blank && (
              <span
                ref={blankRef}
                className={css.blank}
                data-state={validation && picked ? (ok ? 'ok' : 'ko') : picked ? 'chosen' : 'empty'}
              >
                <span aria-hidden="true">{shownLabel ?? '____'}</span>
                <span className="u-sr-only">{picked?.label ?? t.blank}</span>
              </span>
            )}
            {after}
          </p>

          {imagen && (
            <figure className={css.photo}>
              <img src={imagen} alt={imageAlt} />
            </figure>
          )}

          {hint && (
            <div className={css['hint-area']}>
              <button
                type="button"
                className={css['hint-toggle']}
                aria-expanded={hintOpen}
                aria-controls={hintId}
                onClick={() => setHintOpen((open) => !open)}
              >
                {hintOpen ? t.hideHint : t.hint}
              </button>

              <p id={hintId} className={css.hint} hidden={!hintOpen}>
                {hint}
              </p>
            </div>
          )}

          <div role="radiogroup" aria-labelledby={questionId} className={css.options}>
            {children}
          </div>

          <ValidationStatus
            validated={validation && !!picked}
            correct={ok}
            correctText={`${t.status.ok} ${t.sentence}: ${sentence}`}
            wrongText={`${t.status.ko} ${t.sentence}: ${sentence}`}
          />
        </div>
      </GameQuestionCardProvider>

      {/* Capa de efectos: la nota que vuela y el confeti */}
      <div ref={fxRef} className={css.fx} aria-hidden="true" />
    </div>
  );
};
