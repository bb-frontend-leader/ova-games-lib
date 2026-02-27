import { useEffect, useReducer, useRef } from 'react';

import { useA11yAttribute, useReduceMotion } from '@/shared/core/hooks';

// import { moneyConfetti } from './lib/money-confetti';
import { InitialState, Option, States } from './types/types';
import { GameMoneytButton } from './game-money-button';
import { GameMoneyActivityProvider } from './game-money-context';
import { GameMoneyLevel } from './game-money-level';
import { GameMoneyRadio } from './game-money-radio';

// Estado inicial de la actividad
const INITIAL_STATE: InitialState = {
  validation: false,
  button: true,
  result: false,
  options: []
};

interface Props {
  children: React.ReactNode;
  onResult?: ({ result, options }: { result: boolean; options: Option[] }) => void;
  minSelected?: number;
  resultDelayMs?: number;
}

type SubComponents = {
  Button: typeof GameMoneytButton;
  Radio: typeof GameMoneyRadio;
  Level: typeof GameMoneyLevel;
};

const GameMoney: React.FC<Props> & SubComponents = ({ children, onResult, minSelected = 1, resultDelayMs = 900 }) => {
  const [activity, updateActivity] = useReducer(
    (prev: InitialState, next: Partial<InitialState>) => ({ ...prev, ...next }),
    INITIAL_STATE
  );

  const cancelAnimation = useReduceMotion();
  const { stopAnimations } = useA11yAttribute();

  const radioElementsId = useRef<string[]>([]); // Ids de los elementos radio
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  /**
   * Añade una opción seleccionada al estado de la actividad.
   * Filtra las opciones anteriores por nombre y agrega la nueva opción seleccionada.
   * @param {Option} option - El objeto opción que contiene id, nombre y estado.
   */
  const addSelectedOption = ({ id, name, state }: Option) => {
    updateActivity({
      options: [...activity.options.filter((option) => option.name !== name), { id, name, state }]
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
    updateActivity({ result: result, validation: true, button: true });

    if (result && !cancelAnimation && !stopAnimations) {
      // moneyConfetti();
      return;
    }

    timeoutRef.current = window.setTimeout(() => {
      onResult?.({ result: result, options: activity.options });
    }, resultDelayMs);
  };

  /**
   * Reinicia la actividad al estado inicial.
   * Resetea el estado de la actividad y el ID del elemento seleccionado.
   * @returns void
   */
  const handleReset = (): void => {
    // ✅ cancela modal pendiente
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);

    updateActivity({
      validation: false,
      result: false,
      button: true,
      options: []
    });
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
        validation: activity.validation,
        button: activity.button,
        result: activity.result,
        options: activity.options
      }}>
      {children}
    </GameMoneyActivityProvider>
  );
};

GameMoney.Button = GameMoneytButton;
GameMoney.Radio = GameMoneyRadio;
GameMoney.Level = GameMoneyLevel;

export { GameMoney };
