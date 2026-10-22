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
}

// Define la interfaz para el contexto de actividad
export interface ThisOrThatGameContextType {
  addRadiosValues: (option: Option) => void;
  handleValidation: () => void;
  handleReset: () => void;
  addElementsId: (uid: string) => void;

  /** Contenedor del juego (lo asigna el `Level`): ahí se buscan las opciones para mover el foco y animarlas */
  rootRef: React.RefObject<HTMLDivElement>;

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
