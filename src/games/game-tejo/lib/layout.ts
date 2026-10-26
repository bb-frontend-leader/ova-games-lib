import { CM_PER_UNIT, RADIUS, SPOTS, WOBBLE } from './constant';

import type { Point, ThrowKind } from '../types/types';

/** Escenario cenital: la caja de arcilla vista desde arriba y, abajo, la mano de quien lanza. Unidades del viewBox. */
export const VIEW_W = 640;
export const VIEW_H = 360;

/** Caja de madera y arcilla interior, donde se apunta. */
export const BOX = { x: 96, y: 8, w: 448, h: 304 } as const;
export const CLAY = { x: 114, y: 26, w: 412, h: 268 } as const;

/** Mano de quien lanza: de aquí sale el tejo. */
export const HAND: Point = { x: 320, y: 338 };

/** Centro del bocín para una posición de las de `SPOTS` (coordenadas del viewBox). */
export const spotPoint = (spot: number): Point => {
  const [fx, fy] = SPOTS[spot % SPOTS.length];

  return { x: CLAY.x + fx * CLAY.w, y: CLAY.y + fy * CLAY.h };
};

/** Las cuatro mechas, en la diagonal del aro del bocín. */
export const mechaPoints = (center: Point): Point[] =>
  [45, 135, 225, 315].map((deg) => ({
    x: center.x + Math.cos((deg * Math.PI) / 180) * RADIUS.mechaRing,
    y: center.y + Math.sin((deg * Math.PI) / 180) * RADIUS.mechaRing
  }));

/** Del porcentaje de los deslizadores (0–100) al punto del escenario. */
export const aimPoint = (aimX: number, aimY: number): Point => ({
  x: CLAY.x + (aimX / 100) * CLAY.w,
  y: CLAY.y + (aimY / 100) * CLAY.h
});

/** Del punto del escenario al porcentaje de los deslizadores, ya acotado. */
export const aimPercent = (point: Point) => ({
  aimX: Math.round(Math.max(0, Math.min(100, ((point.x - CLAY.x) / CLAY.w) * 100))),
  aimY: Math.round(Math.max(0, Math.min(100, ((point.y - CLAY.y) / CLAY.h) * 100)))
});

const dist = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);

/** Dónde cae el tejo: el punto apuntado más un desvío al azar (`unit` es un par de números entre 0 y 1). */
export const landing = (aim: Point, steady: boolean, [u, v]: [number, number]): Point => {
  const radius = (steady ? WOBBLE.steady : WOBBLE.normal) * Math.sqrt(u);
  const angle = v * Math.PI * 2;

  return {
    x: Math.max(8, Math.min(VIEW_W - 8, aim.x + Math.cos(angle) * radius)),
    y: Math.max(8, Math.min(VIEW_H - 40, aim.y + Math.sin(angle) * radius))
  };
};

/** Qué pasó con un tejo que cayó en `land` con el bocín en `center`. */
export const resolveThrow = (land: Point, center: Point): { kind: ThrowKind; cm: number } => {
  const d = dist(land, center);
  const nearMecha = Math.min(...mechaPoints(center).map((m) => dist(land, m)));
  const inClay = land.x >= CLAY.x && land.x <= CLAY.x + CLAY.w && land.y >= CLAY.y && land.y <= CLAY.y + CLAY.h;
  const cm = Math.round(d * CM_PER_UNIT);

  if (d <= RADIUS.monona) return { kind: 'monona', cm };
  if (d <= RADIUS.bocin) return { kind: 'embocinada', cm };
  if (nearMecha <= RADIUS.mecha) return { kind: 'mecha', cm };
  if (d <= RADIUS.mano && inClay) return { kind: 'mano', cm };

  return { kind: inClay ? 'clay' : 'out', cm };
};

/** Mechas que revienta un tejo: las cuatro en una moñona, la más cercana en una mecha, ninguna en lo demás. */
export const burntMechas = (kind: ThrowKind, land: Point, center: Point): number[] => {
  if (kind === 'monona') return [0, 1, 2, 3];
  if (kind !== 'mecha') return [];

  const near = mechaPoints(center).map((m) => dist(land, m));

  return [near.indexOf(Math.min(...near))];
};
