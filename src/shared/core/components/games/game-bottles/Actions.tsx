import { cloneElement, FC } from 'react';

import { useGameBottle } from './useGameBottle';

interface Props {
  type?: 'reset' | 'validation';
  children: React.ReactElement;
}
export const Actions: FC<Props> = ({ type, children }) => {
  const { checkAnswer, reset, openModal, ALREADY_FILL } = useGameBottle();

  let disabled = false;

  if (type === 'validation') {
    disabled = !ALREADY_FILL || openModal !== null;
  }

  if (type === 'reset') {
    disabled = openModal !== 'wrong';
  }

  return cloneElement(children, {
    ...children.props,
    disabled,
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
      children.props.onClick?.(event);
      if (type === 'validation') checkAnswer();
      if (type === 'reset') reset();
    }
  });
};
