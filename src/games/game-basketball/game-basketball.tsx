import { useEffect, useReducer, useRef } from 'react';
import gsap from 'gsap';

import { SOUNDS } from '@/constants';
import { burst, centerIn, flyChip, ring } from '@/games/lib/fx';
import { useCanAnimate, useDeferredResult, usePlaySound } from '@/hooks';
import { useGSAP } from '@gsap/react';

import { GameBasketballRadio } from './game-backetball-radio';
import { GameBasketballButton } from './game-basketball-button';
import { RadioBasketActivityProvider } from './game-basketball-context';
import { GameBasketballInit } from './game-basketball-init';
import { GameBasketballLevel } from './game-basketball-level';
import { BALL } from './lib/constant';
import { pointsFor } from './lib/score';

import type { GameResult, InitialState, Option } from './types/types';
import { States } from './types/types';

import css from './game-basketball.module.css';

const INITIAL_STATE: InitialState = {
  validation: false,
  button: true,
  result: false,
  options: [],
  score: 0,
  streak: 0,
  bestStreak: 0,
  gained: 0,
  made: 0,
  missed: 0,
  landed: true,
  revealed: true,
  finished: false
};

const CONFETTI = ['#ffb627', '#ffffff', '#e8591a', '#ffd98a'] as const;
const DUST = ['#7a3a12', '#c4661f', '#f3c98a', '#3a1d0a'] as const;
const SHARD_SHAPES = [
  'circle(50%)',
  'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)',
  'polygon(50% 0, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
];

// Lo que tarda el balón en llegar al aro y, después, en entrar o rebotar (s)
const FLIGHT_UP_S = 0.44;
const FLIGHT_DOWN_S = 0.2;
const FLIGHT_S = FLIGHT_UP_S + FLIGHT_DOWN_S;
// Cuándo se entrega el resultado al padre (ms): después de que el puntaje llega al marcador o el balón rebota
const DELIVER_MS = { success: 1250, wrong: 1000 } as const;

interface Props {
  children: JSX.Element | JSX.Element[];
  onResult?: (data: GameResult) => void;
  /** Espera (ms) entre el tiro y `onResult`. Por defecto lo que dura la animación del tiro; sin animaciones es inmediato. */
  resultDelayMs?: number;
}

type SubComponents = {
  Radio: typeof GameBasketballRadio;
  Button: typeof GameBasketballButton;
  Provider: typeof GameBasketballLevel;
  Init: typeof GameBasketballInit;
  /** @deprecated Usa `Init` */
  init: typeof GameBasketballInit;
};

