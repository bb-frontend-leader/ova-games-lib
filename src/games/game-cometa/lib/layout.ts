/** Cielo: unidades del viewBox. */
export const VIEW_W = 640;
export const VIEW_H = 400;

/** Mano de quien sostiene el carrete: de aquí sale el hilo. */
export const HAND = { x: 118, y: 306 } as const;

/** Altura de la cometa: a ras de la colina con 0 y en lo más alto con 1. */
const LOW = 240;
const HIGH = 64;

/** Punto de la cometa (centro del rombo) para una altura de 0 a 1: sube describiendo una S suave. */
export const kitePoint = (f: number) => ({
  x: 372 + Math.sin(f * Math.PI * 1.4) * 64,
  y: LOW + (HIGH - LOW) * f
});

/** Hilo de la mano al pie de la cometa, con una comba que se estira cuanto más alta va. */
export const stringPath = (f: number) => {
  const k = kitePoint(f);
  const foot = { x: k.x, y: k.y + 36 };
  const sag = 34 * (1 - f * 0.7);
  const mid = { x: (HAND.x + foot.x) / 2 - 8, y: (HAND.y + foot.y) / 2 + sag };

  return `M${HAND.x} ${HAND.y}Q${mid.x.toFixed(1)} ${mid.y.toFixed(1)} ${foot.x.toFixed(1)} ${foot.y.toFixed(1)}`;
};

/** Regla de altura del costado: de la base a la cumbre. */
export const RULER = { x: 598, y0: 336, y1: 50 } as const;

/** Altura de 0 a 1 que corresponde a `n` preguntas acertadas de `total`. */
export const fractionOf = (n: number, total: number) => (total ? Math.max(0, Math.min(1, n / total)) : 0);
