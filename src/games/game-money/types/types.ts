export type RadioStates = 'wrong' | 'success';

// Representa una pregunta con su texto y una indicación de si es correcta.
export interface Option {
  id: string;
  state: RadioStates;
  name: string;
  /** Texto de la opción, para anunciar qué se eligió. */
  label?: string;
}

// Define la interfaz para el estado inicial de la actividad
export interface InitialState {
  validation: boolean;
  button: boolean;
  result: boolean;
  options: Option[];
  /** Veces que se ha comprobado la respuesta desde el inicio (los reintentos suman). */
  attempts: number;
  /** El banquero ya soltó el dinero: se muestra la pantalla final. */
  finished: boolean;
}

// Define la interfaz para el contexto de actividad de selección de opciones
export interface GameMoneyContextType {
  addSelectedOption: (option: Option) => void;
  addRadioElementsId: (uid: string) => void;
  handleValidation: () => void;
  handleReset: () => void;
  /** Vuelve a empezar de cero (intentos incluidos); es el botón de la pantalla final. */
  handleRestart: () => void;

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