const GameBasketball: React.FC<Props> & SubComponents = ({ children, onResult, resultDelayMs }) => {
  const [activity, updateActivity] = useReducer(
    (prev: InitialState, next: Partial<InitialState>) => ({ ...prev, ...next }),
    INITIAL_STATE
  );

  const levelRef = useRef<HTMLDivElement>(null);
  const fxRef = useRef<HTMLDivElement>(null);
  const playSound = usePlaySound();
  const canAnimate = useCanAnimate();
  // El resultado se entrega cuando el balón ya entró (o rebotó), antes del modal del padre
  const { defer, flush } = useDeferredResult();
  const { contextSafe } = useGSAP({ scope: levelRef });

  // Referencia mutable para almacenar los uid de cada componente <RadioElement/>
  const radioElementsId = useRef<string[]>([]);

  const query = <T extends HTMLElement>(selector: string) => levelRef.current?.querySelector<T>(selector) ?? null;

  /**
   * Mueve el foco en el siguiente frame, cuando React ya aplicó el cambio de estado, solo si el foco se perdió.
   */
  const focusSoon = (find: () => Element | null | undefined) => {
    requestAnimationFrame(() => {
      const active = document.activeElement as HTMLElement | null;
      const lost = !active || active === document.body || (active as HTMLButtonElement).disabled;

      if (lost) (find() as HTMLElement | null | undefined)?.focus({ preventScroll: true });
    });
  };

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
   * Agrega un valor de radio seleccionado al estado de la actividad.
   * Filtra las opciones anteriores por id y agrega la nueva opción seleccionada.
   * @param {Option} option - El objeto opción que contiene id, nombre y estado.
   */
  const addRadiosValues = ({ id, name, state, letter }: Option) => {
    if (activity.validation) return;

    updateActivity({
      options: [...activity.options.filter((option) => option.name !== name), { id, name, state, letter }]
    });
  };

  /**
   * El tiro (solo con movimiento permitido): el balón sale del piso, dibuja un arco hasta el aro elegido y
   * entra por la red (los puntos viajan al marcador) o rebota en el aro y sale. Devuelve true si empezó la animación.
   */
  const shoot = contextSafe((id: string, made: boolean, gained: number) => {
    const fx = fxRef.current;
    const hoop = query(`[data-hoop="${CSS.escape(id)}"]`);
    const launch = query('[data-launch]');
    const scoreEl = query('[data-score]');

    if (!canAnimate || !fx || !hoop || !launch || !scoreEl) return false;

    const layerRect = fx.getBoundingClientRect();
    const hoopRect = hoop.getBoundingClientRect();
    const scoreRect = scoreEl.getBoundingClientRect();
    const start = centerIn(launch.getBoundingClientRect(), layerRect);
    // El aro está a media altura de la imagen (tablero arriba, red abajo)
    const rim = centerIn(hoopRect, layerRect);

    const ball = document.createElement('img');
    ball.src = BALL.replace(/\s/g, '');
    ball.alt = '';
    ball.className = css.shot;
    fx.appendChild(ball);

    gsap.set(ball, { x: start.x, y: start.y, xPercent: -50, yPercent: -50, scale: 1.15, rotation: 0 });
    playSound(SOUNDS.WHOOSH);

    const tl = gsap.timeline({ onComplete: () => ball.remove() });

    // Arco: sube más arriba del aro y cae sobre él; mientras, avanza hacia un lado y se achica con la distancia
    tl.to(ball, { x: rim.x, duration: FLIGHT_S, ease: 'power1.inOut' }, 0)
      .to(ball, { y: rim.y - 70, duration: FLIGHT_UP_S, ease: 'power2.out' }, 0)
      .to(ball, { y: rim.y, duration: FLIGHT_DOWN_S, ease: 'power2.in' }, FLIGHT_UP_S)
      .to(ball, { rotation: 520, scale: 0.72, duration: FLIGHT_S, ease: 'none' }, 0);

    // Al tocar el aro se revela si fue canasta
    tl.call(() => updateActivity({ revealed: true }), [], FLIGHT_S);

    if (made) {
      tl.call(
        () => {
          playSound(SOUNDS.POP);
          ring(fx, rim, css.ring, '#ffffff');
          burst(fx, rim, {
            className: css.shard,
            colors: CONFETTI,
            shapes: SHARD_SHAPES,
            count: 16,
            reach: [70, 160],
            size: [7, 14]
          });
          // La red se mece con el balón dentro
          gsap.fromTo(hoop, { rotation: -2.5 }, { rotation: 0, duration: 0.7, ease: 'elastic.out(1.2, 0.3)' });

          // Los puntos salen del aro y viajan al marcador
          flyChip(
            fx,
            layerRect,
            new DOMRect(hoopRect.left + hoopRect.width / 2 - 26, hoopRect.top + hoopRect.height / 2 - 26, 52, 52),
            new DOMRect(scoreRect.left + scoreRect.width / 2, scoreRect.top + scoreRect.height / 2, 0, 0),
            `+${gained}`,
            css.flyer,
            contextSafe(() => {
              playSound(SOUNDS.UNLOCK);
              gsap.fromTo(scoreEl, { scale: 1.25 }, { scale: 1, duration: 0.55, ease: 'back.out(3)' });
              updateActivity({ landed: true });
            })
          );
        },
        [],
        FLIGHT_S
      )
        // Atraviesa la red y se pierde de vista
        .to(ball, { y: rim.y + 72, duration: 0.3, ease: 'power1.in' }, FLIGHT_S)
        .to(ball, { opacity: 0, duration: 0.14 }, FLIGHT_S + 0.16);
    } else {
      // Rebota hacia el centro de la cancha, lejos del aro, y cae
      const away = rim.x > layerRect.width / 2 ? -1 : 1;

      tl.call(
        () => {
          playSound(SOUNDS.DROP);
          gsap.fromTo(hoop, { x: 7 }, { x: 0, duration: 0.55, ease: 'elastic.out(1.5, 0.25)' });
          burst(fx, rim, {
            className: css.shard,
            colors: DUST,
            count: 9,
            reach: [30, 75],
            size: [6, 12],
            gravity: 22
          });
        },
        [],
        FLIGHT_S
      )
        .to(ball, { x: rim.x + away * 64, duration: 0.55, ease: 'none' }, FLIGHT_S)
        .to(ball, { y: rim.y - 46, duration: 0.2, ease: 'power2.out' }, FLIGHT_S)
        .to(ball, { y: start.y + 24, duration: 0.36, ease: 'power2.in' }, FLIGHT_S + 0.2)
        .to(ball, { rotation: `+=${away * 340}`, scale: 1, duration: 0.55, ease: 'none' }, FLIGHT_S)
        .to(ball, { opacity: 0, duration: 0.16 }, FLIGHT_S + 0.4);
    }

    return true;
  });

  /**
   * Se usa para la validación de toda la actividad,
   * está se encarga de comprobrar que el número de opciones
   * seleccionadas se igual al total de las correctas.
   */
  const handleValidation = () => {
    const selected = activity.options[0];
    if (!selected) return;

    const result = activity.options.every(({ state }) => state === States.SUCCESS);
    const gained = result ? pointsFor(activity.streak) : 0;
    const streak = result ? activity.streak + 1 : 0;
    const score = activity.score + gained;
    const made = activity.made + (result ? 1 : 0);
    const missed = activity.missed + (result ? 0 : 1);
    // Hay que leer dónde está todo antes de que React cambie la cancha
    const animated = shoot(selected.id, result, gained);

    updateActivity({
      result,
      validation: true,
      button: true,
      score,
      streak,
      bestStreak: Math.max(activity.bestStreak, streak),
      gained,
      made,
      missed,
      landed: !animated || !result,
      revealed: !animated
    });

    // Se entrega al final del tiro. Siempre después de mover el foco (ver GameBasketballButton).
    defer(
      () => {
        requestAnimationFrame(() => {
          onResult?.({ result, options: activity.options, score, gained, streak, made, missed });
        });
      },
      result,
      resultDelayMs ?? (animated ? DELIVER_MS[result ? 'success' : 'wrong'] : undefined)
    );
  };

  /**
   * Nuevo tiro: se conservan los puntos, la racha y las canastas del partido.
   */
  const handleReset = () => {
    // Si todavía hay un resultado en espera (reintento inmediato), se entrega ya: no se pierde ni llega tarde.
    flush();

    updateActivity({
      validation: false,
      button: true,
      result: false,
      options: [],
      gained: 0,
      landed: true,
      revealed: true
    });
    focusSoon(() => query('input[type="radio"]:not(:disabled)'));
  };

  const openFinal = () => {
    flush();
    updateActivity({ finished: true });
  };

  /**
   * Monitorea los cambios en las opciones seleccionadas.
   * Si hay opciones seleccionadas y la actividad no ha sido validada, activa el botón.
   * @returns void
   */
  useEffect(() => {
    if (!activity.options.length) return;

    if (!activity.validation) {
      updateActivity({ button: false });
    }
  }, [activity.options, activity.validation]);

  return (
    <RadioBasketActivityProvider
      value={{
        ...activity,
        canAnimate,
        levelRef,
        fxRef,
        addRadiosValues,
        handleValidation,
        addRadioElementsId,
        handleReset,
        openFinal
      }}
    >
      {children}
    </RadioBasketActivityProvider>
  );
};

GameBasketball.Radio = GameBasketballRadio;
GameBasketball.Button = GameBasketballButton;
GameBasketball.Provider = GameBasketballLevel;
GameBasketball.Init = GameBasketballInit;
GameBasketball.init = GameBasketballInit; // Alias antiguo

export { GameBasketball };
