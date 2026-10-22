import { cloneElement } from 'react';

import { useGameFishActivityContext } from './game-fish-context';

interface Props {
  type?: 'reset';
  children: React.ReactElement;
}

export const GameFishButton: React.FC<Props> = ({ type, children }) => {
  const { handleValidation, handleReset, button, validation, result } = useGameFishActivityContext();

  return cloneElement(children, {
    ...children.props,
    disabled: type !== 'reset' ? button : validation ? result : true,
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
      if (children.props.onClick) {
        children.props.onClick(event);
      }
      (type === 'reset' ? handleReset : handleValidation)();
    }
  });
};
