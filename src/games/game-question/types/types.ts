export type RadioStates = 'wrong' | 'success';

export type Option = {
  id: string;
  name: string;
  state: RadioStates;
  /** Texto de la respuesta elegida (lo usa la tarjeta para completar el enunciado). */
  label?: string;
};

export interface InitialState {
  validation: boolean;
  button: boolean;
  result: boolean;
  options: Option[];
}

// Define la interfaz para el contexto de actividad
export interface GameQuestionContextType {
  addRadiosValues: (option: Option) => void;
  handleValidation: () => void;
  handleReset: () => void;
  addElementsId: (uid: string) => void;

  validation: boolean;
  button: boolean;
  result: boolean;
  options: Option[];
}

// Lo que cada tarjeta comparte con sus respuestas
export interface GameQuestionCardContextType {
  /** La respuesta avisa a su tarjeta de que le pertenece (así la tarjeta sabe cuál es su elección). */
  register: (id: string) => void;
}

// Enumeración para los estados posibles
export enum States {
  SUCCESS = 'success',
  WRONG = 'wrong'
}
