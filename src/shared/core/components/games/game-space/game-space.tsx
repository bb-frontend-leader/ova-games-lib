import { useEffect, useReducer, useRef } from 'react';

import type { InitialState, Option } from './types/types';
import { States } from './types/types';
import { GameSpaceButton } from './game-space-button';
import { GameSpaceProvider } from './game-space-context';
import { GameSpaceGalaxy } from './game-space-galaxy';
import { GameSpaceRadio } from './game-space-radio';

// Estado inicial de la actividad
const INITIAL_STATE: InitialState = Object.freeze({
  validation: false,
  button: true,
  result: false,
  options: [],
});

interface Props {
  children: React.ReactNode;
  onResult?: ({ result, options }: { result: boolean; options: Option[] }) => void;
  minSelected?: number; // Número mínimo de opciones que deben seleccionarse
}

type SubComponents = {
  Button: typeof GameSpaceButton;
  Galaxy: typeof GameSpaceGalaxy;
  Radio: typeof GameSpaceRadio;
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
    updateActivity({
      options: [...activity.options.filter((option) => option.name !== name), { id, name, state }]
    });
  };

  /**
   * Maneja la validación de la actividad.
   * Verifica si todas las opciones seleccionadas son correctas y actualiza el estado con el resultado.
   */
  const handleValidation = () => {
    updateActivity({ validation: true, button: true });

    const result = activity.options.every(({ state }) => state === States.SUCCESS);

    if (onResult) {
      onResult({ result, options: activity.options });
    }

    updateActivity({ result });
  };

  /**
   * Reinicia la actividad al estado inicial.
   * Resetea el estado de la actividad y el ID del elemento seleccionado.
   */
  const handleReset = () => {
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
        button: activity.button,
        result: activity.result,
        validation: activity.validation,
        options: activity.options
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

export { GameSpace };