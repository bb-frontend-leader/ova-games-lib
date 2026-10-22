export interface MinesAnswer {
  /** Texto de la respuesta. Admite HTML básico (`<strong>`, `<em>`). */
  label: string;
  state: 'success' | 'wrong';
}

export interface MinesQuestion {
  /** Identificador estable: la página lo recibe en `onResult` y el juego lo usa para recordar los fallos. */
  id: string;
  /** Enunciado. Admite HTML básico (`<strong>`, `<em>`), como en los demás juegos. */
  question: string;
  answers: MinesAnswer[];
}

export interface MinesResult {
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

export interface MinesSummary {
  score: number;
  total: number;
  /** Preguntas acertadas en el primer intento. */
  firstTry: number;
  bestStreak: number;
  /** Respuestas comprobadas en total (aciertos y fallos). */
  attempts: number;
  /** Minas que explotaron. */
  minesHit: number;
  /** Minas que quedaron marcadas con bandera (o con el radar) sin explotar. */
  flagsOk: number;
  /** Puntos extra del final por banderas y escudos. */
  bonus: number;
}

export type Phase = 'board' | 'question' | 'checked' | 'done';

/** `closed`: sin abrir; `open`: casilla segura despejada; `boom`: mina que explotó. */
export type CellStatus = 'closed' | 'open' | 'boom';

export interface Cell {
  id: number;
  row: number;
  col: number;
  mine: boolean;
  /** Pregunta que esconde (índice en `questions`); las minas no tienen. */
  q: number | null;
  /** Minas en las 8 casillas de alrededor. */
  adj: number;
  status: CellStatus;
  flag: boolean;
  /** La bandera la puso el radar: no se puede quitar. */
  radar: boolean;
}

export interface Verdict {
  ok: boolean;
  firstTry: boolean;
  points: number;
  /** Minas alrededor de la casilla despejada. */
  adj: number;
  /** Ganó un escudo por acertar a la primera. */
  shield: boolean;
  /** Casilla donde el radar encontró una mina, si lo hizo. */
  radar: number | null;
}

/** Lo último que pasó al pisar una mina. */
export interface MineEvent {
  /** Cambia con cada explosión: así los efectos se repiten. */
  n: number;
  id: number;
  /** `shielded`: el escudo absorbió la mina; `hit`: se perdieron puntos. */
  kind: 'hit' | 'shielded';
  points: number;
}

export interface State {
  phase: Phase;
  cells: Cell[];
  /** Casilla cuya pregunta se está respondiendo. */
  currentId: number | null;
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
  shields: number;
  minesHit: number;
  bonus: number;
  /** Modo bandera: pulsar una casilla pone o quita la bandera en lugar de abrirla. */
  flagMode: boolean;
  last: Verdict | null;
  event: MineEvent | null;
  notice: string;
}
