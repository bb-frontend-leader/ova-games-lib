import { cloneElement, FC, ReactElement } from 'react';

import { useMemoryActivityContext } from './memory-card-context';

interface Props {
  type?: 'reset';
  children: ReactElement;
}

export const MemoryCardButton: FC<Props> = ({ type, children }) => {
  const { checkGameStatus, restartGame, buttonsDisabled, isReset } = useMemoryActivityContext();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (children.props.onClick) {
      children.props.onClick(event);
    }

    if (type === 'reset') {
      restartGame();
    } else {
      checkGameStatus();
    }
  };

  const isDisabled = type === 'reset' ? isReset : buttonsDisabled;

  return cloneElement(children, {
    ...children.props,
    disabled: isDisabled,
    onClick: handleClick
  });
};
