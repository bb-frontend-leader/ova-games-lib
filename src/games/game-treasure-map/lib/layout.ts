/** Puntos del mapa en coordenadas unitarias (0-1 en cada eje, el origen arriba a la izquierda). */
export interface Point {
  x: number;
  y: number;
}

export interface MapLayout {
  points: Record<string, Point>;
  edges: [string, string][];
}

export const PORT = 'port';
export const TREASURE = 'treasure';

/**
 * Puerto (abajo a la izquierda) e isla del tesoro (arriba a la derecha): no dependen de las preguntas. `FIXED` es el
 * punto donde atraca el barco; el dibujo del puerto y de la isla va un poco más allá (`PORT_ART`, `TREASURE_ART`).
 */
const FIXED: Record<string, Point> = { [PORT]: { x: 0.16, y: 0.9 }, [TREASURE]: { x: 0.855, y: 0.24 } };
export const PORT_ART: Point = { x: 0.07, y: 0.84 };
export const TREASURE_ART: Point = { x: 0.925, y: 0.115 };

/** Zona del mapa donde caben las islas: deja libres las esquinas del puerto y del tesoro. */
const AREA = { x0: 0.18, x1: 0.82, y0: 0.15, y1: 0.85 };

const hash = (text: string) => {
  let h = 2166136261;

  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }

  return h >>> 0;
};

/** Sentido (±1) en que se curva una ruta, fijo por ruta. */
const hashSign = (text: string) => (hash(text) % 2 ? 1 : -1);

/** Generador pseudoaleatorio con semilla: el mapa de unas mismas preguntas siempre sale igual. */
const seeded = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);

  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;

  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const shuffle = <T>(items: T[], rand: () => number) => {
  const out = [...items];

  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));

    [out[i], out[j]] = [out[j], out[i]];
  }

  return out;
};

const ccw = (a: Point, b: Point, c: Point) => (c.y - a.y) * (b.x - a.x) > (b.y - a.y) * (c.x - a.x);
const crosses = (a: Point, b: Point, c: Point, d: Point) =>
  ccw(a, c, d) !== ccw(b, c, d) && ccw(a, b, c) !== ccw(a, b, d);

/**
 * Reparte las islas en una cuadrícula con holgura (según la proporción del mapa, ancho o estrecho) y las une con
 * rutas: un árbol que conecta todo desde el puerto más algunas rutas extra entre vecinas que no cruzan a otras.
 */
export const buildLayout = (ids: string[], wide: boolean): MapLayout => {
  const rand = seeded(hash(ids.join('|')));
  const n = ids.length;
  const aspect = wide ? 16 / 9 : 3 / 5;
  // Columnas que dejan las celdas más holgadas: cada isla con su nombre ocupa algo más de ancho que de alto
  let cols = 1;
  let roomiest = -1;

  for (let c = 1; c <= Math.max(1, n); c++) {
    const room = Math.min(((AREA.x1 - AREA.x0) * aspect) / c / 1.3, (AREA.y1 - AREA.y0) / Math.ceil(n / c));

    if (room > roomiest) {
      roomiest = room;
      cols = c;
    }
  }

  const rows = Math.max(1, Math.ceil(n / cols));
  const cells = shuffle(
    Array.from({ length: cols * rows }, (_, k) => k),
    rand
  ).slice(0, n);
  const order = shuffle(ids, rand);

  const points: Record<string, Point> = { ...FIXED };

  order.forEach((id, k) => {
    const col = cells[k] % cols;
    const row = Math.floor(cells[k] / cols);

    points[id] = {
      x: AREA.x0 + ((col + 0.5 + (rand() - 0.5) * 0.14) / cols) * (AREA.x1 - AREA.x0),
      y: AREA.y0 + ((row + 0.5 + (rand() - 0.5) * 0.3) / rows) * (AREA.y1 - AREA.y0)
    };
  });

  // Distancias con la proporción del mapa, para que «cerca» lo sea también a la vista
  const dist = (a: string, b: string) => Math.hypot((points[a].x - points[b].x) * aspect, points[a].y - points[b].y);
  const nodes = [PORT, ...ids];
  const edges: [string, string][] = [];
  const linked = new Set<string>([PORT]);

  // Árbol mínimo desde el puerto: todas las islas quedan alcanzables
  while (linked.size < nodes.length) {
    let best: [string, string] | null = null;

    for (const a of linked) {
      for (const b of nodes) {
        if (!linked.has(b) && (!best || dist(a, b) < dist(best[0], best[1]))) best = [a, b];
      }
    }

    if (!best) break;

    edges.push(best);
    linked.add(best[1]);
  }

  const has = (a: string, b: string) => edges.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
  const crossesAny = (a: string, b: string) =>
    edges.some(
      ([c, d]) => ![a, b].includes(c) && ![a, b].includes(d) && crosses(points[a], points[b], points[c], points[d])
    );

  // Rutas extra: cada isla se une a su vecina más cercana si aún no lo está, no queda lejos y no cruza otra ruta
  for (const a of nodes) {
    const near = nodes.filter((b) => b !== a && !has(a, b)).sort((p, q) => dist(a, p) - dist(a, q))[0];
    const first = nodes.filter((b) => b !== a).sort((p, q) => dist(a, p) - dist(a, q))[0];

    if (near && first && dist(a, near) <= dist(a, first) * 1.6 && !crossesAny(a, near)) edges.push([a, near]);
  }

  return { points, edges };
};

