import { CHANCE, HOLES } from './constant';

import type { HoleId } from '../types/types';

/** Escenario de frente: la mesa de rana y, abajo, la mano que lanza. Unidades del viewBox. */
export const VIEW_W = 640;
export const VIEW_H = 400;

/** Mueble de madera donde está la mesa. */
export const CABINET = { x: 150, y: 12, w: 340, h: 338 } as const;

/** Mano de quien lanza: de aquí sale la moneda. */
export const HAND = { x: 320, y: 384 } as const;

/** Centro y radio de cada hoyo (unidades del escenario). */
export const HOLE_AT: Record<HoleId, { x: number; y: number; r: number }> = {
  rana: { x: 320, y: 112, r: 30 },
  molino: { x: 226, y: 206, r: 17 },
  puente: { x: 414, y: 206, r: 18 },
  tortuga: { x: 320, y: 258, r: 15 },
  hoyo: { x: 320, y: 308, r: 11 }
};

/** Los cinco hoyitos de la fila de abajo. */
export const SLOTS = [200, 260, 320, 380, 440].map((x) => ({ x, y: 308 }));

/** Hacia dónde va la moneda: el centro del hoyo (o el hoyito que toca si el hoyo es la fila de abajo). */
export const targetOf = (hole: HoleId, slot: number) => (hole === 'hoyo' ? SLOTS[slot % SLOTS.length] : HOLE_AT[hole]);

/** Probabilidad (0–1) de que la moneda entre: la del hoyo más la racha y la mano firme. */
export const chanceOf = (hole: HoleId, streak: number, steady: boolean) =>
  Math.min(
    CHANCE.cap,
    HOLES[hole].chance + Math.min(streak, CHANCE.streakCap) * CHANCE.streakStep + (steady ? CHANCE.steady : 0)
  );
