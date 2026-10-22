import React, { useReducer } from 'react';
import type { DragAndDropProps } from 'books-ui';
import { DragAndDrop } from 'books-ui';

import { SOUNDS } from '@/constants';
import { usePlaySound } from '@/hooks';

import { DndButton } from './dnd-buttons';
import { DndActivityProvider } from './dnd-context';
import { DndPhrase } from './dnd-phrase';
import { INITIAL_STATE } from './lib/constant';

import type { InitialState } from './types/types';

import css from './dnd.module.css';

/**
 * `validate` y `onValidate` los controla la actividad (botón Comprobar y conteo
 * de aciertos), por eso no se reciben desde fuera.
 */
interface Props extends Omit<DragAndDropProps, 'validate' | 'onValidate'> {
  onResult?: ({ result }: { result: boolean }) => void;
  minCorrectDrags: number;
}

type SubComponents = {
  Button: typeof DndButton;
  Phrase: typeof DndPhrase;
};

const DndActivity: React.FC<Props> & SubComponents = ({ id, children, minCorrectDrags, onResult, ...props }) => {
  const [activity, updatedActivity] = useReducer(
    (prev: InitialState, next: Partial<InitialState>) => ({ ...prev, ...next }),
    INITIAL_STATE
  );
  const playSound = usePlaySound();

  /**
   * Función que se encarga de validar
   * el valor proporcionado por el componente DragAndDrop.
   * `active` es true en cada suelta y false al reiniciar el DragAndDrop.
   *
   * @param {string[]} value - ID del drag
   */
  const handleNewDrag = ({ validate: drags, active }: { validate: string[]; active: boolean }) => {
    if (active) playSound(SOUNDS.DROP);

    const newListDrags = [...drags];
    const TOTAL_DRAGS_TO_THROW_CORRECT_MODAL = minCorrectDrags;

    if (active && activity.button) {
      updatedActivity({ button: !activity.button });
    }

    updatedActivity({
      result: newListDrags.length === TOTAL_DRAGS_TO_THROW_CORRECT_MODAL
    });
  };

  /**
   * Valida la actividad actual y, si es necesario,
   * llama a la función `onResult` con el resultado.
   */
  const handleValidation = () => {
    const newActivityState = {
      validation: !activity.validation,
      button: !activity.button
    };

    if (onResult) {
      onResult({ result: activity.result });
    }

    if (!activity.result) {
      newActivityState.button = !activity.button;
    }

    // Actualiza la actividad con el nuevo resultado
    updatedActivity(newActivityState);
  };

  /**
   * Reinicia la actividad a su estado inicial.
   */
  const handleReset = () => {
    updatedActivity(INITIAL_STATE);
  };

  return (
    <DndActivityProvider value={{ handleValidation, handleReset, ...activity }}>
      <DragAndDrop id={id} validate={activity.validation} onValidate={handleNewDrag} {...props}>
        <div className={css['wrapper']}>{children}</div>
      </DragAndDrop>
    </DndActivityProvider>
  );
};

DndActivity.Button = DndButton;
DndActivity.Phrase = DndPhrase;

export { DndActivity };
