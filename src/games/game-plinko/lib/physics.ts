/**
 * Física del Plinko. Se simula la caída completa de una ficha en cuanto se suelta (es instantáneo) y después el
 * dibujo solo reproduce las posiciones a 60 fps. Así el premio ya está decidido antes de animar, no depende del
 * rendimiento del equipo y con movimiento reducido basta con saltar al último fotograma.
 */

/** Tamaño del tablero (`viewBox`). */
export const W = 400;
export const H = 500;

export const BALL_R = 8;
export const PEG_R = 4;
/** Altura desde la que cae la ficha. */
export const START_Y = 30;

const ROWS = 9;
const ROW_GAP = 38;
const FIRST_ROW_Y = 90;
const FLOOR = H - 12;
const GRAVITY = 900;
const BOUNCE = 0.5;
/** Arrastre horizontal (por segundo) y fricción de los clavos: sin ellos la ficha conserva su impulso y el reparto sale plano. */
const DRAG = 3;
const FRICTION = 0.3;
const SUBSTEPS = 4;
const FPS = 60;
const MAX_FRAMES = FPS * 25;
const DIVIDER_HALF = 1.5;

export interface Peg {
  x: number;
  y: number;
  r: number;
}

export interface Layout {
  slots: number;
  slotW: number;
  /** Altura a la que empiezan las casillas del fondo. */
  slotTop: number;
  floor: number;
  pegs: Peg[];
}

export interface Hit {
  frame: number;
  peg: number;
}

export interface Sim {
  /** x, y de cada fotograma a 60 fps, intercalados. */
  frames: number[];
  hits: Hit[];
  slot: number;
}

/**
 * Clavos en filas alternas: unas sobre las divisiones de las casillas y otras sobre su centro, de modo que la
 * ficha siempre tiene dos caminos. Las divisiones también cuentan como clavos en su borde superior.
 */
export const buildLayout = (slots: number): Layout => {
  const slotW = W / slots;
  const slotTop = FIRST_ROW_Y + (ROWS - 1) * ROW_GAP + 30;
  const pegs: Peg[] = [];

  for (let row = 0; row < ROWS; row++) {
    const y = FIRST_ROW_Y + row * ROW_GAP;

    if (row % 2 === 0) {
      for (let k = 1; k < slots; k++) pegs.push({ x: k * slotW, y, r: PEG_R });
    } else {
      for (let k = 0; k < slots; k++) pegs.push({ x: (k + 0.5) * slotW, y, r: PEG_R });
    }
  }

  // Las puntas de las divisiones van al final: sus índices no se dibujan como clavos
  for (let k = 1; k < slots; k++) pegs.push({ x: k * slotW, y: slotTop, r: 3 });

  return { slots, slotW, slotTop, floor: FLOOR, pegs };
};

/** Cuántos clavos se dibujan (los demás son las puntas de las divisiones). */
export const drawnPegs = (layout: Layout) => layout.pegs.length - (layout.slots - 1);

/**
 * Casillas desde las que se puede soltar la ficha: se dejan fuera los extremos para que los premios de los bordes
 * dependan sobre todo de la suerte (apuntando al borde, la ficha caería casi siempre ahí).
 */
export const aimRange = (layout: Layout) => {
  const margin = Math.max(0, Math.floor((layout.slots - 1) / 4));

  return { min: margin, max: layout.slots - 1 - margin };
};

/** Centro de la casilla `slot` en el eje x. */
export const slotCenter = (layout: Layout, slot: number) => (slot + 0.5) * layout.slotW;

/**
 * Deja caer una ficha desde `startX` y devuelve su recorrido y la casilla en que se detiene.
 */
export const simulate = (layout: Layout, startX: number, random: () => number = Math.random): Sim => {
  const { slotW, slotTop, floor, slots, pegs } = layout;
  const dt = 1 / FPS / SUBSTEPS;
  const frames: number[] = [startX, START_Y];
  const hits: Hit[] = [];

  let x = startX;
  let y = START_Y;
  let vx = (random() - 0.5) * 30;
  let vy = 0;

  for (let frame = 1; frame < MAX_FRAMES; frame++) {
    for (let s = 0; s < SUBSTEPS; s++) {
      vy += GRAVITY * dt;
      vx -= vx * DRAG * dt;
      x += vx * dt;
      y += vy * dt;

      if (x < BALL_R) {
        x = BALL_R;
        vx = Math.abs(vx) * BOUNCE;
      } else if (x > W - BALL_R) {
        x = W - BALL_R;
        vx = -Math.abs(vx) * BOUNCE;
      }

      // Las divisiones del fondo son paredes
      if (y > slotTop) {
        for (let k = 1; k < slots; k++) {
          const dx = x - k * slotW;

          if (Math.abs(dx) < BALL_R + DIVIDER_HALF) {
            const side = dx === 0 ? (random() < 0.5 ? -1 : 1) : Math.sign(dx);

            x = k * slotW + side * (BALL_R + DIVIDER_HALF);
            vx = side * Math.abs(vx) * BOUNCE;
          }
        }
      }

      for (let i = 0; i < pegs.length; i++) {
        const peg = pegs[i];
        const dx = x - peg.x;
        const dy = y - peg.y;
        const min = BALL_R + peg.r;

        if (dx * dx + dy * dy >= min * min) continue;

        const d = Math.sqrt(dx * dx + dy * dy) || 0.001;
        const nx = dx / d;
        const ny = dy / d;
        const vn = vx * nx + vy * ny;

        x = peg.x + nx * min;
        y = peg.y + ny * min;

        if (vn >= 0) continue;

        vx -= (1 + BOUNCE) * vn * nx;
        vy -= (1 + BOUNCE) * vn * ny;

        const tangent = -vx * ny + vy * nx;

        vx += tangent * FRICTION * ny;
        vy -= tangent * FRICTION * nx;

        // Un poco de azar en cada rebote; y si la ficha se queda sobre la punta de un clavo, se desliza
        const turn = (random() - 0.5) * 0.3;
        const cos = Math.cos(turn);
        const sin = Math.sin(turn);
        const rx = vx * cos - vy * sin;

        vy = vx * sin + vy * cos;
        vx = rx;

        if (ny < -0.9 && Math.hypot(vx, vy) < 60) vx += (random() < 0.5 ? -1 : 1) * (40 + random() * 40);

        hits.push({ frame, peg: i });
      }
    }

    frames.push(x, y);

    if (y >= floor - BALL_R) break;
  }

  const slot = Math.min(slots - 1, Math.max(0, Math.floor(x / slotW)));

  return { frames, hits, slot };
};

/** Número de fotogramas de un recorrido. */
export const frameCount = (sim: Sim) => sim.frames.length / 2;

/** Fotogramas por segundo de la reproducción. */
export const PLAYBACK_FPS = FPS;
