import { useEffect, useId } from 'react';

import { SOUNDS } from '@/constants';
import { usePlaySound } from '@/hooks';

import { useTrueFalseContext } from './true-false-context';

import type { RadioStates } from './types/types';

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
  const playSound = usePlaySound();
  const { addRadiosValues, addRadioElementsId, validation, options } = useTrueFalseContext();

  const uid = id || reactId;
  const radioName = `radio-group-name-${name}`;

  const optionState = options.find((option) => option.id === uid)?.state;
  const dataState = validation ? (optionState ? STATES[optionState] : undefined) : undefined;

  /**
   * Maneja el evento onChange.
   */
  const handleChange = () => {
    playSound(SOUNDS.TICK);
    addRadiosValues({ id: uid, name: radioName, state });
  };

  useEffect(() => {
    addRadioElementsId(uid);
  }, [uid, addRadioElementsId]);

  return (
    <div className={`${css['wrapper-radio']} ${addClass ?? ''}`}>
      <span className={css['wrapper-radio__dot']} aria-hidden="true" />
      <label className={css['wrapper-radio__label']} htmlFor={reactId}>
        {label}
      </label>
      <input
        data-state={dataState}
        name={name}
        id={reactId}
        onChange={handleChange}
        disabled={validation}
        {...(validation && { state: STATES[state] })}
        {...props}
        type="radio"
      />
    </div>
  );
};
