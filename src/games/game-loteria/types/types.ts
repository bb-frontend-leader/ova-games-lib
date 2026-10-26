/** La carta de la tabla que responde a una pista. */
export interface LoteriaCardData {
  /** Nombre de la carta (texto plano): es lo que se lee en la tabla. */
  label: string;
  /** Dibujo de la carta: un emoji o un carácter corto. Sin él (ni `image`) se usa la inicial del nombre. */
  emoji?: string;
  /** Ruta de una imagen para la carta (tiene prioridad sobre `emoji`). Es decorativa: el nombre ya va en texto. */
  image?: string;
}

export interface LoteriaQuestion {
  /** Identificador estable: la página lo recibe en `onResult` y el juego lo usa para recordar los fallos. */
  id: string;
  /** La pista del cantor. Admite HTML básico (`<strong>`, `<em>`), como en los demás juegos. */
  question: string;
  /** La carta de la tabla que responde a la pista. Todas las cartas de la tabla salen de las preguntas. */
  card: LoteriaCardData;
}

export interface LoteriaResult {
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

export interface LoteriaSummary {
  score: number;
  total: number;
  /** Cartas acertadas en el primer intento. */
  firstTry: number;
  bestStreak: number;
  /** Cartas tocadas en total (aciertos y fallos). */
  attempts: number;
  /** Cartas falladas (descartadas). */
  errors: number;
  /** Veces que el juego dio la pista de dos cartas tras dos fallos seguidos en una misma pista. */
  hints: number;
  /** Filas y columnas completadas antes de llenar la tabla. */
  lines: number;
  /** Valoración final de 1 (la mejor) a 4, según los aciertos a la primera. */
  rank: number;
}

export type Phase = 'pick' | 'marking' | 'checked' | 'done';

export interface Verdict {
  ok: boolean;
  firstTry: boolean;
  points: number;
  /** Filas o columnas que este acierto acaba de completar (ids de las cartas de cada una). */
  lines: string[][];
  /** Era la última pista: la tabla queda llena. */
  last: boolean;
  /** Tras este fallo, el cantor deja solo dos cartas posibles. */
  hint: boolean;
  /** Carta que se tocó (id de su pregunta). */
  picked: string;
}

export interface State {
  phase: Phase;
  /** Ids de las cartas en el orden en que están en la tabla. */
  board: string[];
  /** Cola de pistas (índices en `questions`): la primera es la actual. */
  queue: number[];
  solved: string[];
  fails: Record<string, number>;
  /** Cartas descartadas en cada pista (por fallos o por la pista de dos cartas). */
  discarded: Record<string, string[]>;
  score: number;
  streak: number;
  bestStreak: number;
  firstTry: number;
  attempts: number;
  errors: number;
  hints: number;
  /** Filas y columnas ya premiadas (clave = ids ordenados), para no premiar dos veces la misma. */
  lines: string[];
  last: Verdict | null;
  notice: string;
}
