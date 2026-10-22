import { useEffect, useId } from 'react';
import { Radio } from 'books-ui';

import { SOUNDS } from '@/constants';
import { usePlaySound } from '@/hooks';

import { useRadioActivityContext } from './radio-activity-context';

import type { RadioStates } from './types/types';

import css from './radio-activity.module.css';

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

export const RadioElement: React.FC<Props> = ({ id, addClass, state, label, name, ...props }) => {
  const reactId = useId();
  const playSound = usePlaySound();
  const { addRadiosValues, addRadioElementsId, validation } = useRadioActivityContext();

  const uid = id || reactId;
  const radioName = `radio-group-name-${name}`;

  /**
   * Maneja el evento onChange.
   */
  const handleChange = () => {
    playSound(SOUNDS.TICK);
    addRadiosValues({ id: uid, name: radioName, state, value: label });
  };

  useEffect(() => {
    addRadioElementsId(uid);
  }, [uid, addRadioElementsId]);

  return (
    <Radio
      id={uid}
      label={label}
      addClass={`${css['radio']} ${addClass ?? ''}`}
      onChange={handleChange}
      disabled={validation}
      name={radioName}
      {...(validation && { state: STATES[state] })}
      {...props}
    />
  );
};
