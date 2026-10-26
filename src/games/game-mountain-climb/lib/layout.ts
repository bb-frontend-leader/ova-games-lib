import { CAMP_EVERY } from './constant';

/** Caja del dibujo de la montaña (unidades del SVG). */
export const VIEW_W = 300;
export const VIEW_H = 360;

/** Altura (y) de la base y de la cumbre del sendero. */
const BASE_Y = 326;
const PEAK_Y = 50;

export interface Point {
  x: number;
  y: number;
}

/** Mitad del ancho de la montaña a la altura `y`: el sendero zigzaguea dentro de él. */
const halfWidth = (y: number) => 14 + ((y - 34) / (VIEW_H - 34)) * 150;

/** Punto del sendero del tramo `i` (0 es la base y `total` la cumbre). Los tramos zigzaguean subiendo. */
export const nodePoint = (i: number, total: number): Point => {
  const y = BASE_Y - ((BASE_Y - PEAK_Y) * i) / Math.max(1, total);

  return { x: i >= total ? VIEW_W / 2 : VIEW_W / 2 + 0.44 * halfWidth(y) * Math.sin(i * 1.45), y };
};

/** Punto entre dos tramos: `f` puede ser fraccionario (el escalador se mueve de uno a otro). */
export const pointAt = (f: number, total: number): Point => {
  const clamped = Math.max(0, Math.min(total, f));
  const a = Math.floor(clamped);
  const from = nodePoint(a, total);

  if (a >= total) return from;

  const to = nodePoint(a + 1, total);
  const k = clamped - a;

  return { x: from.x + (to.x - from.x) * k, y: from.y + (to.y - from.y) * k };
};

/** El tramo `i` es un campamento (no la base ni la cumbre). */
export const isCamp = (i: number, total: number) => i > 0 && i < total && i % CAMP_EVERY === 0;

/** Tramo del último campamento por el que se pasó (la base si aún no se llegó a ninguno). */
export const lastCamp = (pos: number) => Math.floor(pos / CAMP_EVERY) * CAMP_EVERY;

/** Siguiente parada (campamento o cumbre) desde `pos`. */
export const nextStop = (pos: number, total: number) =>
  Math.min(total, (Math.floor(pos / CAMP_EVERY) + 1) * CAMP_EVERY);

/** Trazo (atributo `d`) que pasa por los tramos de `from` a `to`. */
export const trailPath = (from: number, to: number, total: number) => {
  const points: Point[] = [];

  for (let i = from; i <= to; i++) points.push(nodePoint(i, total));

  return points.map(({ x, y }, k) => `${k ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
};
