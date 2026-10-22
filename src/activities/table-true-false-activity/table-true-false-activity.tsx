import { useEffect, useReducer } from 'react';

import { TableTrueFalseButton } from './table-true-false-button';
import { TableTrueFalseProvider } from './table-true-false-context';
import { Feedback } from './table-true-false-feedback';
import { TrueFalseOption } from './true-false-option';

import type { InitialState, Option } from './types/types';

// Estado inicial de la actividad
const INITIAL_STATE = Object.freeze({
  validation: false,
  button: true,
  result: false,
  options: [],
  selectedIds: {},
  correctCount: 0
});

interface Props {
  children: React.ReactNode;
  onResult?: ({ result, options }: { result: boolean; options: Option[]; correctCount: number }) => void;
  options: Option[];
}

type SubComponents = {
  Button: typeof TableTrueFalseButton;
  Option: typeof TrueFalseOption;
  Feedback: typeof Feedback;
};

// Componente principal GameSpace
const TableTrueFalseActivity: React.FC<Props> & SubComponents = ({ children, onResult, options }) => {
  // Reducer para manejar el estado de la actividad
  const reducer = (state: InitialState, action: Partial<InitialState>): InitialState => {
    return { ...state, ...action };
  };

  // Hook useReducer para manejar el estado de la actividad
  const [activity, updateActivity] = useReducer(reducer, { ...INITIAL_STATE, options });

  /**
   * Agrega o actualiza los valores de una opción seleccionada.
   * @param {OptionType} option - Opción a actualizar.
   */
  const addOptionValues = (id: string, answer: boolean) => {
    updateActivity({
      selectedIds: { ...activity.selectedIds, [id]: answer },
      button: false
    });
  };

  /**
   * Maneja la validación de la opción seleccionada.
   */
  const handleValidation = () => {
    const correctCount = activity.options.filter((opt) => activity.selectedIds[opt.id] === opt.correct).length;

    const areAllCorrect = correctCount === activity.options.length;

    updateActivity({ validation: true, result: areAllCorrect, button: true });

    if (onResult) {
      onResult({ result: areAllCorrect, options: activity.options, correctCount });
    }
  };

  /**
   * Busca el resultado de la opción seleccionada por el usuario.
   */
  const searchOptionResultById = (id: string) => {
    const currentOption = activity.options.find((opt) => id === opt.id)?.correct;
    return activity.selectedIds[id] === currentOption;
  };

  /**
   * Maneja el reinicio del estado de la actividad.
   */
  const handleReset = () => {
    updateActivity({ ...INITIAL_STATE, options });
  };

  useEffect(() => {
    if (Object.keys(activity.selectedIds).length > 0 && !activity.validation) {
      updateActivity({ button: false });
    }
  }, [activity.selectedIds, activity.validation]);

  return (
    <TableTrueFalseProvider
      value={{
        ...activity,
        addOptionValues,
        handleValidation,
        searchOptionResultById,
        handleReset
      }}
    >
      {children}
    </TableTrueFalseProvider>
  );
};

TableTrueFalseActivity.Button = TableTrueFalseButton;
TableTrueFalseActivity.Option = TrueFalseOption;
TableTrueFalseActivity.Feedback = Feedback;

export { TableTrueFalseActivity };
