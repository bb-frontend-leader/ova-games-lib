import { cloneElement } from 'react';

import { useGameSpaceContext } from './game-space-context';

interface Props {
  type?: 'reset';
  children: React.ReactElement;
}

export const GameSpaceButton: React.FC<Props> = ({ type, children }) => {
  const { handleValidation, handleReset, button, validation, result } = useGameSpaceContext();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    children.props.onClick?.(event);

    // Al comprobar, el botón se deshabilita y suelta el foco: pasa al siguiente botón habilitado de su fila.
    // Se programa antes de la acción para que el foco se mueva antes de que el padre abra su modal.
    if (type !== 'reset') {
      const row = event.currentTarget.parentElement;

      requestAnimationFrame(() => {
        const active = document.activeElement as HTMLElement | null;

        if (!active || active === document.body || (active as HTMLButtonElement).disabled) {
          row?.querySelector<HTMLElement>('button:not(:disabled)')?.focus({ preventScroll: true });
        }
      });
    }

    (type === 'reset' ? handleReset : handleValidation)();
  };

  return cloneElement(children, {
    ...children.props,
    disabled: type !== 'reset' ? button : validation ? result : true,
    onClick: handleClick
  });
};
