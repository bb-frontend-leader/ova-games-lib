import { useCallback, useEffect, useReducer, useRef } from 'react';

import { useDeferredResult } from '@/hooks';

import { GameBalloonsButton } from './game-balloons-button';
import { GameBalloonsProvider } from './game-balloons-context';
import { GameBalloonsLevel } from './game-balloons-level';

import type { InitialState, TypeWord } from './types/types';

const INITIAL_STATE = Object.freeze({
  validation: false,
  button: true,
  result: false,
  option: { word: [], sentence: '' },
  reset: false,
  userAnswer: ''
});

interface Props {
  children: JSX.Element | JSX.Element[];
  onResult?: ({ result, options }: { result: boolean; options: TypeWord[] }) => void;
}

type SubComponents = {
  Button: typeof GameBalloonsButton;
  Level: typeof GameBalloonsLevel;
};

/**
 * Normaliza un texto para comparación
 * @param s - cadena a normalizar
 * @returns cadena normalizada
 */
function normalizeSentence(s: string) {
  return s
    .toLowerCase()
    .replace(/[.,;:!?¿¡]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

const GameBalloons: React.FC<Props> & SubComponents = ({ children, onResult }) => {
  const [activity, updateActivity] = useReducer(
    (prev: InitialState, next: Partial<InitialState>) => ({ ...prev, ...next }),
    INITIAL_STATE
  );

  // El resultado se entrega tras el temblor (error) o la celebración (acierto) para que se vean antes del modal del padre
  const { defer, flush } = useDeferredResult();

  // Acumular opciones jugadas (si necesitas devolver historial)
  const playedOptionsRef = useRef<TypeWord[]>([]);

  /**
   * Registra una opción de juego en el historial y actualiza la opción activa.
   *
   * @param option - opción del juego (palabras y frase).
   *
   * Efectos:
   * - agrega a playedOptionsRef.current
   * - actualiza activity.option con la opción actual
   */
  const addBallonsValues = useCallback((option: TypeWord) => {
    playedOptionsRef.current = [...playedOptionsRef.current, option];

    updateActivity({
      option
    });
  }, []);

  /**
   * Actualiza la respuesta del usuario en el estado global.
   * Normalmente se llama desde Level, cada vez que el usuario arma/modifica la frase.
   *
   * @param answer - respuesta parcial o final.
   */
  const setUserAnswer = useCallback((answer: string) => {
    updateActivity({ userAnswer: answer });
  }, []);

  /**
   * Valida la respuesta del usuario:
   * - Obtiene el "expected" desde:
   *    - activity.option.sentence si existe y no está vacío
   *    - si no, usa activity.option.word.join(' ')
   * - Normaliza expected y got (userAnswer)
   * - Compara igualdad estricta
   * Luego dispara onResult con el historial de opciones jugadas.
   */
  const handleValidation = (): void => {
    const expectedRaw = activity.option.sentence?.trim() ? activity.option.sentence : activity.option.word.join(' ');

    const expected = normalizeSentence(expectedRaw);
    const got = normalizeSentence(activity.userAnswer);

    const isCorrect = expected === got;

    updateActivity({
      validation: true,
      result: isCorrect,
      reset: false,
      button: true
    });

    const payload = { result: isCorrect, options: playedOptionsRef.current };

    if (onResult) defer(() => onResult(payload), isCorrect);
  };

  /**
   * Reinicia el estado para reintentar el nivel actual.
   */
  const handleReset = (): void => {
    // Si todavía hay un resultado en espera (reintento inmediato), se entrega ya: no se pierde ni llega tarde.
    flush();

    updateActivity({
      validation: false,
      result: false,
      button: true,
      reset: true,
      userAnswer: ''
    });
  };

  /**
   * Efecto que controla el estado del botón "Validar".
   * Habilita el botón cuando el usuario ha llenado
   * todas las palabras requeridas en la respuesta.
   */
  useEffect(() => {
    if (activity.validation) return;

    const required = activity.option.word.length;
    const count = activity.userAnswer.trim() ? activity.userAnswer.trim().split(/\s+/).length : 0;

    const filled = count >= required;

    const nextButton = filled ? false : true;

    if (activity.button !== nextButton) {
      updateActivity({ button: nextButton });
    }
  }, [activity.userAnswer, activity.option.word.length, activity.validation, activity.button]);

  return (
    <GameBalloonsProvider
      value={{
        addBallonsValues,
        setUserAnswer,
        handleValidation,
        handleReset,
        button: activity.button,
        validation: activity.validation,
        result: activity.result,
        reset: activity.reset,
        option: activity.option
      }}
    >
      {children}
    </GameBalloonsProvider>
  );
};

GameBalloons.Button = GameBalloonsButton;
GameBalloons.Level = GameBalloonsLevel;

export { GameBalloons };
