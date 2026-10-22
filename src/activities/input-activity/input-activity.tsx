import { useCallback, useReducer } from 'react';

import { InputActivityProvider } from './input-activity-context';
import { InputButton } from './input-button';
import { InputElement } from './input-element';
import { isCorrectAnswer } from './lib/answer';
import { INITIAL_STATE, inputReducer } from './lib/reducer';

import type { Input } from './type/types';

interface Props {
  children: React.ReactNode;
  onResult?: ({ result, inputs }: { result: boolean; inputs: Input[] }) => void;
}

type SubComponents = {
  Button: typeof InputButton;
  Input: typeof InputElement;
};

const Inputs: React.FC<Props> & SubComponents = ({ children, onResult }) => {
  const [{ validation, result, inputs }, dispatch] = useReducer(inputReducer, INITIAL_STATE);

  // Los campos usan estas funciones dentro de efectos: se mantienen estables para no volver a ejecutarlos.
  const registerInput = useCallback((input: Omit<Input, 'userAnswer'>) => dispatch({ type: 'register', input }), []);
  const unregisterInput = useCallback((id: string) => dispatch({ type: 'unregister', id }), []);
  const changeInput = useCallback((id: string, userAnswer: string) => dispatch({ type: 'change', id, userAnswer }), []);

  /**
   * Comprobar se habilita cuando hay campos y ninguno está vacío
   * (una respuesta de solo espacios cuenta como vacía).
   */
  const canValidate = !validation && inputs.length > 0 && inputs.every(({ userAnswer }) => userAnswer.trim() !== '');

  // Reintentar solo se ofrece después de comprobar con algún error.
  const canReset = validation && !result;

  /**
   * Valida toda la actividad: es correcta cuando cada campo
   * coincide con alguna de sus respuestas correctas.
   */
  const handleValidation = () => {
    if (!canValidate) return;

    const allCorrect = inputs.every((input) => isCorrectAnswer(input.userAnswer, input.correctAnswer));

    if (onResult) {
      onResult({ result: allCorrect, inputs });
    }

    dispatch({ type: 'validate', result: allCorrect });
  };

  /**
   * Reinicia la actividad a su estado inicial: limpia las respuestas de los campos.
   */
  const handleReset = () => dispatch({ type: 'reset' });

  return (
    <InputActivityProvider
      value={{
        inputs,
        validation,
        canValidate,
        canReset,
        registerInput,
        unregisterInput,
        changeInput,
        handleValidation,
        handleReset
      }}
    >
      {children}
    </InputActivityProvider>
  );
};

Inputs.Button = InputButton;
Inputs.Input = InputElement;

export { Inputs };
