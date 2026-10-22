import { useEffect, useReducer, useRef } from 'react';

import { useCanAnimate, useDeferredResult } from '@/hooks';

import { GameMoneytButton } from './game-money-button';
import { GameMoneyActivityProvider } from './game-money-context';
import { GameMoneyInit } from './game-money-init';
import { GameMoneyLevel } from './game-money-level';
import { GameMoneyRadio } from './game-money-radio';
import { moneyConfetti, warmMoneyConfetti } from './lib/money-confetti';

import type { InitialState, Option } from './types/types';
import { States } from './types/types';

// Estado inicial de la actividad
const INITIAL_STATE: InitialState = {
  validation: false,
  button: true,
  result: false,
  options: [],
  attempts: 0,
  finished: false
};

// Lo que tarda el banquero en celebrar (salto y lluvia de monedas) o negar con la cabeza antes de entregar el resultado (ms)
const DELIVER_MS = { success: 1500, wrong: 850 } as const;

interface Props {
  children: JSX.Element | JSX.Element[];
  onResult?: ({ result, options }: { result: boolean; options: Option[] }) => void;
  minSelected?: number;
  /** Espera (ms) entre comprobar y `onResult`. Por defecto lo que dura la reacción del banquero; sin animaciones es inmediato. */
  resultDelayMs?: number;
}

type SubComponents = {
  Button: typeof GameMoneytButton;
  Radio: typeof GameMoneyRadio;
  Level: typeof GameMoneyLevel;
  /** Pantalla de inicio: no necesita el contexto del juego, va en la sección anterior del panel. */
  Init: typeof GameMoneyInit;
};

const GameMoney: React.FC<Props> & SubComponents = ({ children, onResult, minSelected = 1, resultDelayMs }) => {
  const [activity, updateActivity] = useReducer(
    (prev: InitialState, next: Partial<InitialState>) => ({ ...prev, ...next }),
    INITIAL_STATE
  );

  const canAnimate = useCanAnimate(); // Falso con "reducir movimiento" o "detener animaciones"
  // El resultado se entrega cuando el banquero termina de reaccionar, antes del modal del padre
  const { defer, flush } = useDeferredResult();

  const radioElementsId = useRef<string[]>([]); // Ids de los elementos radio
  const rootRef = useRef<HTMLDivElement>(null);

  // El primer confeti es el más caro: se prepara cuando el navegador está libre
  useEffect(() => {
    if (!canAnimate) return;

    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 300));
    const handle = idle(warmMoneyConfetti);

    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
    };
  }, [canAnimate]);

  /**
   * Añade una opción seleccionada al estado de la actividad.
   * Filtra las opciones anteriores por nombre y agrega la nueva opción seleccionada.
   * @param {Option} option - El objeto opción que contiene id, nombre y estado.
   */
  const addSelectedOption = ({ id, name, state, label }: Option) => {
    if (activity.validation) return;

    updateActivity({
      options: [...activity.options.filter((option) => option.name !== name), { id, name, state, label }]
    });
  };

  /**
   * Añade un ID de elemento radio al estado de la actividad.
   * Si el ID no está presente en el array `radioElementsId`, lo agrega.
   * @param {string} uid - El ID del elemento radio a agregar.
   */
  const addRadioElementsId = (uid: string): void => {
    if (!radioElementsId.current.includes(uid)) {
      radioElementsId.current = [...radioElementsId.current, uid];
    }
  };

  /**
   * Maneja la validación de la actividad.
   * Verifica si todas las opciones seleccionadas son correctas y actualiza el estado con el resultado.
   * Llama a la función `onResult` con el resultado si esta disponible.
   * @returns void
   */
  const handleValidation = (): void => {
    const result = activity.options.some(({ state }) => state === States.SUCCESS);

    // Actualiza la actividad con el nuevo resultado
    updateActivity({ result: result, validation: true, button: true, attempts: activity.attempts + 1 });

    if (result && canAnimate) {
      moneyConfetti();
    }

    // Siempre después de mover el foco (ver GameMoneytButton)
    defer(
      () => {
        // Al acertar, la pantalla final entra justo cuando termina la celebración
        if (result) updateActivity({ finished: true });

        requestAnimationFrame(() => onResult?.({ result: result, options: activity.options }));
      },
      result,
      resultDelayMs ?? DELIVER_MS[result ? 'success' : 'wrong']
    );
  };

  // Las opciones vuelven a habilitarse: el foco, que estaba en un botón, pasa a la primera
  const focusFirstOption = () => {
    requestAnimationFrame(() => {
      const active = document.activeElement as HTMLElement | null;

      if (!active || active === document.body || (active as HTMLButtonElement).disabled) {
        rootRef.current
          ?.querySelector<HTMLElement>('input[type="radio"]:not(:disabled)')
          ?.focus({ preventScroll: true });
      }
    });
  };

  /**
   * Reinicia la actividad al estado inicial.
   * Resetea el estado de la actividad y el ID del elemento seleccionado.
   * @returns void
   */
  const handleReset = (): void => {
    // Si todavía hay un resultado en espera (reintento inmediato), se entrega ya: no se pierde ni llega tarde.
    flush();

    updateActivity({
      validation: false,
      result: false,
      button: true,
      options: [],
      finished: false
    });

    focusFirstOption();
  };

  /**
   * Empieza de cero desde la pantalla final: sin respuesta, sin pantalla final y con los intentos a cero.
   */
  const handleRestart = (): void => {
    flush();
    updateActivity({ ...INITIAL_STATE });
    focusFirstOption();
  };

  /**
   * Verifica si todas las opciones han sido seleccionadas y actualiza el estado de la actividad.
   */
  useEffect(() => {
    if (!activity.options.length) return;

    const MITAD = 2;
    const MIN_SELECTED = minSelected || radioElementsId.current.length / MITAD;

    if (MIN_SELECTED === activity.options.length && !activity.validation) {
      updateActivity({ button: false });
    }
  }, [activity.options, activity.validation, radioElementsId, minSelected]);

  return (
    <GameMoneyActivityProvider
      value={{
        addSelectedOption,
        handleValidation,
        addRadioElementsId,
        handleReset,
        handleRestart,
        rootRef,
        validation: activity.validation,
        button: activity.button,
        result: activity.result,
        options: activity.options,
        attempts: activity.attempts,
        finished: activity.finished
      }}
    >
      {children}
    </GameMoneyActivityProvider>
  );
};

GameMoney.Button = GameMoneytButton;
GameMoney.Radio = GameMoneyRadio;
GameMoney.Level = GameMoneyLevel;
GameMoney.Init = GameMoneyInit;

export { GameMoney };
