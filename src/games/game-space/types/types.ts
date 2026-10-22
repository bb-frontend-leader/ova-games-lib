export type RadioStates = 'wrong' | 'success';

export type Option = {
  id: string;
  name: string;
  state: RadioStates;
};

export interface InitialState {
  validation: boolean;
  button: boolean;
  result: boolean;
  options: Option[];
  /** Veces que se ha comprobado la respuesta desde el inicio (los reintentos suman). */
  attempts: number;
  /** El astronauta ya cumplió la misión: se muestra la pantalla final. */
  finished: boolean;
}

export interface GameSpaceContextType {
  addOptionValues: (option: Option) => void;
  handleValidation: () => void;
  handleReset: () => void;
  /** Vuelve a empezar de cero (intentos incluidos); es el botón de la pantalla final. */
  handleRestart: () => void;
  addOptionElementsId: (uid: string) => void;

  validation: boolean;
  button: boolean;
  result: boolean;
  options: Option[];
  attempts: number;
  finished: boolean;

  /** Raíz del juego (la usa el provider para devolver el foco a las opciones al reintentar). */
  rootRef: React.RefObject<HTMLDivElement>;
}

// Enumeración para los estados posibles
export enum States {
  SUCCESS = 'success',
  WRONG = 'wrong'
}
