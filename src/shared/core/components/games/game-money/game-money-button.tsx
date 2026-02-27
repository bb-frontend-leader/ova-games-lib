/* eslint-disable @typescript-eslint/no-unused-expressions */
import { cloneElement, FC } from 'react';

import { useGameMoneyActivityContext } from './game-money-context';

interface Props {
  type?: 'reset';
  children: React.ReactElement;
}

export const GameMoneytButton: FC<Props> = ({ type, children }) => {
  const { handleValidation, handleReset, button, validation, result } = useGameMoneyActivityContext();

  return cloneElement(children, {
    ...children.props,
    disabled: type !== 'reset' ? button : validation ? result : true,
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
      if (children.props.onClick) {
        children.props.onClick(event);
      }
      type === 'reset' ? handleReset() : handleValidation();
    }
  });
};
