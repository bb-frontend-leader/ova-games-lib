import React, { cloneElement, ReactElement } from 'react';

import { useGameCasinoProvider } from './game-casino-context';

interface Props {
  type?: 'reset';
  children: ReactElement;
}

export const GameCasinoButton = ({ type, children }: Props) => {
  const { handleValidation, handleReset, button, validation } = useGameCasinoProvider();

  const handleClick = (e: React.MouseEvent) => {
    // 1. Ejecutamos el onClick del hijo si existe
    children.props.onClick?.(e);

    // 2. Cambiamos el ternario por un if/else para que sea una instrucción válida
    if (type === 'reset') {
      handleReset();
    } else {
      handleValidation();
    }
  };

  const isDisabled = type === 'reset' ? !validation : validation || button;

  return cloneElement(children, {
    ...children.props,
    disabled: isDisabled,
    onClick: handleClick
  });
};
