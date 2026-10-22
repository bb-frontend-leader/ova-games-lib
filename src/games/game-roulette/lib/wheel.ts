import type { RouletteQuestion, RouletteSpecial, Wedge } from '../types/types';

/** Geometría de la ruleta en un `viewBox` de 400 x 400. */
export const CENTER = 200;
export const RADIUS = 168;

/** Punto a `angle` grados desde la parte de arriba (hacia la derecha) y a `r` del centro. */
export const polar = (angle: number, r: number) => {
  const rad = (angle * Math.PI) / 180;

  return { x: CENTER + r * Math.sin(rad), y: CENTER - r * Math.cos(rad) };
};

/** Trazado de la casilla `index` de `count`. */
export const slicePath = (index: number, count: number) => {
  if (count === 1) {
    return `M${CENTER} ${CENTER - RADIUS} A${RADIUS} ${RADIUS} 0 1 1 ${CENTER - 0.01} ${CENTER - RADIUS} Z`;
  }

  const step = 360 / count;
  const start = polar(index * step, RADIUS);
  const end = polar((index + 1) * step, RADIUS);

  return `M${CENTER} ${CENTER} L${start.x} ${start.y} A${RADIUS} ${RADIUS} 0 ${step > 180 ? 1 : 0} 1 ${end.x} ${end.y} Z`;
};

/**
 * Reparte las casillas especiales a intervalos regulares entre las preguntas (que conservan su orden).
 */
export const buildWedges = (questions: RouletteQuestion[], specials: readonly RouletteSpecial[]): Wedge[] => {
  const total = questions.length + specials.length;
  const slots = new Map<number, RouletteSpecial>();

  specials.forEach((kind, k) => slots.set(Math.floor(((k + 0.5) * total) / specials.length), kind));

  let next = 0;

  return Array.from({ length: total }, (_, i) => {
    const special = slots.get(i);

    if (special) return { id: `special-${special}`, kind: special, index: -1 };

    const index = next++;

    return { id: questions[index].id, kind: 'question', index };
  });
};

/**
 * Ángulo final de la ruleta para que el puntero (arriba) quede sobre la casilla `index`: siempre gira hacia
 * delante y da varias vueltas. Se detiene en un punto cualquiera de la casilla, no siempre en el centro.
 */
export const spinTarget = (current: number, index: number, count: number) => {
  const step = 360 / count;
  const local = index * step + step / 2 + (Math.random() - 0.5) * step * 0.7;
  const turns = 5 + Math.floor(Math.random() * 2);

  return Math.ceil(current / 360) * 360 + turns * 360 + ((((360 - local) % 360) + 360) % 360);
};

/** Casilla que queda bajo el puntero cuando la ruleta está girada `rotation` grados. */
export const wedgeAt = (rotation: number, count: number) => {
  const local = (((-rotation % 360) + 360) % 360) / (360 / count);

  return Math.floor(local) % count;
};
