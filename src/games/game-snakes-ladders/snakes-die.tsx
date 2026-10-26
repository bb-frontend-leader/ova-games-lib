import { forwardRef } from 'react';

import css from './game-snakes-ladders.module.css';

interface Props {
  /** Cara que se ve (1 a 6); sin valor, el dado se ve en reposo con la cara 1. */
  face: number;
  label: string;
}

/**
 * Dado de seis caras hecho con nueve puntos en rejilla: `data-face` decide cuáles se encienden. El juego cambia
 * `data-face` directamente mientras rueda, para no volver a pintar React en cada cambio.
 */
export const SnakesDie = forwardRef<HTMLDivElement, Props>(({ face, label }, ref) => (
  <div ref={ref} className={css.die} data-face={face} role="img" aria-label={label}>
    {Array.from({ length: 9 }, (_, k) => (
      <span key={k} className={css.pip} />
    ))}
  </div>
));

SnakesDie.displayName = 'SnakesDie';
