import React, { useEffect, useId } from 'react';

import  type{ RadioStates } from './tyes/types';
import { useTrueFalseContext } from './true-false-context';

import css from './true-false.module.css';

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

export const Option = ({ id, addClass, state, label, name, ...props }: Props) => {
  const reactId = useId();
  const { addRadiosValues, addRadioElementsId, validation, options } = useTrueFalseContext();

  const uid = id || reactId;
  const radioName = `radio-group-name-${name}`;

  const optionState = options.find((option) => option.id === uid)?.state;
  const dataState = validation ? (optionState ? STATES[optionState] : undefined) : undefined;

  /**
   * Maneja el evento onChange.
   */
  const handleChange = () => {
    addRadiosValues({ id: uid, name: radioName, state });
  };

  useEffect(() => {
    addRadioElementsId(uid);
  }, [uid, addRadioElementsId]);

  return (
    <div className={css['wrapper-radio']}>
      <label htmlFor={reactId}>{label}</label>
      <input
        data-state={dataState}
        name={name}
        id={reactId}
        className={`${addClass ?? ''}`}
        onChange={handleChange}
        disabled={validation}
        {...(validation && { state: STATES[state] })}
        {...props}
        type="radio"
      />
    </div>
  );
};
