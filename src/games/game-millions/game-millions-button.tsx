import { cloneElement } from 'react';

import { useGameMillionContext } from './game-million-context';

interface Props {
  type: 'check' | 'reset';
  children: React.ReactElement;
}

export const GameMillionButton: React.FC<Props> = ({ type, children }) => {
  const { handleVerify, handleReset, activity } = useGameMillionContext();

  let disabled = false;
  let action: (() => void) | undefined;

  switch (type) {
    case 'check':
      disabled = activity.isVerify || activity.selects.length < 1;
      action = handleVerify;
      break;

    case 'reset':
      disabled = !activity.isVerify || activity.result;
      action = handleReset;
      break;
  }

  return cloneElement(children, {
    ...children.props,
    disabled,
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
      children.props.onClick?.(event);
      action?.();
    }
  });
};
