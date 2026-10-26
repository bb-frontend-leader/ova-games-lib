export interface LaneRaceAnswer {
  /** Texto de la respuesta. Admite HTML básico (`<strong>`, `<em>`). */
  label: string;
  state: 'success' | 'wrong';
}

export interface LaneRaceQuestion {
  /** Identificador estable: la página lo recibe en `onResult` y el juego lo usa para recordar los fallos. */
  id: string;
  /** Enunciado. Admite HTML básico (`<strong>`, `<em>`), como en los demás juegos. */
  question: string;
  /** Cada respuesta es un carril de la pista: de 2 a 5. */
  answers: LaneRaceAnswer[];
}

export interface LaneRaceResult {
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

export interface LaneRaceSummary {
  score: number;
  total: number;
  /** Preguntas acertadas en el primer intento. */
  firstTry: number;
  bestStreak: number;
  /** Respuestas comprobadas en total (aciertos y fallos). */
  attempts: number;
  /** Choques (respuestas falladas) y turbos ganados con las rachas. */
  crashes: number;
  nitros: number;
  /** Puesto final entre los coches de la carrera (1 = primero) y total de coches. */
  rank: number;
  cars: number;
  /** Ganó la carrera (llegó primero). */
  won: boolean;
}

export type Phase = 'question' | 'driving' | 'checked' | 'done';

export interface Verdict {
  ok: boolean;
  firstTry: boolean;
  points: number;
  /** La racha de tres da un turbo. */
  nitro: boolean;
  /** Es la última pregunta: el coche cruza la meta. */
  last: boolean;
  /** Carril que se eligió (índice en `question.answers`). */
  lane: number;
}

export interface State {
  phase: Phase;
  /** Cola de preguntas (índices en `questions`): la primera es la actual. */
  queue: number[];
  /** Orden en que se muestran las respuestas (índices de `question.answers`): cada carril es una. */
  order: number[];
  /** Respuesta elegida (índice en `question.answers`). */
  selected: number | null;
  solved: string[];
  seen: string[];
  fails: Record<string, number>;
  discarded: Record<string, number[]>;
  score: number;
  streak: number;
  bestStreak: number;
  firstTry: number;
  attempts: number;
  crashes: number;
  nitros: number;
  /** Avance de cada rival, en tramos (uno por pregunta): suben con cada respuesta comprobada. */
  rivals: number[];
  last: Verdict | null;
  notice: string;
}
