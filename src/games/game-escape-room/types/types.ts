import type { ObjectIcon } from '../lib/icons';

export interface EscapeAnswer {
  /** Texto de la respuesta. Admite HTML básico (`<strong>`, `<em>`). */
  label: string;
  state: 'success' | 'wrong';
}

export interface EscapeQuestion {
  /** Identificador estable: la página lo recibe en `onResult` y el juego lo usa para recordar los fallos. */
  id: string;
  /** Enunciado. Admite HTML básico (`<strong>`, `<em>`), como en los demás juegos. */
  question: string;
  answers: EscapeAnswer[];
}

export interface EscapeResult {
  result: boolean;
  /** Id de la pregunta respondida. */
  question: string;
  /** Racha de aciertos seguidos tras esta respuesta. */
  streak: number;
  /** Cuántas veces se ha respondido esta pregunta, contando esta. */
  attempts: number;
  /** Puntos ganados con esta respuesta (sin contar los de abrir la puerta). */
  points: number;
}

export interface EscapeSummary {
  score: number;
  total: number;
  /** Preguntas acertadas en el primer intento y sin pista. */
  firstTry: number;
  bestStreak: number;
  /** Respuestas comprobadas en total (aciertos y fallos). */
  attempts: number;
  /** Salas de las que se escapó. */
  rooms: number;
  hintsUsed: number;
  /** Códigos equivocados en las puertas. */
  badCodes: number;
  /** Puntos extra del final por las pistas que sobran. */
  bonus: number;
}

export type Phase = 'room' | 'question' | 'checked' | 'door' | 'opened' | 'done';

/** Un objeto de una sala: guarda una pregunta y, al abrirlo, un dígito del código de la puerta. */
export interface Obj {
  id: number;
  /** Pregunta que esconde (índice en `questions`). */
  q: number;
  room: number;
  /** Posición del dígito en el código de la puerta (empieza en 1). */
  slot: number;
  digit: number;
  icon: ObjectIcon;
  open: boolean;
}

export interface Verdict {
  ok: boolean;
  firstTry: boolean;
  points: number;
  /** Se usó la pista en esta pregunta. */
  hinted: boolean;
  /** Ganó una pista por la racha. */
  hintGain: boolean;
  /** Con este objeto quedó abierto todo lo de la sala. */
  cleared: boolean;
  slot: number;
  digit: number;
}

/** Lo último que pasó en la puerta. */
export interface DoorEvent {
  /** Cambia con cada intento: así los efectos se repiten. */
  n: number;
  ok: boolean;
  /** Puntos de abrir la puerta, o los que se pierden por un código equivocado. */
  points: number;
}

export interface State {
  phase: Phase;
  objs: Obj[];
  /** Sala en la que se está. */
  room: number;
  /** Objeto cuya pregunta se está respondiendo. */
  currentId: number | null;
  /** Orden en que se muestran las respuestas de la pregunta actual (índices de `answers`). */
  order: number[];
  selected: number | null;
  solved: string[];
  fails: Record<string, number>;
  /** Respuestas ya falladas o descartadas por la pista, por pregunta: quedan tachadas. */
  discarded: Record<string, number[]>;
  /** Preguntas en las que se usó la pista. */
  hinted: Record<string, boolean>;
  score: number;
  streak: number;
  bestStreak: number;
  firstTry: number;
  attempts: number;
  hints: number;
  hintsUsed: number;
  rooms: number;
  badCodes: number;
  bonus: number;
  /** Dígitos escritos en el teclado de la puerta. */
  entry: number[];
  last: Verdict | null;
  door: DoorEvent | null;
  notice: string;
}
