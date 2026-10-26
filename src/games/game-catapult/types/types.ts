export interface CatapultAnswer {
  /** Texto de la respuesta. Admite HTML básico (`<strong>`, `<em>`). */
  label: string;
  state: 'success' | 'wrong';
}

export interface CatapultQuestion {
  /** Identificador estable: la página lo recibe en `onResult` y el juego lo usa para recordar los fallos. */
  id: string;
  /** Enunciado. Admite HTML básico (`<strong>`, `<em>`), como en los demás juegos. */
  question: string;
  answers: CatapultAnswer[];
}

export interface CatapultResult {
  result: boolean;
  /** Id de la pregunta respondida. */
  question: string;
  /** Racha de aciertos seguidos tras esta respuesta. */
  streak: number;
  /** Cuántas veces se ha respondido esta pregunta, contando esta. */
  attempts: number;
  /** Puntos ganados con esta respuesta (sin contar los del disparo). */
  points: number;
}

export interface CatapultSummary {
  score: number;
  total: number;
  /** Preguntas acertadas en el primer intento. */
  firstTry: number;
  bestStreak: number;
  /** Respuestas comprobadas en total (aciertos y fallos). */
  attempts: number;
  /** Torres derribadas y disparos hechos (uno por pregunta acertada). */
  hits: number;
  shots: number;
  /** Impactos directos en el centro de la torre y mejor racha de torres derribadas seguidas. */
  directs: number;
  bestCombo: number;
}

export type Phase = 'question' | 'checked' | 'aim' | 'firing' | 'result' | 'done';

export interface Verdict {
  ok: boolean;
  firstTry: boolean;
  points: number;
  /** La racha de aciertos dio una bola de fuego. */
  fire: boolean;
}

/** Qué pasó con un disparo: dio en el centro, derribó la torre, o se quedó corto o se pasó. */
export type ShotKind = 'direct' | 'hit' | 'short' | 'long';

export interface Shot {
  /** Cambia con cada disparo: así los efectos se repiten. */
  n: number;
  angle: number;
  power: number;
  fireball: boolean;
  /** Alcance del disparo y distancia a la torre objetivo (metros). */
  range: number;
  distance: number;
  /** Alcance menos distancia: negativo si se quedó corto, positivo si se pasó. */
  delta: number;
  kind: ShotKind;
  points: number;
  combo: number;
}

/** Disparo en vuelo: lo que se anima hasta que cae. */
export interface Launch {
  id: number;
  angle: number;
  power: number;
  fireball: boolean;
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
  hits: number;
  shots: number;
  directs: number;
  combo: number;
  bestCombo: number;
  /** Bolas de fuego que se tienen y si el próximo disparo la usa. */
  fire: number;
  fireOn: boolean;
  /** Ángulo (grados) y fuerza (%) que se apuntan; se conservan de un disparo al siguiente. */
  angle: number;
  power: number;
  /** Distancia (metros) a la torre objetivo de este disparo. */
  target: number;
  /** Distancias de las torres ya derribadas (quedan sus ruinas en el campo). */
  downed: number[];
  last: Verdict | null;
  launch: Launch | null;
  shot: Shot | null;
  /** Disparos lanzados: da el id del siguiente. */
  launches: number;
  notice: string;
}
