import { useEffect, useId, useMemo } from 'react';

import { RadioStates } from './types/types';
import { useGameMoneyActivityContext } from './game-money-context';

import css from './game-money.module.css';

const STATES: Partial<Record<RadioStates, 'wrong' | 'right'>> = {
  wrong: 'wrong',
  success: 'right'
};

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  addClass?: string;
  label: string;
  state: RadioStates;
}

export const GameMoneyRadio: React.FC<Props> = ({ id, addClass, state, label, name, ...props }) => {
  const reactId = useId();
  const { addSelectedOption, addRadioElementsId, validation, options } = useGameMoneyActivityContext();

  const uid = id || reactId;
  const radioName = `radio-group-money-${name}`;

  // ✅ seleccionado sale del CONTEXTO
  const isSelected = useMemo(() => {
    return options?.some((opt) => opt.name === radioName && opt.id === uid);
  }, [options, radioName, uid]);


  /**
   * Maneja el evento onChange.
   */
  const handleChange = () => {
    addSelectedOption({ id: uid, name: radioName, state });
  };


  /**
   * Añade un ID de elemento radio al estado de la actividad.
   * Si el ID no está presente en el array `radioElementsId`, lo agrega.
   */
  useEffect(() => {
    addRadioElementsId(uid);
  }, [uid, addRadioElementsId]);

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
    <div className={`${validation ? css.disabled : ''} ${addClass ?? ''}`} data-option-id={uid}>
      <input
        type="radio"
        id={uid}
        name={radioName}
        className={css.radio}
        onChange={handleChange}
        checked={isSelected}
        disabled={validation}
        data-state={validation && isSelected ? STATES[state] : undefined}
        {...props}
      />
      <label htmlFor={uid} className={getLabelClass(state)}>
        {label}
      </label>
    </div>
  );
};
