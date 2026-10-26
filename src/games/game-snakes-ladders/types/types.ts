export interface SnakesAnswer {
  /** Texto de la respuesta. Admite HTML básico (`<strong>`, `<em>`). */
  label: string;
  state: 'success' | 'wrong';
}

export interface SnakesQuestion {
  /** Identificador estable: la página lo recibe en `onResult` y el juego lo usa para recordar los fallos. */
  id: string;
  /** Enunciado. Admite HTML básico (`<strong>`, `<em>`), como en los demás juegos. */
  question: string;
  answers: SnakesAnswer[];
}

export interface SnakesResult {
  result: boolean;
  /** Id de la pregunta respondida. */
  question: string;
  /** Racha de aciertos seguidos tras esta respuesta. */
  streak: number;
  /** Cuántas veces se ha respondido esta pregunta, contando esta. */
  attempts: number;
  /** Puntos ganados con esta respuesta (sin contar los de las casillas). */
  points: number;
}

export interface SnakesSummary {
  score: number;
  total: number;
  /** Preguntas acertadas en el primer intento. */
  firstTry: number;
  bestStreak: number;
  /** Respuestas comprobadas en total (aciertos y fallos). */
  attempts: number;
  /** Tiradas de dado, escaleras subidas, serpientes que mordieron y mordiscos que frenó el escudo. */
  rolls: number;
  ladders: number;
  snakes: number;
  shields: number;
}

/**
 * Casillas del tablero. `ladder` es el pie de una escalera (sube) y `snake` la cabeza de una serpiente (baja);
 * el resto no tienen efecto.
 */
export type CellKind = 'start' | 'goal' | 'plain' | 'ladder' | 'snake';

export type LinkKind = 'ladder' | 'snake';

/** Una escalera (de `from` sube a `to`) o una serpiente (de `from`, la cabeza, baja a `to`, la cola). */
export interface Link {
  kind: LinkKind;
  from: number;
  to: number;
}

export type Phase = 'question' | 'checked' | 'roll' | 'rolling' | 'moving' | 'stop' | 'done';

export interface Verdict {
  ok: boolean;
  firstTry: boolean;
  points: number;
  /** La racha de tres da un escudo. */
  shield: boolean;
  /** Es la última pregunta: la ficha avanza sola hasta la meta. */
  last: boolean;
}

/**
 * Movimiento de la ficha: `hop` va casilla a casilla (dado), `climb` y `slide` van de golpe por una escalera o una
 * serpiente, y `final` lleva hasta la meta.
 */
export interface Motion {
  /** Cambia con cada movimiento, para no resolverlo dos veces. */
  id: number;
  kind: 'hop' | 'climb' | 'slide' | 'final';
  from: number;
  to: number;
  /** Casilla en la que rebota si el dado se pasa de la anterior a la meta (null si no rebota): luego vuelve hasta `to`. */
  peak: number | null;
  /** Tras este movimiento (y lo que pase en su casilla) se tira otra vez sin pregunta: salió un 6. */
  again: boolean;
}

/** Parada en una escalera, una serpiente, el rebote o la meta: qué ha pasado y a dónde llevará el botón. */
export interface Stop {
  kind: LinkKind | 'shield' | 'bounce' | 'final';
  /** Casilla en la que se está parado. */
  at: number;
  /** Casilla a la que lleva «Seguir» (si hay movimiento). */
  to: number | null;
  /** Puntos que da la casilla. */
  points: number;
  /** Con `true`, al seguir hay otra tirada extra sin pregunta. */
  again: boolean;
}

export interface State {
  phase: Phase;
  /** Cola de preguntas (índices en `questions`): la primera es la actual. */
  queue: number[];
  order: number[];
  selected: number | null;
  /** Casilla en la que está la ficha (0 = salida). */
  pos: number;
  solved: string[];
  seen: string[];
  fails: Record<string, number>;
  discarded: Record<string, number[]>;
  score: number;
  streak: number;
  bestStreak: number;
  firstTry: number;
  attempts: number;
  rolls: number;
  ladders: number;
  snakes: number;
  shields: number;
  /** Escudo disponible (0 o 1): la próxima serpiente no muerde. */
  shield: number;
  /** Tirada extra gratis pendiente (por un 6): se tira sin responder una pregunta. */
  bonus: boolean;
  /** Último valor del dado. */
  die: number;
  /** Cambia con cada tirada, para que la animación se repita aunque salga el mismo número. */
  dieKey: number;
  last: Verdict | null;
  motion: Motion | null;
  stop: Stop | null;
  moves: number;
  notice: string;
}
