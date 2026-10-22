import { useEffect, useId } from 'react';
import { CheckBox } from 'books-ui';

import { SOUNDS } from '@/constants';
import { usePlaySound } from '@/hooks';

import { useCheckboxActivityContext } from './checkbox-activity-context';

import type { CheckboxStates } from './types/types';

import css from './checkbox-activity.module.css';

const STATES: Partial<Record<CheckboxStates, 'wrong' | 'right'>> = {
  wrong: 'wrong',
  success: 'right'
};

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  addClass?: string;
  label: string;
  state: CheckboxStates;
}

export const CheckboxElement: React.FC<Props> = ({ id, addClass, state, label, name, ...props }) => {
  const reactId = useId();
  const playSound = usePlaySound();
  const { addCheckboxsValues, addCheckboxElementsId, validation } = useCheckboxActivityContext();

  const uid = id || reactId;
  const checkboxName = `checkbox-group-name-${name}`;

  /**
   * Maneja el evento onChange.
   */
  const handleChange = () => {
    playSound(SOUNDS.TICK);
    addCheckboxsValues({ id: uid, name: checkboxName, state });
  };

  useEffect(() => {
    addCheckboxElementsId(uid);
  }, [uid, addCheckboxElementsId]);

  return (
    <CheckBox
      id={uid}
      label={label}
      addClass={`${css['checkbox']} ${addClass ?? ''}`}
      onChange={handleChange}
      disabled={validation}
      name={checkboxName}
      {...(validation && { state: STATES[state] })}
      {...props}
    />
  );
};
