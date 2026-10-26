export interface CometaAnswer {
  /** Texto de la respuesta. Admite HTML básico (`<strong>`, `<em>`). */
  label: string;
  state: 'success' | 'wrong';
}

export interface CometaQuestion {
  /** Identificador estable: la página lo recibe en `onResult` y el juego lo usa para recordar los fallos. */
  id: string;
  /** Enunciado. Admite HTML básico (`<strong>`, `<em>`), como en los demás juegos. */
  question: string;
  answers: CometaAnswer[];
}

export interface CometaResult {
  result: boolean;
  /** Id de la pregunta respondida. */
  question: string;
  /** Racha de aciertos seguidos tras esta respuesta. */
  streak: number;
  /** Cuántas veces se ha respondido esta pregunta, contando esta. */
  attempts: number;
  /** Puntos ganados con esta respuesta. */
  points: number;
}

export interface CometaSummary {
  score: number;
  total: number;
  /** Preguntas acertadas en el primer intento (cada una añade un lazo a la cola). */
  firstTry: number;
  bestStreak: number;
  /** Respuestas comprobadas en total (aciertos y fallos). */
  attempts: number;
  /** Veces que el viento hizo perder altura y veces que el carrete de reserva lo evitó. */
  falls: number;
  saves: number;
  /** Posición en el festival, de 1 (campeona) a 4, según los aciertos a la primera. */
  rank: 1 | 2 | 3 | 4;
}

export type Phase = 'question' | 'checked' | 'done';

export interface Verdict {
  ok: boolean;
  firstTry: boolean;
  points: number;
  /** La racha de aciertos dio un carrete de reserva. */
  spool: boolean;
  /** Fallo en el que el carrete de reserva evitó perder altura. */
  saved: boolean;
}

export interface State {
  phase: Phase;
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
  /** Veces que se perdió altura y veces que el carrete de reserva lo evitó. */
  falls: number;
  saves: number;
  /** Carretes de reserva que se tienen. */
  spool: number;
  /** Altura perdida por el viento (0 o 1): se recupera al acertar la pregunta. */
  dip: number;
  last: Verdict | null;
  notice: string;
}
