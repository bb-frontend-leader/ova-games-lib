import type { Color, Option, Piece, Roll, Side } from '../types/types';

/**
 * Geometría del tablero en forma de cruz. Todo se mide en casillas: el tablero es una rejilla de `SIZE x SIZE`, cada
 * brazo mide `ARM` casillas de largo y 3 de ancho, y el centro es un bloque de 3 x 3 (el cielo).
 */
export const ARM = 4;
export const SIZE = 2 * ARM + 3;
/** Casilla central (la del medio de cada brazo). */
export const MID = ARM + 1;
/** Fichas por jugador. */
export const PIECES = 2;

export interface Point {
  x: number;
  y: number;
}

/**
 * El circuito: las casillas de los carriles exteriores de los cuatro brazos, en el sentido de las agujas del reloj y
 * empezando por la punta del brazo de arriba.
 */
const WAYPOINTS: [number, number][] = [
  [MID, 0],
  [MID + 1, 0],
  [MID + 1, ARM],
  [SIZE - 1, ARM],
  [SIZE - 1, MID],
  [SIZE - 1, MID + 1],
  [MID + 1, MID + 1],
  [MID + 1, SIZE - 1],
  [MID, SIZE - 1],
  [ARM, SIZE - 1],
  [ARM, MID + 1],
  [0, MID + 1],
  [0, MID],
  [0, ARM],
  [ARM, ARM],
  [ARM, 0]
];

const buildRing = (): Point[] =>
  WAYPOINTS.flatMap(([x0, y0], k) => {
    const [x1, y1] = WAYPOINTS[(k + 1) % WAYPOINTS.length];
    const steps = Math.abs(x1 - x0) + Math.abs(y1 - y0);

    return Array.from({ length: steps }, (_, s) => ({
      x: x0 + Math.sign(x1 - x0) * s,
      y: y0 + Math.sign(y1 - y0) * s
    }));
  });

export const RING = buildRing();
/** Casillas del circuito. */
export const N = RING.length;
/** Casillas del pasillo de color antes del cielo. */
export const LANE = ARM - 1;
/** Último paso del camino de una ficha: el cielo. */
export const HOME = N + LANE;

/** Los cuatro colores de la mesa: dos juegan (amarillo y rojo) y los otros dos solo adornan. */
export const COLORS: Color[] = ['red', 'green', 'yellow', 'blue'];

/** Casilla del circuito donde sale cada color: está a un cuarto de vuelta de la anterior. */
export const START: Record<Color, number> = { red: 1, green: 1 + N / 4, yellow: 1 + N / 2, blue: 1 + (3 * N) / 4 };

export const COLOR_OF: Record<Side, Color> = { you: 'yellow', rival: 'red' };

/** Casillas seguras del circuito: las cuatro salidas y las cuatro esquinas interiores. Ahí nadie puede ser capturado. */
export const SAFE = new Set<number>([
  ...COLORS.map((c) => START[c]),
  ...[
    [MID + 1, ARM],
    [MID + 1, MID + 1],
    [ARM, MID + 1],
    [ARM, ARM]
  ].map(([x, y]) => RING.findIndex((c) => c.x === x && c.y === y))
]);

/** Índice en el circuito de la casilla en la que está una ficha (null si está en la cárcel, el pasillo o el cielo). */
export const ringIndex = (side: Side, p: number): number | null =>
  p >= 0 && p < N ? (START[COLOR_OF[side]] + p) % N : null;

export const isSafe = (side: Side, p: number) => {
  const idx = ringIndex(side, p);

  return idx !== null && SAFE.has(idx);
};

/** Centro de la cárcel de cada color (esquina del tablero junto a su brazo). */
const HOUSES: Record<Color, Point> = {
  red: { x: SIZE - ARM / 2, y: ARM / 2 },
  green: { x: SIZE - ARM / 2, y: SIZE - ARM / 2 },
  yellow: { x: ARM / 2, y: SIZE - ARM / 2 },
  blue: { x: ARM / 2, y: ARM / 2 }
};

/** Esquina superior izquierda (en casillas) de la cárcel de cada color. */
export const houseOrigin = (color: Color): Point => ({
  x: HOUSES[color].x - ARM / 2,
  y: HOUSES[color].y - ARM / 2
});

/** Hueco de la ficha `n` dentro de su cárcel: en fila para dos fichas, en cuadrícula para más. */
export const slotIn = (color: Color, n: number): Point => {
  const cols = Math.min(PIECES, 2);
  const rows = Math.ceil(PIECES / 2);
  const gap = 1.5;

  return {
    x: HOUSES[color].x + ((n % cols) - (cols - 1) / 2) * gap,
    y: HOUSES[color].y + (Math.floor(n / cols) - (rows - 1) / 2) * gap
  };
};

