import { useEffect, useId, useMemo } from 'react';

import { RadioStates } from './types/types';
import { useGameQuestionContext } from './game-question-context';

import css from './game-question.module.css';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  addClass?: string;
  label: string;
  state: RadioStates;
}

export const GameQuestionRadio: React.FC<Props> = ({ id, addClass, state, label, name, ...props }) => {
  const reactId = useId();

  const { addRadiosValues, addElementsId, validation, options } = useGameQuestionContext();

  const uid = id || reactId;
  const radioName = `radio-group-question-${name}`;

  // ✅ seleccionado sale del CONTEXTO
  const isSelected = useMemo(() => {
    return options?.some((opt) => opt.name === radioName && opt.id === uid);
  }, [options, radioName, uid]);

  /**
   * Maneja el evento onChange.
   */
  const handleChange = () => {
    addRadiosValues({ id: uid, name: radioName, state });
  };

  /**
   * Maneja el evento onChange.
   */
  useEffect(() => {
    addElementsId(uid);
  }, [uid, addElementsId]);

  /**
   * Devuelve una cadena con las clases CSS para un elemento radio
   * dependiendo de si está seleccionado, si es valido o no, y si es correcto o no.
   * @param inputId - ID del input
   * @param state - Estado del input
   * @returns
   */
  const getLabelClass = (state: 'success' | 'wrong') => {
    if (!validation || !isSelected) return css.button;
    return `${css.button} ${state === 'success' ? css.success : css.wrong}`;
  };

  return (
    <div className={`${validation ? css.disabled : ''} ${addClass ?? ''}`}>
      <input
        {...props}
        type="radio"
        id={uid}
        value={uid}
        name={radioName}
        disabled={validation}
        className={css.radioOption}
        checked={isSelected}
        onChange={handleChange}
      />
      <label htmlFor={uid} className={getLabelClass(state)}>
        {label}
      </label>
    </div>
  );
};
