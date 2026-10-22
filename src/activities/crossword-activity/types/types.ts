export type Direction = 'across' | 'down';

/** Palabra tal como la escribe el desarrollador. */
export interface CrosswordWord {
  /** Respuesta. Los espacios no ocupan casilla: "ciclo de vida" usa 11. */
  answer: string;
  /** Pista que ve el usuario. */
  clue: string;
  /** Fila (desde 0) de la primera letra. */
  row: number;
  /** Columna (desde 0) de la primera letra. */
  col: number;
  direction: Direction;
}

/** Palabra ya ubicada en la cuadrícula, con su número. */
export interface PlacedWord {
  /** `${número}-${dirección}`, único. */
  id: string;
  number: number;
  direction: Direction;
  clue: string;
  /** Letras normalizadas (mayúsculas, sin tildes salvo Ñ y sin espacios). */
  answer: string;
  /** Longitud para la pista: "5" o "3, 3" si la respuesta tiene varias palabras. */
  lengthHint: string;
  /** Claves de las casillas, en orden. */
  cells: string[];
}

export interface Cell {
  /** `${fila},${columna}` */
  key: string;
  row: number;
  col: number;
  /** Letra correcta, normalizada. */
  solution: string;
  /** Número de la palabra que empieza aquí, si alguna lo hace. */
  number?: number;
  /** Id de la palabra que pasa por la casilla en cada dirección. */
  words: Partial<Record<Direction, string>>;
}

export interface Layout {
  rows: number;
  cols: number;
  cells: Map<string, Cell>;
  words: PlacedWord[];
  wordsById: Map<string, PlacedWord>;
  /** Problemas de los datos (choques de letras, palabras sin respuesta…). Vacío si todo está bien. */
  conflicts: string[];
}

export type CellState = 'right' | 'wrong';

/** Resultado de una palabra tras comprobar. */
export interface WordResult {
  number: number;
  direction: Direction;
  clue: string;
  /** Respuesta correcta, normalizada. */
  answer: string;
  /** Lo que escribió el usuario, en mayúsculas y sin huecos. */
  userAnswer: string;
  correct: boolean;
}

export interface CrosswordState {
  /** Letra escrita por casilla (mayúscula, tal como se tecleó, con tilde si la llevaba). */
  letters: Record<string, string>;
  activeKey: string | null;
  direction: Direction;
  validation: boolean;
}

export type CrosswordAction =
  | { type: 'select'; key: string; direction: Direction }
  | { type: 'letter'; key: string; value: string }
  | { type: 'validate' }
  | { type: 'reset' };

export interface CrosswordContextType {
  layout: Layout;
  letters: Record<string, string>;
  activeKey: string | null;
  activeWord: PlacedWord | null;
  direction: Direction;
  validation: boolean;
  result: boolean;
  /** `true` mientras el botón de comprobar debe estar deshabilitado (misma semántica que las demás actividades). */
  button: boolean;
  states: Record<string, CellState>;
  wordResults: Record<string, boolean>;
  /** Casilla con tabindex=0 (la activa, o la primera si todavía no hay ninguna). */
  tabStopKey: string;
  registerInput: (key: string, element: HTMLInputElement | null) => void;
  selectCell: (key: string) => void;
  toggleDirection: (key: string) => void;
  selectWord: (id: string) => void;
  typeLetter: (key: string, value: string) => void;
  clearLetter: (key: string, options?: { back?: boolean }) => void;
  move: (key: string, deltaRow: number, deltaCol: number) => void;
  handleValidation: () => void;
  handleReset: () => void;
}
