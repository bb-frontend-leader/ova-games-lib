export type RadioStates = 'wrong' | 'success';

// Define el tipo Option que representa una opción individual en la actividad
export type OptionRadio = {
  id: string;
  state: RadioStates;
  name: string;
};

// Define la interfaz InitialState que representa el estado inicial de la actividad
export interface InitialState {
  validation: boolean;
  button: boolean;
  result: boolean;
  options: OptionRadio[];
}

// Define la interfaz para el contexto de actividad
export interface TrueFalseContextType {
  addRadiosValues: (option: OptionRadio) => void;
  handleValidation: () => void;
  handleReset: () => void;
  validation: boolean;
  button: boolean;
  result: boolean;
  options: OptionRadio[];
  addRadioElementsId: (uid: string) => void;
}

// Enumeración para los estados posibles
export enum States {
  SUCCESS = 'success',
  WRONG = 'wrong'
}
