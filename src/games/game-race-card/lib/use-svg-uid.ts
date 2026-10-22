import { useId } from 'react';

/**
 * Prefijo único para los ids internos de un SVG (degradados, patrones). El mismo dibujo se repite varias veces en
 * la página, y un id repetido haría que todos tomaran el degradado del primero.
 */
export const useSvgUid = () => `rc${useId().replace(/\W/g, '')}`;
