export type GameCasinoStates = 'wrong' | 'success';

export interface Option {
  id: string;
  state: GameCasinoStates | string;
  name: string;
  label: string;
  bullet?: string;
  amount?: number; // Valor de la ficha apostada
}

export interface Options {
  question: string;
  options: Option[];
}

// Estado inicial para el Reducer (Siguiendo el modelo Fish)
export interface InitialState {
  validation: boolean;
  button: boolean;
  result: boolean;
  options: Option[]; // La apuesta completa: la opción elegida con el valor de su ficha
  point: number; // Fichas en la mano (sin contar la apuesta que está en la mesa)
  answer: Option | null; // Opción elegida (todavía sin ficha)
  chip: number | null; // Ficha elegida (todavía sin opción)
  landed: boolean; // Falso mientras las fichas del pago viajan a la mano
  reloaded: boolean; // La banca recargó fichas al reiniciar
  wins: number; // Apuestas ganadas hasta ahora
  losses: number; // Apuestas perdidas hasta ahora
  cashout: boolean; // Se cerró la mesa y se muestran todas las fichas
}

// Interfaz del Contexto
export interface GameCasinoContextType extends InitialState {
  /** Fichas que se ven en la mano: descuenta la apuesta que está sobre la mesa. */
  rack: number;
  canAnimate: boolean;
  levelRef: React.RefObject<HTMLDivElement>;
  fxRef: React.RefObject<HTMLDivElement>;
  pickAnswer: (option: Option) => void;
  pickChip: (value: number) => void;
  handleValidation: () => void;
  handleReset: () => void;
  handleRestart: () => void;
  /** Cierra la mesa y muestra todas las fichas ganadas (después de la última pregunta). */
  openCashout: () => void;
}

// Estructura de respuesta para el componente principal
export interface GameResult {
  result: boolean;
  options: Option[];
  totalPoints: number;
}
