export type RadioStates = 'wrong' | 'success';

// Define el tipo Option que representa una opción individual en la actividad
export type Option = {
  id: string;
  state: RadioStates;
  name: string;
};

// Define la interfaz InitialState que representa el estado inicial de la actividad
export interface InitialState {
  validation: boolean;
  button: boolean;
  result: boolean;
  options: Option[];
}

// Define la interfaz para el contexto de actividad
export interface RadioBasketActivityContextType {
  addRadiosValues: (option: Option) => void;
  handleValidation: () => void;
  handleReset: () => void;
  addRadioElementsId: (uid: string) => void;

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
