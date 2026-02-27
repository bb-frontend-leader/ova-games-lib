import { FC, useEffect, useReducer } from 'react';

import type { InitialState, Option } from './types/types';
import { RelationConceptActivityProvider } from './relation-concept-activity-context';
import { RelationConceptButton } from './relation-concept-button';
import { RelationConceptCard } from './relation-concept-card';

const INITIAL_STATE: InitialState = {
    validation: false,
    button: true,
    result: false,
    selectedPairs: [],
    correctPairs: [],
  };

  interface Props {
    children: React.ReactElement<React.ButtonHTMLAttributes<HTMLButtonElement>>;
    onResult?: ({ result, options }: { result: boolean; options: Option[] }) => void;
    pairs: Option[];
  }

  type SubComponents = {
    Card: typeof RelationConceptCard;
    Button: typeof RelationConceptButton;
  };

  const RelationConcept: FC<Props> & SubComponents = ({ children, onResult, pairs }) => {
    // Hook useReducer para manejar el estado de la actividad
    const [activity, updateActivity] = useReducer(
        (prev: InitialState, next: Partial<InitialState>) => ({ ...prev, ...next }),
        INITIAL_STATE
    );

    /**
     * Añade un par seleccionado al estado de la actividad.
     * Si se seleccionan dos elementos, se verifica si forman un par correcto o incorrecto.
     * @param pair - El par seleccionado que contiene id, label y pair.
     */
    const addSelectedPair = (pair: { id: string; label: string; pair: number }) => {
        const newSelectedPairs = [...activity.selectedPairs, pair];
        updateActivity({ selectedPairs: newSelectedPairs });

      if (newSelectedPairs.length === 2) {
        const [first, second] = newSelectedPairs;

        if (first.pair === second.pair) {
            updateActivity({ correctPairs: [...activity.correctPairs, ...newSelectedPairs] });
        }else{
            updateActivity({ correctPairs: [...activity.correctPairs, { ...first, isIncorrect: true }, { ...second, isIncorrect: true }] });
        }

        updateActivity({ selectedPairs: [] }); // Reiniciamos los pares seleccionados
      }
    };

    /**
     * Maneja la validación de la actividad.
     * Verifica si todos los pares seleccionados son correctos y llama a la función onResult si se proporciona.
     */
    const handleValidation = () => {
      updateActivity({ validation: true, button: true });

      const correctPairsCount = activity.correctPairs.filter(pair => !pair.isIncorrect).length / 2; // Cada par correcto añade dos elementos a correctPairs
      const result = correctPairsCount === pairs.length / 2;

      if (onResult) {
          onResult({ result, options: activity.correctPairs });
      }

      updateActivity({ result });
    };

    /**
     * Reinicia la actividad al estado inicial.
     */
    const handleReset = () => {
        updateActivity(INITIAL_STATE);
    };

    /**
     * Efecto que actualiza el estado del botón de validación
     * dependiendo de si todos los pares correctos han sido seleccionados.
     */
    useEffect(() => {
        if (activity.correctPairs.length >= pairs.length && !activity.validation) {
            updateActivity({ button: false });
        }
    }, [activity.correctPairs, activity.validation, pairs.length]);

    return (
    <RelationConceptActivityProvider
        value={{
            handleValidation,
            handleReset,
            addSelectedPair,
            selectedPairs: activity.selectedPairs,
            validation: activity.validation,
            button: activity.button,
            result: activity.result,
            correctPairs: activity.correctPairs,
            pairs
        }}>
        {children}
    </RelationConceptActivityProvider>);
  };

RelationConcept.Card = RelationConceptCard;
RelationConcept.Button = RelationConceptButton;

export { RelationConcept };