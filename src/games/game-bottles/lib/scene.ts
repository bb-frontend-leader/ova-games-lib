/**
 * Burbujas ambientales del fondo: posición horizontal, tamaño (rem), duración y retardo (s) y deriva horizontal (px).
 * Son fijas (no `Math.random()` en el render) para que el fondo sea idéntico en cada render.
 */
export const BUBBLES = [
  { x: '6%', size: 0.7, dur: 11, delay: 0, drift: 18 },
  { x: '17%', size: 1.1, dur: 15, delay: 4.5, drift: -24 },
  { x: '29%', size: 0.55, dur: 10, delay: 7, drift: 12 },
  { x: '41%', size: 0.9, dur: 13, delay: 2, drift: -16 },
  { x: '56%', size: 1.3, dur: 17, delay: 9, drift: 26 },
  { x: '68%', size: 0.65, dur: 11.5, delay: 5.5, drift: -12 },
  { x: '81%', size: 1, dur: 14, delay: 1.5, drift: 20 },
  { x: '93%', size: 0.6, dur: 10.5, delay: 8, drift: -18 }
] as const;

// Cuánto se desplaza (px) cada capa cuando el puntero llega al borde de la escena; más cerca = se mueve más.
export const DEPTH = { sea: 4, algae: 8, sand: 12, crab: 12, front: 24 } as const;
