import { useEffect, useId, useMemo } from 'react';

import { MathContainer } from '../../ui';

import { RadioStates } from './types/types';
import { useGameSpaceContext } from './game-space-context';

import css from './game-space.module.css';

interface OptionProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  addClass?: string;
  label: string;
  state: RadioStates;
  formula?: string;
}
export const GameSpaceRadio: React.FC<OptionProps> = ({ id, addClass, state, label, name, formula, ...props }) => {
  const reactId = useId();

  const { addOptionValues, addOptionElementsId, validation, options } = useGameSpaceContext();

  const uid = id || reactId;
  const radioName = `radio-space-group-${name}`;

  // ✅ seleccionado sale del CONTEXTO
  const isSelected = useMemo(() => {
    return options?.some((opt) => opt.name === radioName && opt.id === uid);
  }, [options, radioName, uid]);

  /**
   * Maneja el evento onChange.
   */
  const handleChange = () => {
    addOptionValues({ id: uid, name: radioName, state });
  };

  /**
   * Maneja el evento onChange.
   */
  useEffect(() => {
    addOptionElementsId(uid);
  }, [uid, addOptionElementsId]);

  /**
   * Devuelve una cadena con las clases CSS para un elemento radio
   * dependiendo de si está seleccionado, si es valido o no, y si es correcto o no.
   * @param inputId - ID del input
   * @param state - Estado del input
   * @returns
   */
  const getLabelClass = (state: 'success' | 'wrong') => {
    if (!validation || !isSelected) return css.option;
    return `${css.option} ${state === 'success' ? css.success : css.wrong}`;
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
        <span dangerouslySetInnerHTML={{ __html: label }} />
        {formula && <MathContainer className="u-fs-400">{`${formula}`}</MathContainer>}
      </label>
    </div>
  );
};
