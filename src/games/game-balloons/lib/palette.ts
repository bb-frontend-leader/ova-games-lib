/**
 * Colores dominantes de cada globo de `BALLONS` (mismo orden): tiñen el resplandor detrás del globo y los
 * fragmentos que saltan al explotarlo.
 */
export const BALLOON_COLORS = [
  ['#f4c430', '#2b6cb0'],
  ['#3aa655', '#e8d52e'],
  ['#e84c93', '#ffffff'],
  ['#8e4cb0', '#2f95cf'],
  ['#e5463a', '#f2b23a'],
  ['#3f9fdc', '#ffffff'],
  ['#e03a3a', '#94b83c']
] as const;

/** Colores de la celebración al armar bien la frase. */
export const CONFETTI_COLORS = ['#ffffff', '#f4c430', '#aaca4b', ...BALLOON_COLORS.map(([primary]) => primary)];

/** Colores del destello cuando una palabra aterriza en su espacio (café y crema de las placas). */
export const LAND_COLORS = ['#bf6f42', '#ffe2ad', '#f4c430'];

/** Color de las ondas expansivas (el café del borde de las placas). */
export const RING_COLOR = '#bf6f42';

export const colorsOf = (role: number) => BALLOON_COLORS[role % BALLOON_COLORS.length];

/** Recortes de los fragmentos de la explosión: rombo y triángulos. */
export const SHARD_SHAPES = [
  'polygon(50% 0, 100% 100%, 0 100%)',
  'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)',
  'polygon(0 0, 100% 25%, 65% 100%)'
];
