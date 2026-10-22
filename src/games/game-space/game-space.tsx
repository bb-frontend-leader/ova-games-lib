import { useEffect, useReducer, useRef } from 'react';

import { useDeferredResult } from '@/hooks';

import { GameSpaceButton } from './game-space-button';
import { GameSpaceProvider } from './game-space-context';
import { GameSpaceGalaxy } from './game-space-galaxy';
import { GameSpaceInit } from './game-space-init';
import { GameSpaceRadio } from './game-space-radio';

import type { InitialState, Option } from './types/types';
import { States } from './types/types';

// Estado inicial de la actividad
const INITIAL_STATE: InitialState = Object.freeze({
  validation: false,
  button: true,
  result: false,
  options: [],
  attempts: 0,
  finished: false
});

// Lo que tarda el astronauta en celebrar (salto) o tambalearse antes de entregar el resultado (ms)
const DELIVER_MS = { success: 1300, wrong: 850 } as const;

interface Props {
  children: JSX.Element | JSX.Element[];
  /** Se entrega cuando el astronauta termina de reaccionar (inmediato si las animaciones están desactivadas). */
  onResult?: ({ result, options }: { result: boolean; options: Option[] }) => void;
  minSelected?: number; // Número mínimo de opciones que deben seleccionarse
}

type SubComponents = {
  Button: typeof GameSpaceButton;
  Galaxy: typeof GameSpaceGalaxy;
  Radio: typeof GameSpaceRadio;
  /** Pantalla de inicio: no necesita el contexto del juego, va en la sección anterior del panel. */
  Init: typeof GameSpaceInit;
};

/**
 * Componente principal para manejar actividades de selección (como cuestionarios).
 * Proporciona un contexto para gestionar el estado de la actividad y manejar la validación.
 */
const GameSpace: React.FC<Props> & SubComponents = ({ children, onResult, minSelected = 1 }) => {
  // Hook useReducer para manejar el estado de la actividad
  const [activity, updateActivity] = useReducer(
    (prev: InitialState, next: Partial<InitialState>) => ({ ...prev, ...next }),
    INITIAL_STATE
  );

  const elementsId = useRef<string[]>([]); // useRef para almacenar los IDs de los elementos
  const rootRef = useRef<HTMLDivElement>(null);
  // El resultado se entrega después de la reacción del astronauta, antes del modal del padre
  const { defer, flush } = useDeferredResult();

  /**
   * Añade un ID de elemento al estado de la actividad.
   * Si el ID no está presente en el array `elementsId`, lo agrega.
   * @param uid - El ID del elemento a agregar.
   */
  const addOptionElementsId = (uid: string): void => {
    if (!elementsId.current.includes(uid)) {
      elementsId.current = [...elementsId.current, uid];
    }
  };

  /**
   * Añade un valor de radio seleccionado al estado de la actividad.
   * Filtra las opciones anteriores por nombre y agrega la nueva opción seleccionada.
   * @param option - El objeto opción que contiene id, nombre y estado.
   */
  const addOptionValues = ({ id, name, state }: Option) => {
    if (activity.validation) return;

    updateActivity({
      options: [...activity.options.filter((option) => option.name !== name), { id, name, state }]
    });
  };

  /**
   * Maneja la validación de la actividad.
   * Verifica si todas las opciones seleccionadas son correctas y actualiza el estado con el resultado.
   */
  const handleValidation = () => {
    const result = activity.options.every(({ state }) => state === States.SUCCESS);

    updateActivity({ validation: true, button: true, result, attempts: activity.attempts + 1 });

    // Siempre después de mover el foco (ver GameSpaceButton)
    defer(
      () => {
        // Al acertar, la pantalla final entra justo cuando termina el salto del astronauta
        if (result) updateActivity({ finished: true });

        requestAnimationFrame(() => onResult?.({ result, options: activity.options }));
      },
      result,
      DELIVER_MS[result ? 'success' : 'wrong']
    );
  };

  /**
   * Reinicia la actividad al estado inicial.
   */
  const handleReset = () => {
    // Si todavía hay un resultado en espera (reintento inmediato), se entrega ya: no se pierde ni llega tarde.
    flush();
    // Los intentos siguen contando: solo se borran al empezar de nuevo
    updateActivity({ ...INITIAL_STATE, attempts: activity.attempts });
    focusFirstOption();
  };

  /**
   * Empieza de cero desde la pantalla final: sin respuesta, sin pantalla final y con los intentos a cero.
   */
  const handleRestart = () => {
    flush();
    updateActivity(INITIAL_STATE);
    focusFirstOption();
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
   * Monitorea los cambios en las opciones seleccionadas.
   * Si se alcanza el número mínimo de opciones seleccionadas, activa el botón.
   */
  useEffect(() => {
    if (!activity.options.length) return;

    const MIN_SELECTED = minSelected || Math.ceil(elementsId.current.length / 2);

    if (activity.options.length >= MIN_SELECTED && !activity.validation) {
      updateActivity({ button: false });
    }
  }, [activity.options, activity.validation, elementsId, minSelected]);

  return (
    <GameSpaceProvider
      value={{
        addOptionElementsId,
        addOptionValues,
        handleValidation,
        handleReset,
        handleRestart,
        rootRef,
        button: activity.button,
        result: activity.result,
        validation: activity.validation,
        options: activity.options,
        attempts: activity.attempts,
        finished: activity.finished
      }}
    >
      {children}
    </GameSpaceProvider>
  );
};

// Asignar los subcomponentes
GameSpace.Button = GameSpaceButton;
GameSpace.Galaxy = GameSpaceGalaxy;
GameSpace.Radio = GameSpaceRadio;
GameSpace.Init = GameSpaceInit;

export { GameSpace };
