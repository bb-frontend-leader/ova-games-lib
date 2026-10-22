export interface TowerAnswer {
  /** Texto de la respuesta. Admite HTML básico (`<strong>`, `<em>`). */
  label: string;
  state: 'success' | 'wrong';
}

export interface TowerQuestion {
  /** Identificador estable: la página lo recibe en `onResult` y el juego lo usa para recordar los fallos. */
  id: string;
  /** Enunciado. Admite HTML básico (`<strong>`, `<em>`), como en los demás juegos. */
  question: string;
  answers: TowerAnswer[];
}

export interface TowerResult {
  result: boolean;
  /** Id de la pregunta respondida. */
  question: string;
  /** Racha de aciertos seguidos tras esta respuesta. */
  streak: number;
  /** Cuántas veces se ha respondido esta pregunta, contando esta. */
  attempts: number;
  /** Puntos ganados con esta respuesta (sin contar los de colocar el bloque). */
  points: number;
}

export interface TowerSummary {
  score: number;
  total: number;
  /** Preguntas acertadas en el primer intento. */
  firstTry: number;
  bestStreak: number;
  /** Respuestas comprobadas en total (aciertos y fallos). */
  attempts: number;
  /** Bloques que quedaron en pie sobre la base. */
  height: number;
  /** Bloques que encajaron justo y la mejor racha de encajes. */
  perfects: number;
  bestCombo: number;
  /** Bloques que cayeron fuera de la torre. */
  fallen: number;
}

export type Phase = 'question' | 'checked' | 'aim' | 'dropping' | 'placed' | 'done';

/** Un bloque de la torre: ocupa `width` casillas desde la casilla `left` del escenario. */
export interface Block {
  id: number;
  /** 0 es la base; cada bloque colocado sube un nivel. */
  level: number;
  left: number;
  width: number;
  perfect: boolean;
}

export interface Verdict {
  ok: boolean;
  firstTry: boolean;
  points: number;
  /** Ganó una carga de calma por la racha. */
  calm: boolean;
}

/** Lo que pasó con el último bloque. */
export interface Drop {
  /** Cambia con cada bloque: así los efectos se repiten. */
  n: number;
  kind: 'perfect' | 'partial' | 'miss';
  /** Nivel al que iba el bloque (el de arriba de la torre, más uno). */
  level: number;
  /** Id del bloque colocado, o `null` si cayó fuera. */
  id: number | null;
  /** Desplazamiento respecto a la torre al aterrizar (posición apuntada más viento). */
  offset: number;
  /** Casillas de ancho que se perdieron (el bloque entero si cayó fuera). */
  cut: number;
  /** Ancho del bloque colocado. */
  width: number;
  points: number;
  combo: number;
  /** La racha de encajes ensanchó la torre una casilla. */
  grew: boolean;
}

export interface State {
  phase: Phase;
  blocks: Block[];
  /** Preguntas en el orden en que salen (índices de `questions`) y cuál toca. */
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
  perfects: number;
  combo: number;
  bestCombo: number;
  fallen: number;
  /** Cargas de calma y si el próximo bloque la usa. */
  calm: number;
  calmOn: boolean;
  /** Viento de este bloque (casillas, positivo hacia la derecha) y posición que se apunta. */
  wind: number;
  aim: number;
  last: Verdict | null;
  drop: Drop | null;
  /** Desplazamiento con el que cae el bloque mientras dura la caída. */
  target: number | null;
  /** Bloques soltados: evita resolver dos veces el mismo si el efecto se repite. */
  drops: number;
  notice: string;
}
