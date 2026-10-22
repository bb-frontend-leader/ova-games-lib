import { cloneElement } from 'react';

import { useMemoryActivityContext } from './memory-card-context';

interface Props {
  type?: 'reset';
  children: React.ReactElement;
}

export const MemoryCardButton: React.FC<Props> = ({ type, children }) => {
  const { checkGameStatus, restartGame, buttonsDisabled, isReset } = useMemoryActivityContext();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (children.props.onClick) {
      children.props.onClick(event);
    }

    if (type === 'reset') {
      restartGame();
    } else {
      // Al comprobar, el botón se deshabilita y suelta el foco: pasa al siguiente botón habilitado de su fila.
      // Se programa antes de la acción para que el foco se mueva antes de que el padre abra su modal.
      const row = event.currentTarget.parentElement;

      requestAnimationFrame(() => {
        const active = document.activeElement as HTMLElement | null;

        if (!active || active === document.body || (active as HTMLButtonElement).disabled) {
          row?.querySelector<HTMLElement>('button:not(:disabled)')?.focus({ preventScroll: true });
        }
      });

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