/** Centro, en casillas, del paso `p` del camino de una ficha. */
export const pointOf = (side: Side, p: number, n: number): Point => {
  const color = COLOR_OF[side];

  if (p < 0) return slotIn(color, n);

  if (p < N) {
    const cell = RING[(START[color] + p) % N];

    return { x: cell.x + 0.5, y: cell.y + 0.5 };
  }

  // Pasillo de color hacia el centro; el cielo es el triángulo de su color en el bloque central
  const k = p - N;

  if (p < HOME) return { x: MID + 0.5, y: side === 'you' ? SIZE - 1.5 - k : 1.5 + k };

  return { x: MID + 0.5, y: side === 'you' ? MID + 1.2 : MID - 0.2 };
};

export const hasFive = ({ a, b }: Roll) => a === 5 || b === 5 || a + b === 5;
export const isPair = ({ a, b }: Roll) => a === b;
export const rollDie = () => 1 + Math.floor(Math.random() * 6);

/** Fichas del rival (índices) que hay en la casilla del circuito donde cae la ficha, si no es segura. */
const capturedBy = (pieces: Piece[], mover: Piece, to: number): number[] => {
  const idx = ringIndex(mover.side, to);

  if (idx === null || SAFE.has(idx)) return [];

  return pieces.flatMap((other, k) => (other.side !== mover.side && ringIndex(other.side, other.p) === idx ? [k] : []));
};

/** Todas las jugadas que permite la tirada a un lado. Salir de la cárcel pide un 5 en un dado o una suma de 5. */
export const optionsOf = (pieces: Piece[], side: Side, roll: Roll): Option[] =>
  pieces.flatMap<Option>((piece, k) => {
    if (piece.side !== side || piece.p >= HOME) return [];

    if (piece.p < 0) {
      return hasFive(roll) ? [{ piece: k, to: 0, exit: true, captures: [], home: false }] : [];
    }

    const to = Math.min(piece.p + roll.a + roll.b, HOME);

    return [{ piece: k, to, exit: false, captures: capturedBy(pieces, piece, to), home: to === HOME }];
  });

/** Aplica una jugada: la ficha llega a su casilla y las capturadas vuelven a la cárcel. */
export const applyOption = (pieces: Piece[], option: Option): Piece[] =>
  pieces.map((piece, k) =>
    k === option.piece ? { ...piece, p: option.to } : option.captures.includes(k) ? { ...piece, p: -1 } : piece
  );

/** Casillas del circuito que quedan por delante de `from` hasta `to` (en el sentido de la marcha). */
const ahead = (from: number, to: number) => (to - from + N) % N;

/**
 * Qué jugada elige el rival: captura > cielo > salir de la cárcel > casilla segura > avanzar, y evita caer a menos de
 * una tirada de una ficha del jugador. Con probabilidad `blunder` elige una jugada cualquiera.
 */
export const pickOption = (pieces: Piece[], options: Option[], blunder = 0): Option => {
  // A veces se equivoca y juega al azar: así el rival es un adversario y no un muro
  if (options.length > 1 && Math.random() < blunder) return options[Math.floor(Math.random() * options.length)];

  const hunters = pieces.flatMap((p) => (p.side === 'you' ? [ringIndex('you', p.p)] : [])).filter((i) => i !== null);

  const score = (option: Option) => {
    const piece = pieces[option.piece];
    const idx = ringIndex(piece.side, option.to);
    const exposed =
      idx !== null &&
      !SAFE.has(idx) &&
      hunters.some((h) => ahead(h as number, idx) >= 1 && ahead(h as number, idx) <= 12);

    return (
      option.captures.length * 100 +
      (option.home ? 80 : 0) +
      (option.exit ? 60 : 0) +
      (idx !== null && SAFE.has(idx) ? 25 : 0) +
      (option.to >= N ? 15 : 0) +
      option.to * 0.3 -
      (exposed ? 18 : 0)
    );
  };

  return options.reduce((best, option) => (score(option) > score(best) ? option : best));
};

/** Cuánto ha avanzado un lado: las fichas del cielo valen mucho más que las del camino. */
export const standing = (pieces: Piece[], side: Side) =>
  pieces.reduce((sum, piece) => (piece.side !== side ? sum : sum + (piece.p >= HOME ? 100 : piece.p + 1)), 0);

export const homeCount = (pieces: Piece[], side: Side) =>
  pieces.filter((piece) => piece.side === side && piece.p >= HOME).length;

export const canMove = (pieces: Piece[], side: Side) => pieces.some((piece) => piece.side === side && piece.p < HOME);

export const newPieces = (): Piece[] =>
  (['you', 'rival'] as const).flatMap((side) => Array.from({ length: PIECES }, (_, n) => ({ side, n, p: -1 })));

/** Posición de una ficha en % del tablero (las coordenadas van de 0 a `SIZE`). */
export const percentOf = (point: Point) => ({
  left: `${(point.x / SIZE) * 100}%`,
  top: `${(point.y / SIZE) * 100}%`
});

/** Casillas por las que pasa una ficha al ir de `from` a `to` (sin contar la de partida). */
export const stepsBetween = (from: number, to: number) =>
  Array.from({ length: Math.max(0, to - Math.max(from, 0)) }, (_, k) => Math.max(from, 0) + k + 1);
