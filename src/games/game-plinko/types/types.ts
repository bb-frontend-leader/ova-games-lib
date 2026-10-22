export interface PlinkoAnswer {
  /** Texto de la respuesta. Admite HTML básico (`<strong>`, `<em>`). */
  label: string;
  state: 'success' | 'wrong';
}

export interface PlinkoQuestion {
  /** Identificador estable: la página lo recibe en `onResult` y el juego lo usa para recordar los fallos. */
  id: string;
  /** Enunciado. Admite HTML básico (`<strong>`, `<em>`), como en los demás juegos. */
  question: string;
  answers: PlinkoAnswer[];
}

/** Premio de una casilla del fondo: puntos, o `'bonus'` para ganar una ficha extra. */
export type PlinkoPrize = number | 'bonus';

export interface PlinkoResult {
  result: boolean;
  question: string;
  /** Racha de aciertos seguidos tras esta respuesta. */
  streak: number;
  /** Cuántas veces se ha respondido esta pregunta, contando esta. */
  attempts: number;
}

export interface PlinkoSummary {
  score: number;
  total: number;
  /** Preguntas acertadas en el primer intento. */
  firstTry: number;
  bestStreak: number;
  /** Respuestas comprobadas en total (aciertos y fallos). */
  attempts: number;
  /** Fichas que se soltaron. */
  balls: number;
  /** Mayor premio ganado con una sola ficha (ya con el doble de la dorada). */
  bestPrize: number;
}

export type Phase = 'question' | 'checked' | 'aim' | 'dropping' | 'landed' | 'done';

/** Una ficha dorada (por acertar a la primera) duplica su premio. */
export type BallKind = 'gold' | 'normal';

export interface Verdict {
  ok: boolean;
  /** Acertó a la primera (la ficha que gana es dorada). */
  firstTry: boolean;
}

export interface Drop {
  slot: number;
  prize: PlinkoPrize;
  points: number;
  kind: BallKind;
}

export interface State {
  phase: Phase;
  /** Pregunta que se está jugando (índice en `questions`). */
  index: number;
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
  /** Fichas ganadas y todavía sin soltar, en el orden en que se soltarán. */
  queue: BallKind[];
  /** Posición (0 a n-1) desde la que se suelta la ficha. */
  aim: number;
  /** Cambia con cada ficha: así su dibujo se monta de nuevo. */
  dropId: number;
  balls: number;
  bestPrize: number;
  last: Verdict | null;
  drop: Drop | null;
  notice: string;
}
