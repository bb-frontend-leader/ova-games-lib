export type RouletteSpecial = 'joker' | 'double';

export interface RouletteAnswer {
  /** Texto de la respuesta. Admite HTML básico (`<strong>`, `<em>`). */
  label: string;
  state: 'success' | 'wrong';
}

export interface RouletteQuestion {
  /** Identificador estable: la página lo recibe en `onResult` y la ruleta lo usa para recordar los fallos. */
  id: string;
  /** Tema de la casilla: se escribe sobre la ruleta (si falta, solo se ve el número). */
  category?: string;
  /** Enunciado. Admite HTML básico (`<strong>`, `<em>`), como en los demás juegos. */
  question: string;
  answers: RouletteAnswer[];
}

export interface RouletteResult {
  result: boolean;
  question: string;
  /** Puntos ganados con esta respuesta (0 si falló). */
  points: number;
  /** Racha de aciertos seguidos tras esta respuesta. */
  streak: number;
  /** Cuántas veces se ha respondido esta pregunta, contando esta. */
  attempts: number;
}

export interface RouletteSummary {
  score: number;
  total: number;
  /** Preguntas acertadas en el primer intento. */
  firstTry: number;
  bestStreak: number;
  /** Respuestas comprobadas en total (aciertos y fallos). */
  attempts: number;
}

export type Phase = 'idle' | 'spinning' | 'question' | 'checked' | 'done';

export type WedgeKind = 'question' | RouletteSpecial;

export interface Wedge {
  id: string;
  kind: WedgeKind;
  /** Posición de la pregunta en `questions` (-1 en las casillas especiales). */
  index: number;
}

export type WedgeState = 'pending' | 'solved' | 'review' | 'spent';

export interface WedgeView {
  id: string;
  kind: WedgeKind;
  state: WedgeState;
  /** Número visible de la pregunta (casillas de pregunta). */
  number?: number;
  label?: string;
  bg: string;
  ink: string;
}

export interface Verdict {
  ok: boolean;
  points: number;
  base: number;
  bonus: number;
  doubled: boolean;
  halved: boolean;
}

export interface State {
  phase: Phase;
  landed: number | null;
  /** Orden en que se muestran las respuestas de la pregunta actual (índices de `answers`). */
  order: number[];
  selected: number | null;
  /** Respuestas que eliminó el comodín 50:50 en la pregunta actual. */
  hidden: number[];
  jokerUsed: boolean;
  solved: string[];
  spent: string[];
  fails: Record<string, number>;
  /** Respuestas ya intentadas (y falladas) por pregunta: al volver la casilla quedan descartadas. */
  discarded: Record<string, number[]>;
  score: number;
  streak: number;
  bestStreak: number;
  jokers: number;
  doubleArmed: boolean;
  firstTry: number;
  attempts: number;
  last: Verdict | null;
  notice: string;
}
