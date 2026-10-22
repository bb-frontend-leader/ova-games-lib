import type { FC } from 'react';
import { useEffect, useReducer, useRef } from 'react';

import { useCanAnimate, useDeferredResult } from '@/hooks';

import { GameLegoProvider } from './game-lego-context';
import { LegoButton } from './lego-button';
import { LegoInit } from './lego-init';
import { LegoQuestion } from './lego-question';
import { LegoRadio } from './lego-radio';

import type { InitialState, Option } from './types/types';
import { States } from './types/types';

// Estado inicial de la actividad
const INITIAL_STATE: InitialState = {
  validation: false,
  button: true,
  result: false,
  options: []
};

interface Props {
  children: JSX.Element | JSX.Element[];
  onResult?: ({ result, options }: { result: boolean; options: Option[] }) => void;
  minSelected?: number; // Número mínimo de opciones que deben seleccionarse
}

type SubComponents = {
  Init: typeof LegoInit;
  Button: typeof LegoButton;
  Option: typeof LegoRadio;
  Question: typeof LegoQuestion;
};

// Componente principal GameLego
const GameLego: FC<Props> & SubComponents = ({ children, onResult, minSelected = 1 }) => {
  // Combina el estado inicial con las preguntas pasadas como props
  const [activity, updateActivity] = useReducer(
    (prev: InitialState, next: Partial<InitialState>) => ({ ...prev, ...next }),
    INITIAL_STATE
  );

  const elementsId = useRef<string[]>([]); // useRef para almacenar los IDs de los elementos
  const resetRequested = useRef(false); // El foco solo vuelve a la primera pieza si el usuario reintentó

  const canAnimate = useCanAnimate();
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
   * @param option - La opción elegida: id, nombre, estado y, para dibujar su pieza, texto y color.
   */
  const addOptionValues = (selected: Option) => {
    updateActivity({
      options: [...activity.options.filter((option) => option.name !== selected.name), selected]
    });
  };

  /**
   * Maneja la validación de la actividad.
   * Verifica si todas las opciones seleccionadas son correctas y actualiza el estado con el resultado.
   */
  const handleValidation = () => {
    const result = activity.options.every(({ state }) => state === States.SUCCESS);

    updateActivity({ validation: true, button: true, result });

    // Un instante después, para que se vea cómo encaja (o no) la pieza antes de la retroalimentación del padre
    defer(() => onResult?.({ result, options: activity.options }), result, canAnimate && result ? 1300 : undefined);
  };

  /**
   * Reinicia la actividad al estado inicial.
   * Resetea el estado de la actividad y el ID del elemento seleccionado.
   */
  const handleReset = () => {
    flush(); // Si reintenta de inmediato, el resultado pendiente no se pierde ni llega tarde
    resetRequested.current = true;
    activity.options.forEach(({ id }) => {
      // Busca el elemento del DOM correspondiente al nombre de opción y tipo de input 'radio'
      const element = document.querySelector(`input[type='radio'][id='${id}']`) as HTMLInputElement;

      if (element) {
        // Si se encuentra el elemento, establece su propiedad 'checked' en false para deseleccionarlo
        element.checked = false;
      }
    });
    updateActivity(INITIAL_STATE);
  };

  // Tras reintentar, el foco vuelve a la primera pieza (el botón «Reintentar» queda desactivado)
  useEffect(() => {
    if (activity.validation || !resetRequested.current) return;

    resetRequested.current = false;
    document.getElementById(elementsId.current[0])?.focus({ preventScroll: true });
  }, [activity.validation]);

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
    <GameLegoProvider
      value={{
        addOptionElementsId,
        addOptionValues,
        handleValidation,
        handleReset,
        button: activity.button,
        result: activity.result,
        validation: activity.validation,
        options: activity.options
      }}
    >
      {children}
    </GameLegoProvider>
  );
};

GameLego.Init = LegoInit;
GameLego.Button = LegoButton;
GameLego.Option = LegoRadio;
GameLego.Question = LegoQuestion;

export { GameLego };
