export interface JeopardyAnswer {
  /** Texto de la respuesta. Admite HTML básico (`<strong>`, `<em>`). */
  label: string;
  state: 'success' | 'wrong';
}

export interface JeopardyQuestion {
  /** Identificador estable y único en todo el tablero: la página lo recibe en `onResult`. */
  id: string;
  /** Puntos de la casilla (por defecto 100 × su posición en la categoría: 100, 200, 300…). */
  points?: number;
  /** Enunciado. Admite HTML básico (`<strong>`, `<em>`), como en los demás juegos. */
  question: string;
  answers: JeopardyAnswer[];
}

export interface JeopardyCategory {
  id: string;
  title: string;
  /** De la más fácil a la más difícil: la primera es la casilla de menos puntos. */
  questions: JeopardyQuestion[];
}

export interface JeopardyResult {
  result: boolean;
  /** Id de la pregunta. */
  question: string;
  /** Id de su categoría. */
  category: string;
  /** Puntos que cambian con esta respuesta: positivos al acertar y negativos si falla una apuesta doble. */
  points: number;
  /** Racha de aciertos seguidos tras esta respuesta. */
  streak: number;
  /** Cuántas veces se ha respondido esta pregunta, contando esta. */
  attempts: number;
  /** Multiplicador apostado (1-3) si era la casilla de apuesta doble. */
  wager: number | null;
}

export interface JeopardySummary {
  score: number;
  total: number;
  /** Preguntas acertadas en el primer intento. */
  firstTry: number;
  bestStreak: number;
  /** Respuestas comprobadas en total (aciertos y fallos). */
  attempts: number;
}

export type Phase = 'board' | 'wager' | 'question' | 'checked' | 'done';

export type CellState = 'pending' | 'solved' | 'review';

/** Una casilla del tablero, ya con sus puntos y su categoría. */
export interface Cell {
  id: string;
  /** Posición de la categoría y de la pregunta dentro de ella. */
  c: number;
  q: number;
  categoryId: string;
  category: string;
  points: number;
  question: JeopardyQuestion;
}

export interface Verdict {
  ok: boolean;
  points: number;
  base: number;
  bonus: number;
  halved: boolean;
  /** Era una casilla repetida tras un fallo (vale la mitad). */
  retry: boolean;
  wager: number | null;
}

export interface State {
  phase: Phase;
  /** Casilla abierta (se conserva al volver al tablero para devolver el foco). */
  currentId: string | null;
  /** Casillas con apuesta doble que aún no se abrieron. */
  doubles: string[];
  /** La casilla abierta es una apuesta doble. */
  isDouble: boolean;
  wager: number | null;
  /** Orden en que se muestran las respuestas de la pregunta actual (índices de `answers`). */
  order: number[];
  selected: number | null;
  /** Respuestas que eliminó el comodín 50:50 en la pregunta actual. */
  hidden: number[];
  jokerUsed: boolean;
  solved: string[];
  fails: Record<string, number>;
  /** Respuestas ya falladas por pregunta: al reabrir la casilla quedan descartadas. */
  discarded: Record<string, number[]>;
  score: number;
  streak: number;
  bestStreak: number;
  lifelines: number;
  firstTry: number;
  attempts: number;
  last: Verdict | null;
  notice: string;
}
