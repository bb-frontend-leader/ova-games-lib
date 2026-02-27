export type RadioStates = 'wrong' | 'success';

// Representa una pregunta con su texto y una indicación de si es correcta.
export interface Option {
  id: string;
  state: RadioStates;
  name: string;
}

// Define la interfaz para el estado inicial de la actividad
export interface InitialState {
  validation: boolean;
  button: boolean;
  result: boolean;
  options: Option[];
}

// Define la interfaz para el contexto de actividad de selección de opciones
export interface GameMoneyContextType {
  addSelectedOption: (option: Option) => void;
  addRadioElementsId: (uid: string) => void;
  handleValidation: () => void;
  handleReset: () => void;

  validation: boolean;
  button: boolean;
  result: boolean;
  options: Option[];
}

// Enumeración para los estados posibles
export enum States {
  SUCCESS = 'success',
  WRONG = 'wrong'
}
