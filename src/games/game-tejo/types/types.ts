export interface TejoAnswer {
  /** Texto de la respuesta. Admite HTML básico (`<strong>`, `<em>`). */
  label: string;
  state: 'success' | 'wrong';
}

export interface TejoQuestion {
  /** Identificador estable: la página lo recibe en `onResult` y el juego lo usa para recordar los fallos. */
  id: string;
  /** Enunciado. Admite HTML básico (`<strong>`, `<em>`), como en los demás juegos. */
  question: string;
  answers: TejoAnswer[];
}

export interface TejoResult {
  result: boolean;
  /** Id de la pregunta respondida. */
  question: string;
  /** Racha de aciertos seguidos tras esta respuesta. */
  streak: number;
  /** Cuántas veces se ha respondido esta pregunta, contando esta. */
  attempts: number;
  /** Puntos ganados con esta respuesta (sin contar los del lanzamiento). */
  points: number;
}

export interface TejoSummary {
  score: number;
  total: number;
  /** Preguntas acertadas en el primer intento. */
  firstTry: number;
  bestStreak: number;
  /** Respuestas comprobadas en total (aciertos y fallos). */
  attempts: number;
  /** Lanzamientos hechos (uno por pregunta acertada) y cuántos puntuaron. */
  throws: number;
  scored: number;
  /** Embocinadas (incluidas las moñonas) y mechas reventadas (incluidas las moñonas). */
  bocines: number;
  mechas: number;
  /** Mejor racha de lanzamientos seguidos que puntuaron. */
  bestCombo: number;
}

export type Phase = 'question' | 'checked' | 'aim' | 'throwing' | 'result' | 'done';

export interface Verdict {
  ok: boolean;
  firstTry: boolean;
  points: number;
  /** La racha de aciertos dio un «pulso firme». */
  steady: boolean;
}

/**
 * Dónde cayó el tejo: en el bocín y reventando una mecha («moñona»), dentro del bocín («embocinada»), sobre una mecha,
 * cerca del bocín («mano»), en la arcilla pero lejos, o fuera de la caja.
 */
export type ThrowKind = 'monona' | 'embocinada' | 'mecha' | 'mano' | 'clay' | 'out';

export interface Point {
  x: number;
  y: number;
}

export interface Throw {
  /** Cambia con cada lanzamiento: así los efectos se repiten. */
  n: number;
  aim: Point;
  land: Point;
  steady: boolean;
  kind: ThrowKind;
  /** Distancia del tejo al centro del bocín, en centímetros. */
  cm: number;
  points: number;
  combo: number;
}

/** Lanzamiento en el aire: lo que se anima hasta que cae. */
export interface Launch {
  id: number;
  aim: Point;
  land: Point;
  steady: boolean;
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
  throws: number;
  scored: number;
  bocines: number;
  mechas: number;
  combo: number;
  bestCombo: number;
  /** Pulsos firmes que se tienen y si el próximo lanzamiento usa uno. */
  steady: number;
  steadyOn: boolean;
  /** Punto al que se apunta, en porcentaje del ancho y del fondo de la arcilla; se conserva entre lanzamientos. */
  aimX: number;
  aimY: number;
  /** Posición (índice de `SPOTS`) del bocín en esta pregunta. */
  spot: number;
  last: Verdict | null;
  launch: Launch | null;
  shot: Throw | null;
  /** Lanzamientos hechos: da el id del siguiente. */
  launches: number;
  notice: string;
}