/** Islas por las que se puede seguir navegando: las no exploradas con una ruta a una explorada (o al puerto). */
export const openIslands = (layout: MapLayout, ids: string[], visited: string[]) => {
  const known = new Set([PORT, ...visited]);

  return ids.filter(
    (id) => !known.has(id) && layout.edges.some(([a, b]) => (a === id && known.has(b)) || (b === id && known.has(a)))
  );
};

/** Posición `t` (0-1) de una ruta curva entre dos puntos del mapa; la curva es la misma en ambos sentidos. */
export const sailPoint = (layout: MapLayout, from: string, to: string, t: number): Point => {
  const forward = from < to;
  const a = layout.points[forward ? from : to];
  const b = layout.points[forward ? to : from];
  const u = forward ? t : 1 - t;
  const bend = hashSign(`${forward ? from : to}>${forward ? to : from}`) * 0.14;
  const cx = (a.x + b.x) / 2 - (b.y - a.y) * bend;
  const cy = (a.y + b.y) / 2 + (b.x - a.x) * bend;

  return {
    x: (1 - u) * (1 - u) * a.x + 2 * (1 - u) * u * cx + u * u * b.x,
    y: (1 - u) * (1 - u) * a.y + 2 * (1 - u) * u * cy + u * u * b.y
  };
};

/** Trazo SVG (en un lienzo de 0-100) de la ruta curva entre dos puntos. */
export const routePath = (layout: MapLayout, from: string, to: string) => {
  const forward = from < to;
  const a = layout.points[forward ? from : to];
  const b = layout.points[forward ? to : from];
  const bend = hashSign(`${forward ? from : to}>${forward ? to : from}`) * 0.14;
  const cx = (a.x + b.x) / 2 - (b.y - a.y) * bend;
  const cy = (a.y + b.y) / 2 + (b.x - a.x) * bend;
  const f = (v: number) => (v * 100).toFixed(2);

  return `M${f(a.x)} ${f(a.y)}Q${f(cx)} ${f(cy)} ${f(b.x)} ${f(b.y)}`;
};

/** Algunas islas esconden un cofre (bono de puntos), siempre las mismas para unas mismas preguntas. */
export const hasChest = (id: string) => (hash(id) >>> 3) % 3 === 0;

/** Aspecto de la isla (palmera, colina o rocas), fijo por isla. */
export const islandKind = (id: string) => (['palm', 'hill', 'rocks'] as const)[(hash(id) >>> 5) % 3];

/** Valoración final de 1 a 4 según la parte de islas conquistadas a la primera. */
export const rankOf = (firstTry: number, total: number) => {
  const ratio = total ? firstTry / total : 0;

  return ratio >= 0.9 ? 1 : ratio >= 0.7 ? 2 : ratio >= 0.5 ? 3 : 4;
};
