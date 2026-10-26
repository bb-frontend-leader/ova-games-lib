export interface ParquesAnswer {
  /** Texto de la respuesta. Admite HTML básico (`<strong>`, `<em>`). */
  label: string;
  state: 'success' | 'wrong';
}

export interface ParquesQuestion {
  /** Identificador estable: la página lo recibe en `onResult` y el juego lo usa para recordar los fallos. */
  id: string;
  /** Enunciado. Admite HTML básico (`<strong>`, `<em>`), como en los demás juegos. */
  question: string;
  answers: ParquesAnswer[];
}

export interface ParquesResult {
  result: boolean;
  /** Id de la pregunta respondida. */
  question: string;
  /** Racha de aciertos seguidos tras esta respuesta. */
  streak: number;
  /** Cuántas veces se ha respondido esta pregunta, contando esta. */
  attempts: number;
  /** Puntos ganados con esta respuesta (sin contar los de las capturas ni los del cielo). */
  points: number;
}

export interface ParquesSummary {
  score: number;
  total: number;
  /** Preguntas acertadas en el primer intento. */
  firstTry: number;
  bestStreak: number;
  /** Respuestas comprobadas en total (aciertos y fallos). */
  attempts: number;
  /** Tiradas de dados del jugador (con las extra por par). */
  rolls: number;
  /** Fichas del jugador y del rival que acabaron en el cielo. */
  home: number;
  rivalHome: number;
  /** Capturas hechas por el jugador y veces que el rival capturó una ficha suya. */
  captures: number;
  captured: number;
  /** Quién ganó la partida: gana quien tiene sus fichas más cerca del cielo (en empate, el jugador). */
  won: boolean;
}

/** Quién juega: el estudiante (amarillo) o el rival que mueve solo (rojo). */
export type Side = 'you' | 'rival';

export type Color = 'yellow' | 'red' | 'blue' | 'green';

/**
 * Una ficha. `p` es su avance en el camino de su color: -1 en la cárcel, 0 en la salida, hasta el último paso del
 * circuito, luego el pasillo de color y, al final, el cielo.
 */
export interface Piece {
  side: Side;
  /** Número de la ficha dentro de su lado (0, 1…). */
  n: number;
  p: number;
}

export interface Roll {
  a: number;
  b: number;
}

/** Una jugada posible con la tirada: qué ficha, a dónde llega y qué pasa allí. */
export interface Option {
  /** Índice de la ficha en `State.pieces`. */
  piece: number;
  to: number;
  /** Sale de la cárcel a la salida. */
  exit: boolean;
  /** Fichas del rival (índices en `State.pieces`) que quedan comidas al caer encima. */
  captures: number[];
  /** Llega al cielo. */
  home: boolean;
}

export type Phase = 'question' | 'checked' | 'roll' | 'rolling' | 'choose' | 'moving' | 'stop' | 'done';

export interface Verdict {
  ok: boolean;
  firstTry: boolean;
  points: number;
  /** Es la última pregunta: tras esta tirada acaba la partida. */
  last: boolean;
  /** Ninguna ficha del jugador puede moverse (todas en el cielo): no hay tirada. */
  skip: boolean;
}

/** Movimiento en curso: la ficha recorre su camino y, si captura, la comida vuela a su cárcel. */
export interface Motion {
  /** Cambia con cada movimiento, para no resolverlo dos veces. */
  id: number;
  side: Side;
  option: Option;
  /** Tras este movimiento hay otra tirada sin pregunta: salió un par. */
  again: boolean;
}

/** Parada tras una jugada importante: qué ha pasado, con un botón para seguir. */
export interface Stop {
  kind: 'capture' | 'captured' | 'home' | 'rivalHome' | 'stuck';
  points: number;
  /** Con `true`, al seguir hay otra tirada extra sin pregunta. */
  again: boolean;
  /** Ficha que acaba de llegar (`you-0`, `rival-1`…), para los efectos; vacío si no hay. */
  piece: string;
}

export interface State {
  phase: Phase;
  /** De quién es el turno ahora. */
  turn: Side;
  /** Cola de preguntas (índices en `questions`): la primera es la actual. */
  queue: number[];
  order: number[];
  selected: number | null;
  pieces: Piece[];
  /** Últimos dados de cada lado (0 si aún no tiró). */
  dice: Record<Side, Roll>;
  /** Cambia con cada tirada, para que la animación se repita aunque salgan los mismos números. */
  dieKey: number;
  /** Intentos de salir de la cárcel en este turno (3 como máximo). */
  tries: number;
  /** Tirada extra gratis pendiente (por un par): se tira sin responder una pregunta. */
  bonus: boolean;
  /** Jugadas posibles del jugador con la tirada actual. */
  options: Option[];
  solved: string[];
  seen: string[];
  fails: Record<string, number>;
  discarded: Record<string, number[]>;
  score: number;
  streak: number;
  bestStreak: number;
  firstTry: number;
  attempts: number;
  rolls: number;
  captures: number;
  captured: number;
  last: Verdict | null;
  motion: Motion | null;
  stop: Stop | null;
  moves: number;
  /** Lo último que hizo el rival, para mostrarlo en su asiento. */
  rivalNote: string;
  notice: string;
}
