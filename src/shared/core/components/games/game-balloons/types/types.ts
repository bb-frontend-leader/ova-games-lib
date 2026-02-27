
export interface TypeWord {
  word: string[];
  sentence?: string;
}

export interface InitialState {
  validation: boolean;
  button: boolean;
  result: boolean;
  option: TypeWord;
  userAnswer: string
  reset: boolean;
}

export interface GameBalloonsContextType {
  addBallonsValues: (option: TypeWord) => void;
  setUserAnswer: (answer: string) => void;
  handleValidation: () => void;
  handleReset: () => void;

  validation: boolean;
  button: boolean;
  result: boolean;
  reset: boolean;
  option: TypeWord;
}

// Enumeración para los estados posibles
export enum States {
  SUCCESS = 'success',
  WRONG = 'wrong'
}

// Definición del tipo para una opción de espacio
export type SpaceResult = {
  index: string;
  letter: string;
} | null;

