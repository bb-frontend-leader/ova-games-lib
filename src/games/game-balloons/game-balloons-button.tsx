import { cloneElement } from 'react';

import { SectionNavigation } from '@/utils';

import { useGameBalloonsContext } from './game-balloons-context';

interface Props {
  type?: 'reset' | 'next';
  children: React.ReactElement;
}

export const GameBalloonsButton: React.FC<Props> = ({ type, children }) => {
  const { handleValidation, handleReset, button, validation, result } = useGameBalloonsContext();

  const canNext = validation && result;

  const disabled = type === 'next' ? !canNext : type === 'reset' ? !(validation && !result) : button;

  return cloneElement(children, {
    ...children.props,
    disabled,
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
      children.props.onClick?.(event);

      if (type === 'reset') return handleReset();
      if (type === 'next') return SectionNavigation.next();
      return handleValidation();
    }
  });
};
