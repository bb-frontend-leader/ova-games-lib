import { cloneElement } from 'react';

import { useGameCastleContext } from './game-castle-context';

interface Props {
  type?: 'reset';
  children: React.ReactElement;
  selectedAnswer?: string;
}

export const GameCastleButton: React.FC<Props> = ({ type, children }) => {
  const { checkAnswers, resetActivity, selectAnswers, openModal } = useGameCastleContext();

  const isDisabled = type === 'reset' ? openModal !== 'wrong' : !selectAnswers || openModal !== null;

  return cloneElement(children, {
    ...children.props,
    disabled: isDisabled,
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
      if (children.props.onClick) {
        children.props.onClick(event);
      }
      (type === 'reset' ? resetActivity : checkAnswers)();
    }
  });
};
