export interface TreasureAnswer {
  /** Texto de la respuesta. Admite HTML básico (`<strong>`, `<em>`). */
  label: string;
  state: 'success' | 'wrong';
}

export interface TreasureQuestion {
  /** Identificador estable: la página lo recibe en `onResult` y el juego lo usa para recordar los fallos. */
  id: string;
  /** Enunciado. Admite HTML básico (`<strong>`, `<em>`), como en los demás juegos. */
  question: string;
  /** De 2 a 5 respuestas, una correcta. */
  answers: TreasureAnswer[];
}

export interface TreasureResult {
  result: boolean;
  /** Id de la pregunta respondida (la de la isla). */
  question: string;
  /** Racha de aciertos seguidos tras esta respuesta. */
  streak: number;
  /** Cuántas veces se ha respondido esta pregunta, contando esta. */
  attempts: number;
  /** Puntos ganados con esta respuesta. */
  points: number;
}

export interface TreasureSummary {
  score: number;
  total: number;
  /** Islas conquistadas a la primera. */
  firstTry: number;
  bestStreak: number;
  /** Respuestas comprobadas en total (aciertos y fallos). */
  attempts: number;
  /** Tormentas (respuestas falladas). */
  storms: number;
  /** Islas con cofre conquistadas y total de islas con cofre. */
  chests: number;
  chestTotal: number;
  /** Valoración final de 1 (la mejor) a 4, según las islas conquistadas a la primera. */
  rank: number;
}

export type Phase = 'route' | 'question' | 'sailing' | 'checked' | 'finale' | 'done';

export interface Verdict {
  ok: boolean;
  firstTry: boolean;
  points: number;
  /** La isla tenía cofre: bono de puntos. */
  chest: boolean;
  /** Era la última isla: solo falta el tesoro. */
  last: boolean;
  /** Isla (id de su pregunta) y respuesta elegida (índice en `question.answers`). */
  island: string;
  answer: number;
}

export interface State {
  phase: Phase;
  /** Dónde está el barco: `port`, la isla (id de su pregunta) o `treasure`. */
  at: string;
  /** Hacia dónde mira el barco (1 = derecha). */
  face: 1 | -1;
  /** Isla elegida para responder (id de su pregunta). */
  target: string | null;
  /** Orden en que se muestran las respuestas de la isla elegida (índices de `question.answers`). */
  order: number[];
  selected: number | null;
  /** Islas ya exploradas (el barco llegó a ellas). */
  visited: string[];
  /** Islas con la pregunta acertada: se anota al comprobar, antes de que el barco llegue. */
  solved: string[];
  fails: Record<string, number>;
  discarded: Record<string, number[]>;
  score: number;
  streak: number;
  bestStreak: number;
  firstTry: number;
  attempts: number;
  storms: number;
  chests: number;
  last: Verdict | null;
  notice: string;
}
