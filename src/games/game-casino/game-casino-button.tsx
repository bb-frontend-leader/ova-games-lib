import { cloneElement } from 'react';

import { useGameCasinoProvider } from './game-casino-context';

interface Props {
  /** Sin `type` es el botón de apostar. `reset` es una ronda nueva (se conservan las fichas) y `restart` empieza de cero. */
  type?: 'reset' | 'restart';
  children: React.ReactElement;
}

export const GameCasinoButton = ({ type, children }: Props) => {
  const { handleValidation, handleReset, handleRestart, button, validation, result } = useGameCasinoProvider();

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    // 1. Ejecutamos el onClick del hijo si existe
    children.props.onClick?.(e);

    // 2. Al apostar, el botón se deshabilita y suelta el foco: pasa al siguiente botón habilitado de su fila.
    // Se programa antes de la acción para que el foco se mueva antes de que el padre abra su modal.
    if (!type) {
      const row = e.currentTarget.parentElement;

      requestAnimationFrame(() => {
        const active = document.activeElement as HTMLElement | null;

        if (!active || active === document.body || (active as HTMLButtonElement).disabled) {
          // Si se ganó, el camino sigue con el botón de dentro del juego ("Siguiente ronda" o "Cobrar fichas")
          const next = document.querySelector<HTMLElement>('[data-next-round]:not(:disabled)');

          (next ?? row?.querySelector<HTMLElement>('button:not(:disabled)'))?.focus({ preventScroll: true });
        }
      });
    }

    if (type === 'reset') handleReset();
    else if (type === 'restart') handleRestart();
    else handleValidation();
  };

  // Reiniciar es para reintentar después de perder: tras un acierto se sigue con el botón de dentro del juego
  const isDisabled = type === 'reset' ? !validation || result : type ? !validation : validation || button;

  return cloneElement(children, {
    ...children.props,
    disabled: isDisabled,
    onClick: handleClick
  });
};
