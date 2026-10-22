import { cloneElement } from 'react';

import { useInputActivityContext } from './input-activity-context';

interface Props {
  type?: 'reset';
  children: React.ReactElement;
}

export const InputButton: React.FC<Props> = ({ type, children }) => {
  const { handleValidation, handleReset, canValidate, canReset } = useInputActivityContext();

  const isReset = type === 'reset';

  return cloneElement(children, {
    disabled: !(isReset ? canReset : canValidate),
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
      if (children.props.onClick) {
        children.props.onClick(event);
      }
      (isReset ? handleReset : handleValidation)();
    }
  });
};
