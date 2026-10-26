import { TOLERANCE } from './constant';

import type { ShotKind } from '../types/types';

/** Caja del dibujo del campo (unidades del SVG) y altura del suelo. */
export const VIEW_W = 400;
export const VIEW_H = 200;
export const GROUND = 164;

/** Píxeles del dibujo por metro, y punto desde el que sale la piedra al soltarse. */
export const UNIT = 4;
export const X0 = 72;
export const Y0 = 112;

/** Eje del brazo de la catapulta y largo del brazo; el brazo se arma (cocked) o se suelta (released). */
export const PIVOT = { x: 52, y: 142 } as const;
export const ARM = 36;
export const ARM_ROT = { cocked: 150, released: -55 } as const;

/** Constante del alcance: con fuerza 100 % y 45 grados la piedra llega a 90 m. */
const K = 0.009;

/** Alcance (m) de un disparo con `angle` grados y `power` por ciento de fuerza. */
export const rangeOf = (angle: number, power: number) => K * power * power * Math.sin((2 * angle * Math.PI) / 180);

/** Qué pasa con un disparo contra una torre a `distance` m: impacto directo, derribo, corto o largo. */
export const resolveShot = (angle: number, power: number, distance: number, fireball: boolean) => {
  const range = rangeOf(angle, power);
  const delta = range - distance;
  const tolerance = TOLERANCE.hit + (fireball ? TOLERANCE.fire : 0);
  const kind: ShotKind =
    Math.abs(delta) <= TOLERANCE.direct
      ? 'direct'
      : Math.abs(delta) <= tolerance
        ? 'hit'
        : delta < 0
          ? 'short'
          : 'long';

  return { range, delta, kind };
};

/** Posición (x en el dibujo) de la torre a `distance` m. */
export const towerX = (distance: number) => X0 + distance * UNIT;

/** Punta del brazo con el brazo girado `rot` grados alrededor del eje. */
export const armTip = (rot: number) => {
  const r = (rot * Math.PI) / 180;

  return { x: PIVOT.x + ARM * Math.cos(r), y: PIVOT.y + ARM * Math.sin(r) };
};

/**
 * Punto del vuelo en `s` (0 salida, 1 caída): la parábola del disparo en el dibujo. La altura máxima crece con
 * el alcance y la tangente del ángulo; el vertical se aplana un poco para que quepa en el cielo.
 */
export const arcPoint = (s: number, angle: number, power: number) => {
  const range = rangeOf(angle, power);
  const apex = (range / 4) * Math.tan((angle * Math.PI) / 180) * UNIT * 0.7;

  return {
    x: X0 + range * UNIT * s,
    y: Y0 + (GROUND - Y0) * s - 4 * apex * s * (1 - s)
  };
};

/** Trazo (atributo `d`) de la parte `[from, to]` del vuelo. */
export const arcPath = (angle: number, power: number, from = 0, to = 1, steps = 24) => {
  const points = Array.from({ length: steps + 1 }, (_, i) => arcPoint(from + ((to - from) * i) / steps, angle, power));

  return points.map(({ x, y }, i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
};
