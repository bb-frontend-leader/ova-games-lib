import { cloneElement } from 'react';

import { useRadioBasketActivityContext } from './game-basketball-context';

interface Props {
  /** Sin `type` es el botón de tirar. `reset` es para volver a tirar la misma pregunta después de fallar. */
  type?: 'reset';
  children: React.ReactElement;
}

export const GameBasketballButton: React.FC<Props> = ({ type, children }) => {
  const { handleValidation, handleReset, button, validation, result } = useRadioBasketActivityContext();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    children.props.onClick?.(event);

    // Al tirar, el botón se deshabilita y suelta el foco: pasa al siguiente botón habilitado de su fila.
    // Se programa antes de la acción para que el foco se mueva antes de que el padre abra su modal.
    if (type !== 'reset') {
      const row = event.currentTarget.parentElement;

      requestAnimationFrame(() => {
        const active = document.activeElement as HTMLElement | null;

        if (!active || active === document.body || (active as HTMLButtonElement).disabled) {
          // Si entró la canasta, el camino sigue con el botón de dentro del juego ("Siguiente tiro" o "Ver marcador final")
          const next = document.querySelector<HTMLElement>('[data-next-shot]:not(:disabled)');

          (next ?? row?.querySelector<HTMLElement>('button:not(:disabled)'))?.focus({ preventScroll: true });
        }
      });
    }

    (type === 'reset' ? handleReset : handleValidation)();
  };

  return cloneElement(children, {
    ...children.props,
    // Volver a tirar es solo para después de fallar: tras una canasta se sigue con el botón de dentro del juego
    disabled: type !== 'reset' ? button : !validation || result,
    onClick: handleClick
  });
};
