import { useEffect, useId, useMemo } from 'react';

import { parseLabel } from './lib/parse-label';
import { RadioStates } from './types/types';
import { useThisOrThatGameContext } from './game-this-or-that-context';

import css from './this-or-that.module.css';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  addClass?: string;
  label: string;
  state: RadioStates;
}

export const GameThisOrThatRadio: React.FC<Props> = ({ id, addClass, state, label, name, ...props }) => {
  const reactId = useId();

  const { addRadiosValues, addElementsId, validation, options } = useThisOrThatGameContext();

  const uid = id || reactId;
  const radioName = `radio-group-this-or-that-${name}`;

  const { letter, text } = useMemo(() => parseLabel(label), [label]);

  // Selected sale del CONTEXTO
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
        {letter && <span className={css['circle']}>{letter}</span>}
        <span>{text}</span>
      </label>
    </div>
  );
};
