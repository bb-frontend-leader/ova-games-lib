import type { Block } from '../types/types';

/** Ancho del escenario y de la base, en casillas. */
export const COLS = 15;
export const BASE_WIDTH = 5;

/** Filas de cielo que se dejan libres sobre la torre: hasta ahí sube antes de que la cámara suba con ella. */
export const SKY_ROWS = 3;

/** Filas máximas visibles: si la torre sube más, la cámara sube con ella. */
export const MAX_ROWS = 16;

/** La base sobre la que se construye: centrada en el escenario. */
export const createBase = (): Block => ({
  id: 0,
  level: 0,
  left: Math.floor((COLS - BASE_WIDTH) / 2),
  width: BASE_WIDTH,
  perfect: false
});

/**
 * Qué pasa al soltar un bloque del mismo ancho que `top` con un desplazamiento `offset` (casillas, positivo a la
 * derecha): si encaja justo, si sobresale (y se corta lo que sobra) o si cae del todo fuera.
 */
export const resolveDrop = (top: Pick<Block, 'left' | 'width'>, offset: number) => {
  const overlap = top.width - Math.abs(offset);

  if (overlap <= 0) return { kind: 'miss' as const, left: top.left, width: 0, cut: top.width };

  return {
    kind: offset === 0 ? ('perfect' as const) : ('partial' as const),
    left: Math.max(top.left, top.left + offset),
    width: overlap,
    cut: Math.abs(offset)
  };
};

/** Ensancha un bloque una casilla hacia donde quepa (a la derecha, o a la izquierda si ya toca el borde). */
export const widen = (left: number, width: number) =>
  left + width < COLS ? { left, width: width + 1 } : { left: left - 1, width: width + 1 };

/** Filas que sube la cámara para que la torre no se salga por arriba. */
export const cameraShift = (height: number, rows: number) => Math.max(0, height - (rows - SKY_ROWS));

/** Posición vertical (en %) del nivel `level` del escenario. */
export const levelBottom = (level: number, rows: number, shift: number) => `${((level - shift) * 100) / rows}%`;

/** Posición horizontal (en %) de la casilla `col`. */
export const colLeft = (col: number) => `${(col * 100) / COLS}%`;
