import type { HTMLAttributes } from 'react';

import css from './dnd.module.css';

/**
 * Fila de ranuras para ordenar una frase: las `DragAndDrop.Drop` que se pongan dentro comparten
 * el ancho de la fila (no cambian de tamaño al recibir una palabra) y saltan de línea en pantallas angostas.
 * Para dar nombre a la fila se le pasa `role="group"` y `aria-label`.
 */
export const DndPhrase: React.FC<HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div {...props} className={[css['phrase'], className].filter(Boolean).join(' ')}>
    {children}
  </div>
);
