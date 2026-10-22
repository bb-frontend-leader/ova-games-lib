export interface SlotsAnswer {
  /** Texto de la respuesta. Admite HTML básico (`<strong>`, `<em>`). */
  label: string;
  state: 'success' | 'wrong';
}

export interface SlotsQuestion {
  /** Identificador estable: la página lo recibe en `onResult` y el juego lo usa para recordar los fallos. */
  id: string;
  /** Enunciado. Admite HTML básico (`<strong>`, `<em>`), como en los demás juegos. */
  question: string;
  answers: SlotsAnswer[];
}

export type SlotsSymbol = 'cherry' | 'bell' | 'star' | 'seven' | 'diamond';

export interface SlotsResult {
  result: boolean;
  question: string;
  /** Racha de aciertos seguidos tras esta respuesta. */
  streak: number;
  /** Cuántas veces se ha respondido esta pregunta, contando esta. */
  attempts: number;
}

export interface SlotsSummary {
  score: number;
  total: number;
  /** Preguntas acertadas en el primer intento. */
  firstTry: number;
  bestStreak: number;
  /** Respuestas comprobadas en total (aciertos y fallos). */
  attempts: number;
  /** Tiradas que se hicieron. */
  pulls: number;
  /** Mayor premio ganado con una sola tirada (ya con el doble de la palanca dorada). */
  bestWin: number;
  /** Veces que salió el jackpot. */
  jackpots: number;
}

export type Phase = 'question' | 'checked' | 'ready' | 'spinning' | 'landed' | 'done';

/** Una palanca dorada (por acertar a la primera) duplica el premio. */
export type PullKind = 'gold' | 'normal';

/** Resultado de una tirada según la línea central. */
export type Tier = 'jackpot' | 'triple' | 'pair' | 'none';

export interface Verdict {
  ok: boolean;
  /** Acertó a la primera (la tirada que gana es dorada). */
  firstTry: boolean;
}

export interface Spin {
  /** Los tres símbolos de la línea central, de izquierda a derecha. */
  middle: SlotsSymbol[];
  tier: Tier;
  /** Símbolo que se repite (pareja o trío); `null` si los tres son distintos. */
  symbol: SlotsSymbol | null;
  /** Premio sin multiplicadores. */
  base: number;
  /** Premio final, con el doble de la palanca dorada. */
  points: number;
  kind: PullKind;
}

export interface State {
  phase: Phase;
  /** Pregunta que se está jugando (índice en `questions`). */
  index: number;
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
  /** Tiradas ganadas y todavía sin hacer, en el orden en que se harán. */
  queue: PullKind[];
  /** Cambia con cada tirada: así las tiras de los carretes se montan de nuevo. */
  spinId: number;
  /** Tira de símbolos de cada carrete: los tres visibles son los de las posiciones `length - 4` a `length - 2`. */
  strips: SlotsSymbol[][];
  pulls: number;
  bestWin: number;
  jackpots: number;
  last: Verdict | null;
  spin: Spin | null;
  notice: string;
}
