export interface RanaAnswer {
  /** Texto de la respuesta. Admite HTML básico (`<strong>`, `<em>`). */
  label: string;
  state: 'success' | 'wrong';
}

export interface RanaQuestion {
  /** Identificador estable: la página lo recibe en `onResult` y el juego lo usa para recordar los fallos. */
  id: string;
  /** Enunciado. Admite HTML básico (`<strong>`, `<em>`), como en los demás juegos. */
  question: string;
  answers: RanaAnswer[];
}

export interface RanaResult {
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

export interface RanaSummary {
  score: number;
  total: number;
  /** Preguntas acertadas en el primer intento. */
  firstTry: number;
  bestStreak: number;
  /** Respuestas comprobadas en total (aciertos y fallos). */
  attempts: number;
  /** Monedas lanzadas (una por pregunta acertada) y cuántas entraron en un hoyo. */
  throws: number;
  scored: number;
  /** Monedas que entraron en la boca de la rana y en el hoyo doble del turno. */
  ranas: number;
  hots: number;
  /** Mejor racha de monedas seguidas que entraron. */
  bestCombo: number;
}

export type Phase = 'question' | 'checked' | 'aim' | 'throwing' | 'result' | 'done';

export interface Verdict {
  ok: boolean;
  firstTry: boolean;
  points: number;
  /** La racha de aciertos dio una «mano firme». */
  steady: boolean;
}

/** Los hoyos de la mesa, de más a menos difíciles. */
export type HoleId = 'rana' | 'molino' | 'puente' | 'tortuga' | 'hoyo';

export interface Throw {
  /** Cambia con cada lanzamiento: así los efectos se repiten. */
  n: number;
  hole: HoleId;
  /** La moneda entró en el hoyo. */
  hit: boolean;
  /** El hoyo era el doble de este turno. */
  hot: boolean;
  /** Probabilidad (0–1) que tenía de entrar. */
  chance: number;
  points: number;
  combo: number;
}

/** Moneda en el aire: lo que se anima hasta que cae. */
export interface Launch {
  id: number;
  hole: HoleId;
  hit: boolean;
  /** Probabilidad (0–1) que tenía de entrar al lanzarla. */
  chance: number;
  /** Hoyito (0–4) de la fila de abajo al que va la moneda si el hoyo es `hoyo`. */
  slot: number;
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
  ranas: number;
  hots: number;
  combo: number;
  bestCombo: number;
  /** Manos firmes que se tienen y si la próxima moneda usa una. */
  steady: number;
  steadyOn: boolean;
  /** Hoyo al que se apunta y hoyo doble de este turno. */
  aim: HoleId;
  hot: HoleId;
  last: Verdict | null;
  launch: Launch | null;
  shot: Throw | null;
  /** Monedas lanzadas: da el id de la siguiente. */
  launches: number;
  notice: string;
}
