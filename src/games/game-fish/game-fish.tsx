import { useEffect, useReducer } from 'react';

import { useCanAnimate, useDeferredResult } from '@/hooks';

import { GameFishButton } from './game-fish-button';
import { GameFishActivityProvider } from './game-fish-context';
import { GameFishElement } from './game-fish-element';
import { GameFishInit } from './game-fish-init';
import { GameFishLevel } from './game-fish-level';

import type { InitialState, Option } from './types/types';

const INITIAL_STATE: InitialState = {
  validation: false,
  button: true,
  result: false,
  reset: false,
  options: [],
  selectedLabel: '' //
};

interface GameResult {
  result: boolean;
  options: {
    id: string;
    state: string;
    label: string;
    name: string;
  }[];
}

interface Props {
  children: React.ReactNode;
  onResult?: (data: GameResult) => void;
}

export const GameFish = ({ children, onResult }: Props) => {
  const [activity, updateActivity] = useReducer(
    (prev: InitialState, next: Partial<InitialState>) => ({ ...prev, ...next }),
    INITIAL_STATE
  );

  const canAnimate = useCanAnimate();
  const { defer, flush } = useDeferredResult();

  /**
   * Agrega una opción seleccionada a la actividad.
   * Si la actividad ya ha sido validada, no hace nada.
   * Actualiza las opciones y el label seleccionado simultáneamente.
   * @param {Option} option - La opción seleccionada que se va a agregar.
   */
  const addSelectedOption = (option: Option) => {
    if (activity.validation) return;

    // Actualizamos las opciones y el label seleccionado simultáneamente
    updateActivity({
      options: [option],
      button: false,
      selectedLabel: option.label
    });
  };

  /**
   * Maneja la validación de la actividad.
   * Verifica si todas las opciones seleccionadas son correctas y actualiza el estado con el resultado.
   * Llama a la función onResult con el objeto que contiene el resultado y las opciones jugadas.
   */
  const handleValidation = () => {
    if (activity.options.length > 0) {
      const isCorrect = activity.options.some((opt) => opt.state === 'success');
      updateActivity({ validation: true, result: isCorrect, reset: false, button: true });

      // Un instante después, para que se vea al pez subir (o escaparse) antes de la retroalimentación del padre
      defer(
        () => onResult?.({ result: isCorrect, options: activity.options }),
        isCorrect,
        canAnimate ? (isCorrect ? 2100 : 1600) : undefined
      );
    }
  };

  /**
   * Reinicia la actividad a su estado inicial.
   * Llama a la función updateActivity con el estado inicial.
   */
  const handleReset = () => {
    flush(); // Si reintenta de inmediato, el resultado pendiente no se pierde ni llega tarde
    updateActivity(INITIAL_STATE);
  };

  /**
   * Actualiza el estado de la actividad basado en las opciones seleccionadas y la validación.
   * Si las opciones no son vacias y la actividad no ha sido validada, establece la propiedad 'button' en false.
   * Si las opciones son vacias o la actividad ha sido validada, establece la propiedad 'button' en true.
   */
  useEffect(() => {
    if (activity.validation) return;

    updateActivity({
      button: activity.options.length === 0
    });
  }, [activity.options, activity.validation]);

  return (
    <GameFishActivityProvider value={{ ...activity, addSelectedOption, handleValidation, handleReset }}>
      {children}
    </GameFishActivityProvider>
  );
};

GameFish.Init = GameFishInit;
GameFish.Fish = GameFishElement;
GameFish.Button = GameFishButton;
GameFish.Level = GameFishLevel;
