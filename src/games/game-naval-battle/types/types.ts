export interface NavalAnswer {
  /** Texto de la respuesta. Admite HTML básico (`<strong>`, `<em>`). */
  label: string;
  state: 'success' | 'wrong';
}

export interface NavalQuestion {
  /** Identificador estable: la página lo recibe en `onResult` y el juego lo usa para recordar los fallos. */
  id: string;
  /** Enunciado. Admite HTML básico (`<strong>`, `<em>`), como en los demás juegos. */
  question: string;
  answers: NavalAnswer[];
}

export interface NavalResult {
  result: boolean;
  /** Id de la pregunta respondida. */
  question: string;
  /** Racha de aciertos seguidos tras esta respuesta. */
  streak: number;
  /** Cuántas veces se ha respondido esta pregunta, contando esta. */
  attempts: number;
  /** Puntos ganados con esta respuesta (sin contar los del disparo). */
  points: number;
}

export interface NavalSummary {
  score: number;
  total: number;
  /** Preguntas acertadas en el primer intento. */
  firstTry: number;
  bestStreak: number;
  /** Respuestas comprobadas en total (aciertos y fallos). */
  attempts: number;
  /** Disparos hechos y los que dieron en un barco. */
  shots: number;
  hits: number;
  shipsSunk: number;
  /** Flotas enteras hundidas (cuando se hunde una, aparece otra). */
  fleetsSunk: number;
}

export type Phase = 'question' | 'checked' | 'aim' | 'firing' | 'shot' | 'done';

/** `water`: sin disparar; `miss`: agua; `hit`: barco tocado; `sunk`: barco hundido. */
export type CellStatus = 'water' | 'miss' | 'hit' | 'sunk';

export interface Cell {
  id: number;
  row: number;
  col: number;
  /** Barco que ocupa la casilla (índice en `ships`), o `null` si es agua. */
  ship: number | null;
  status: CellStatus;
  /** Resultado del sonar en esta casilla: barcos sin tocar en las 9 casillas de alrededor. */
  ping: number | null;
}

export interface Ship {
  id: number;
  size: number;
  cells: number[];
}

export interface Verdict {
  ok: boolean;
  firstTry: boolean;
  points: number;
  /** Ganó una carga de sonar por la racha. */
  sonar: boolean;
}

/** Lo que pasó con el último disparo. */
export interface Shot {
  /** Cambia con cada disparo: así los efectos se repiten. */
  n: number;
  id: number;
  kind: 'miss' | 'hit' | 'sunk';
  /** Tamaño del barco hundido (solo con `sunk`). */
  size: number;
  points: number;
  /** Con este disparo quedó hundida toda la flota. */
  fleet: boolean;
  /** Tocar un barco da otro disparo. */
  again: boolean;
}

/** Lo último que pasó con el sonar. */
export interface Ping {
  n: number;
  id: number;
  near: number;
}

export interface State {
  phase: Phase;
  cells: Cell[];
  ships: Ship[];
  /** Preguntas en el orden en que salen (índices de `questions`) y cuál toca. */
  queue: number[];
  at: number;
  /** Orden en que se muestran las respuestas de la pregunta actual (índices de `answers`). */
  order: number[];
  selected: number | null;
  solved: string[];
  fails: Record<string, number>;
  /** Respuestas ya falladas por pregunta: al reintentar quedan descartadas. */
  discarded: Record<string, number[]>;
  score: number;
  streak: number;
  bestStreak: number;
  firstTry: number;
  attempts: number;
  shots: number;
  hits: number;
  shipsSunk: number;
  fleetsSunk: number;
  /** Cargas de sonar y si el próximo toque en el campo lo usa. */
  sonar: number;
  pingMode: boolean;
  last: Verdict | null;
  shot: Shot | null;
  ping: Ping | null;
  /** Casilla a la que vuela el proyectil mientras dura el disparo. */
  target: number | null;
  notice: string;
}
