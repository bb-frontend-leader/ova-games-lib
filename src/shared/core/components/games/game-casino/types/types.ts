export type GameCasinoStates = 'wrong' | 'success';

export const silverAmount = [10, 15, 25];

export interface Option {
  id: string;
  state: GameCasinoStates | string;
  name: string;
  label: string;
  amount?: number; // Añadido para la lógica de apuesta
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
  options: Option[]; // Aquí guardaremos la opción seleccionada con su monto
  point: number;
}

// Interfaz del Contexto
export interface GameCasinoContextType extends InitialState {
  addSelectedOption: (option: Option) => void;
  handleValidation: () => void;
  handleReset: () => void;
}

// Estructura de respuesta para el componente principal
export interface GameResult {
  result: boolean;
  options: Option[];
  totalPoints: number;
}
