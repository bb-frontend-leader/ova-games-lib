import { cloneElement } from 'react';

import { useGameJoinContext } from './pair-logic-context';

interface Props {
  type?: 'reset';
  children: React.ReactElement;
}

export const PairLogicButton: React.FC<Props> = ({ type, children }) => {
  const { handleValidation, HandleReset, endActivity, imageSelected, text, validation } = useGameJoinContext();
  const canValidate = imageSelected?.src !== null && text?.text !== null && !endActivity && validation === null;
  return cloneElement(children, {
    ...children.props,
    disabled: type == 'reset' ? !endActivity : !canValidate,
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
      if (children.props.onClick) {
        children.props.onClick(event);
      }
      (type === 'reset' ? HandleReset : handleValidation)();
    }
  });
};
