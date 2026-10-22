import { Children, isValidElement, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState } from 'react';
import gsap from 'gsap';

import { SOUNDS } from '@/constants';
import { burst, centerIn, flyChip, ring } from '@/games/lib/fx';
import { useCanAnimate, useDeferredResult, useLang, usePlaySound } from '@/hooks';
import { useGSAP } from '@gsap/react';

import { i18n } from './const/const';
import { GameMillionProvider } from './game-million-context';
import { GameMillionElement } from './game-million-element';
import { GameMillionButton } from './game-millions-button';
import { GameMillionsEnd } from './game-millions-end';
import { GameMillionsInit } from './game-millions-init';
import mainIcon from './public/assets/main_icon.webp';
import { PRIZE, STATES } from './utils/consts';
import { convertNumber } from './utils/convert-number';

import type { InitialState } from './types/types';
import type { gameMilionAnswer } from './types/types';

import css from './game-millions.module.css';

const INITIAL_STATE = Object.freeze({
  validation: false,
  button: true,
  result: false,
  options: [],
  level: 0,
  money: 0,
  selects: [],
  isVerify: false,
  selectedLabel: ''
});

const COIN_COLORS = ['#fccc19', '#ffe27a', '#f5a623', '#ffffff'] as const;
const RING_COLOR = '#fccc19';
// Monedas redondas, destellos en rombo y estrellas
const COIN_SHAPES = [
  'circle(50%)',
  'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)',
  'polygon(50% 0, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
];

type SubComponents = {
  Element: typeof GameMillionElement;
  Button: typeof GameMillionButton;
  /** Pantalla de inicio: no necesita el juego, va en la sección anterior del panel. */
  Init: typeof GameMillionsInit;
  /** Pantalla final: la muestra la página cuando se termina la última pregunta (ver `onFinish`). */
  End: typeof GameMillionsEnd;
};

export interface GameMilionsProps {
  onQuestionChange?: (index: number) => void;
  onResult?: ({ result, options }: { result: boolean; options: gameMilionAnswer[] }) => void;
  onMoneyChange?: (value: number) => void;

  children: React.ReactNode;
  question: React.ReactNode | JSX.Element;
  money: number;
  alt: React.ReactNode | JSX.Element;

  /** Muestra "Siguiente" dentro del juego; se habilita cuando la pregunta está resuelta. */
  onNext?: () => void;
  /** En la última pregunta: el botón de avanzar dice "Finalizar" y lleva a la pantalla final (`GameMilions.End`). */
  onFinish?: () => void;
  /** Muestra "Atrás" dentro del juego. */
  onPrevious?: () => void;
  /** La pregunta ya se respondió bien antes: el juego arranca con la respuesta correcta marcada. */
  solved?: boolean;
  /** Al montarse lleva el foco al juego (para cuando se llega con Siguiente o Atrás). */
  autoFocus?: boolean;
}

