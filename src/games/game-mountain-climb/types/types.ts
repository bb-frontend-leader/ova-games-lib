export interface MountainAnswer {
  /** Texto de la respuesta. Admite HTML básico (`<strong>`, `<em>`). */
  label: string;
  state: 'success' | 'wrong';
}

export interface MountainQuestion {
  /** Identificador estable: la página lo recibe en `onResult` y el juego lo usa para recordar los fallos. */
  id: string;
  /** Enunciado. Admite HTML básico (`<strong>`, `<em>`), como en los demás juegos. */
  question: string;
  answers: MountainAnswer[];
}

export interface MountainResult {
  result: boolean;
  /** Id de la pregunta respondida. */
  question: string;
  /** Racha de aciertos seguidos tras esta respuesta. */
  streak: number;
  /** Cuántas veces se ha respondido esta pregunta, contando esta. */
  attempts: number;
  /** Puntos ganados con esta respuesta (sin contar los bonus de campamento y cumbre). */
  points: number;
}

export interface MountainSummary {
  score: number;
  total: number;
  /** Preguntas acertadas en el primer intento (una pregunta repetida tras una caída no cuenta). */
  firstTry: number;
  bestStreak: number;
  /** Respuestas comprobadas en total (aciertos y fallos). */
  attempts: number;
  /** Veces que se cayó hasta un campamento por quedarse sin fuerzas. */
  falls: number;
  /** Tramos que hubo que volver a subir por las caídas. */
  retraced: number;
}

export type Phase = 'question' | 'checked' | 'climbing' | 'camp' | 'falling' | 'fell' | 'done';

export interface Verdict {
  ok: boolean;
  firstTry: boolean;
  points: number;
  /** La racha de aciertos devolvió una unidad de fuerzas. */
  rested: boolean;
  /** Fallo que agota las fuerzas: el siguiente paso es la caída. */
  fall: boolean;
  /** Tramos que se pierden en esa caída (0 si ya se estaba en un campamento). */
  lost: number;
}

/** Llegada a un campamento o a la cumbre. */
export interface Arrival {
  kind: 'camp' | 'summit';
  /** Número del campamento (1, 2…); en la cumbre, el último tramo. */
  n: number;
  points: number;
}

/** Caída hasta el último campamento. */
export interface Fall {
  /** Tramos perdidos y tramo (posición) al que se vuelve. */
  lost: number;
  to: number;
}

/** El movimiento del escalador: sube un tramo o cae hasta un campamento. */
export interface Motion {
  /** Cambia con cada movimiento: así los efectos se repiten y no se resuelve dos veces el mismo. */
  id: number;
  kind: 'climb' | 'fall';
  from: number;
  to: number;
}

export interface State {
  phase: Phase;
  /** Preguntas pendientes (índices de `questions`); la primera es la actual. */
  queue: number[];
  /** Orden en que se muestran las respuestas de la pregunta actual (índices de `answers`). */
  order: number[];
  selected: number | null;
  /** Tramo en el que está el escalador (0 es la base, `total` la cumbre). */
  pos: number;
  /** Ids de las preguntas acertadas, en el orden en que se subieron los tramos. */
  solved: string[];
  /** Ids de las preguntas acertadas alguna vez (una repetida tras caer ya no cuenta como "a la primera"). */
  seen: string[];
  fails: Record<string, number>;
  /** Respuestas ya falladas por pregunta: al reintentar quedan descartadas. */
  discarded: Record<string, number[]>;
  score: number;
  streak: number;
  bestStreak: number;
  firstTry: number;
  attempts: number;
  energy: number;
  falls: number;
  retraced: number;
  last: Verdict | null;
  arrival: Arrival | null;
  fall: Fall | null;
  motion: Motion | null;
  /** Movimientos hechos: da el id del siguiente. */
  moves: number;
  notice: string;
}