const GameMilions: React.FC<GameMilionsProps> & SubComponents = ({
  question,
  money,
  alt,
  children,
  onQuestionChange,
  onResult,
  onMoneyChange,
  onNext,
  onFinish,
  onPrevious,
  solved = false,
  autoFocus = false
}) => {
  const lang = useLang();
  const text = i18n[lang];
  const playSound = usePlaySound();
  const canAnimate = useCanAnimate();
  // El resultado se entrega tras la celebración (acierto) o el temblor (error), antes del modal del padre
  const { defer, flush } = useDeferredResult();

  const containerRef = useRef<HTMLDivElement>(null);
  const fxRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLParagraphElement>(null);
  const valueRef = useRef<HTMLSpanElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  // Lo que muestra el contador ahora y a dónde va: evita volver a animar cuando el padre confirma el mismo monto
  const shownRef = useRef<number>(money);
  const targetRef = useRef<number>(money);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const { contextSafe } = useGSAP({ scope: containerRef });

  const [announce, setAnnounce] = useState('');
  const [activity, updateActivity] = useReducer(
    (prev: InitialState, next: Partial<InitialState>) => ({ ...prev, ...next }),
    INITIAL_STATE
  );

  const radioElementsId = useRef<string[]>([]);

  /**
   * Agrega el ID de un componente RadioElement
   * para realizar la validación de la actividad.
   * @param {string} uid - El ID del componente RadioElement.
   */
  const addRadioElementsId = (uid: string): void => {
    if (!radioElementsId.current.includes(uid)) {
      radioElementsId.current = [...radioElementsId.current, uid];
    }
  };

  /**
   * Creada para almacenar los radio seleccionados,
   * se crea un nuevo objecto con el id de la pregunta y el valor del radio.
   *
   * @param {String} id - id de la pregunta.
   * @param {Object} value - valor del radio seleccionado.
   */
  const addRadiosValues = ({ id, label, name, state }: gameMilionAnswer) => {
    updateActivity({
      options: [...activity.options.filter((option) => option.name !== name), { id, name, label, state }],
      selectedLabel: label
    });
  };

  const restoreSolved = ({ id, label, name, state }: gameMilionAnswer) => {
    updateActivity({
      options: [{ id, name, label, state }],
      selectedLabel: label,
      selects: [id],
      isVerify: true,
      result: true
    });
  };

  const answerElements = useMemo(() => {
    return Children.toArray(children).filter((child) => isValidElement(child) && child.type === GameMillionElement);
  }, [children]);

  const actions = useMemo(() => {
    return Children.toArray(children).filter((child) => !(isValidElement(child) && child.type === GameMillionElement));
  }, [children]);

  useEffect(() => {
    if (onQuestionChange) {
      onQuestionChange(activity.level);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activity.level]);

  /**
   * Mueve el foco en el siguiente frame, cuando React ya aplicó el cambio de estado, solo si el foco se perdió:
   * un botón o una respuesta que se deshabilita lo suelta y el teclado volvería al inicio de la página.
   */
  const focusSoon = (find: () => Element | null | undefined) => {
    requestAnimationFrame(() => {
      const active = document.activeElement as HTMLElement | null;
      const lost =
        !active ||
        active === document.body ||
        (active as HTMLButtonElement).disabled ||
        containerRef.current?.contains(active) ||
        actionsRef.current?.contains(active);

      if (lost) (find() as HTMLElement | null | undefined)?.focus({ preventScroll: true });
    });
  };

  /**
   * Lleva el contador a `target`. Con movimiento cuenta hacia arriba; sin él cambia de golpe.
   * El número animado es decorativo (`aria-hidden`): el lector de pantalla lee el monto final, no cada paso.
   */
  const countTo = contextSafe((target: number) => {
    const el = valueRef.current;
    targetRef.current = target;
    tweenRef.current?.kill();
    if (!el) return;

    if (!canAnimate) {
      shownRef.current = target;
      el.textContent = convertNumber(target);
      return;
    }

    const obj = { value: shownRef.current };

    tweenRef.current = gsap.to(obj, {
      value: target,
      duration: 1,
      ease: 'power2.out',
      onUpdate: () => {
        shownRef.current = obj.value;
        el.textContent = convertNumber(Math.floor(obj.value));
      },
      onComplete: () => {
        shownRef.current = target;
        el.textContent = convertNumber(target);
      }
    });
  });

  // Se llegó con Siguiente o Atrás: el teclado sigue en el juego y no vuelve al inicio de la página.
  // Una pregunta resuelta llega con las respuestas deshabilitadas: el foco va a "Siguiente".
  useEffect(() => {
    if (!autoFocus) return;

    const find = () =>
      containerRef.current?.querySelector(solved ? '[data-nav="next"]:not(:disabled)' : 'input:not(:disabled)') ??
      statusRef.current;

    focusSoon(find);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    if (valueRef.current) valueRef.current.textContent = convertNumber(shownRef.current);
  }, []);

  // El padre cambió el monto por su cuenta (no por esta respuesta): el contador lo sigue
  useEffect(() => {
    if (money !== targetRef.current) countTo(money);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [money]);

  const handleStateClass = (id: string, state: 'success' | 'wrong') => {
    if (!activity.selects.includes(id)) return '';
    if (activity.isVerify) return STATES[state];
    return STATES.select;
  };

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    const inputID = (event.target as HTMLInputElement).id;

    if (!activity.isVerify) {
      playSound(SOUNDS.TICK);
      updateActivity({ selects: [inputID] });
    }
  };

  /**
   * Acierto (solo con movimiento): estalla una lluvia de monedas en la respuesta, el premio vuela hasta el
   * contador y al llegar este cuenta hacia arriba con otro estallido.
   */
  const celebrate = contextSafe((answerId: string, newMoney: number) => {
    const fx = fxRef.current;
    const box = counterRef.current;
    const answer = document.getElementById(answerId)?.closest('label');

    playSound(SOUNDS.UNLOCK);
    if (!canAnimate || !fx || !box || !answer) {
      countTo(newMoney);
      return;
    }

    const layerRect = fx.getBoundingClientRect();
    const from = answer.getBoundingClientRect();
    const at = centerIn(from, layerRect);

    ring(fx, at, css.ring, RING_COLOR);
    burst(fx, at, {
      className: css.shard,
      colors: COIN_COLORS,
      shapes: COIN_SHAPES,
      count: 16,
      reach: [70, 170],
      size: [8, 15]
    });

    const chipFrom = new DOMRect(from.left + from.width / 2 - 66, from.top + from.height / 2 - 17, 132, 34);

    flyChip(
      fx,
      layerRect,
      chipFrom,
      box.getBoundingClientRect(),
      `+$${PRIZE.toLocaleString('en-US')}`,
      css.flyer,
      contextSafe(() => {
        const land = centerIn(box.getBoundingClientRect(), layerRect);

        playSound(SOUNDS.POP);
        countTo(newMoney);
        gsap.fromTo(box, { scale: 1.22 }, { scale: 1, duration: 0.55, ease: 'back.out(3)' });
        ring(fx, land, css.ring, RING_COLOR);
        burst(fx, land, {
          className: css.shard,
          colors: COIN_COLORS,
          shapes: COIN_SHAPES,
          count: 10,
          reach: [30, 80],
          size: [6, 11],
          gravity: 18
        });
      })
    );
  });

  const handleVerify = () => {
    const result = verifySelect();
    const selectedId = activity.selects[0];
    const newMoney = result ? money + PRIZE : money;

    updateActivity({
      isVerify: true,
      result,
      money: result ? activity.money + PRIZE : activity.money
    });

    setAnnounce(
      result
        ? `${text.CorrectAnswer}: ${activity.selectedLabel}. ${text.Prize}: ${convertNumber(newMoney)}.`
        : `${text.WrongAnswer}: ${activity.selectedLabel}.`
    );
    if (result && selectedId) celebrate(selectedId, newMoney);

    // "Comprobar" y las respuestas se deshabilitan: el foco pasa al siguiente botón, o al aviso si no queda ninguno
    focusSoon(
      () =>
        containerRef.current?.querySelector('[data-nav="next"]:not(:disabled)') ??
        actionsRef.current?.querySelector('button:not(:disabled)') ??
        statusRef.current
    );

    // Se entrega tras la celebración o el temblor para que se vean antes del modal del padre. Siempre después de
    // mover el foco: así el modal, al cerrarse, devuelve el foco a un botón habilitado y no a "Comprobar".
    defer(() => {
      requestAnimationFrame(() => {
        onResult?.({ result, options: activity.options });
        onMoneyChange?.(newMoney);
      });
    }, result);
  };

  const handleReset = () => {
    // Si todavía hay un resultado en espera (reintento inmediato), se entrega ya: no se pierde ni llega tarde.
    flush();

    updateActivity({ selects: [], result: false, isVerify: false, selectedLabel: '' });
    setAnnounce('');
    // "Reintentar" se deshabilita: el foco vuelve a la primera respuesta
    focusSoon(() => containerRef.current?.querySelector('input:not(:disabled)'));
  };

  const verifySelect = () => {
    if (activity.selects.length === 0) return false;

    for (const selected of activity.selects) {
      const dt = activity.options?.find((ans) => ans.id === selected);

      if (!dt) return false;
      if (dt.state !== 'success') return false;
    }

    return true;
  };

  /**
   * Renderiza la pregunta con soporte para espacios en blanco usando el marcador ___.
   * Si la pregunta contiene ___, lo reemplaza con el label seleccionado o un placeholder.
   */
  const renderQuestion = () => {
    // Si question no es un string, retornarlo tal cual
    if (typeof question !== 'string') return question;

    // Si no contiene el marcador, retornar la pregunta normal
    if (!question.includes('___')) return question;

    // Dividir la pregunta por el marcador
    const parts = question.split('___');

    return (
      <>
        {parts[0]}
        {/* Con `key` la palabra elegida "cae" en el espacio cada vez que cambia */}
        <strong className={css.blank} key={activity.selectedLabel}>
          {activity.selectedLabel || (
            <>
              <span aria-hidden="true">____</span>
              <span className={css['sr-only']}>{text.Blank}</span>
            </>
          )}
        </strong>
        {parts[1]}
      </>
    );
  };

  return (
    <GameMillionProvider
      value={{
        points: activity.money,
        activity,

        solved,
        addRadioElementsId,
        addRadiosValues,
        restoreSolved,
        verifySelect,
        handleReset,
        handleStateClass,
        handleChange,
        handleVerify
      }}
    >
      <div className={css.container} ref={containerRef}>
        <div className={css.header}>
          <div className={css['logo-wrap']}>
            <img className={css.logo} src={mainIcon} alt={text.Logo} />
          </div>

          <p ref={counterRef} className={css.counter}>
            <span className={css['sr-only']}>
              {text.Prize}: {convertNumber(money)}
            </span>
            <span ref={valueRef} aria-hidden="true" />
          </p>
        </div>

        <fieldset className={css['wrapper-question']}>
          <legend className={css.question}>
            <span className={css.frame} aria-hidden="true" />
            <span className={css['question-text']}>{renderQuestion()}</span>
          </legend>
          <div className={css['wrapper-answer']}>{answerElements}</div>
        </fieldset>

        <p ref={statusRef} className={css['sr-only']} role="status" tabIndex={-1}>
          {announce}
        </p>

        {(onPrevious || onNext || onFinish) && (
          <div className={css.nav}>
            {onPrevious && (
              <button
                type="button"
                className={css['nav-button']}
                data-nav="previous"
                onClick={() => {
                  playSound(SOUNDS.BUTTON);
                  onPrevious();
                }}
              >
                <span className={css.halo} aria-hidden="true" />
                <span className={css.frame} aria-hidden="true" />
                <span className={css['nav-label']}>
                  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={css['nav-arrow']}>
                    <path d="M15 5 8 12l7 7" />
                  </svg>
                  {text.Back}
                </span>
              </button>
            )}

            {(onNext || onFinish) && (
              <button
                type="button"
                className={css['nav-button']}
                data-nav="next"
                disabled={!activity.result && !solved}
                onClick={() => {
                  playSound(SOUNDS.BUTTON);
                  (onNext ?? onFinish)?.();
                }}
              >
                <span className={css.halo} aria-hidden="true" />
                <span className={css.frame} aria-hidden="true" />
                <span className={css['nav-label']}>
                  {onNext ? text.Next : text.Finish}
                  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={css['nav-arrow']}>
                    <path d="m9 5 7 7-7 7" />
                  </svg>
                </span>
              </button>
            )}
          </div>
        )}

        {/* Capa de efectos: monedas, ondas y el premio en vuelo */}
        <div className={css.fx} ref={fxRef} aria-hidden="true" />
      </div>

      <figcaption className="u-text-center">
        <p>{alt}</p>
      </figcaption>

      <div ref={actionsRef}>{actions}</div>
    </GameMillionProvider>
  );
};

GameMilions.Element = GameMillionElement;
GameMilions.Button = GameMillionButton;
GameMilions.Init = GameMillionsInit;
GameMilions.End = GameMillionsEnd;

export { GameMilions };
