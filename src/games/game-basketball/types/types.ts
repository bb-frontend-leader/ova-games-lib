export type RadioStates = 'wrong' | 'success';

// Define el tipo Option que representa una opción individual en la actividad
export type Option = {
  id: string;
  state: RadioStates;
  name: string;
  /** Letra de la canasta («A»), para anunciar a cuál se apunta. */
  letter?: string;
};

// Define la interfaz InitialState que representa el estado inicial de la actividad
export interface InitialState {
  validation: boolean;
  button: boolean;
  result: boolean;
  options: Option[];
  /** Puntos del partido (se conservan entre tiros). */
  score: number;
  /** Canastas seguidas sin fallar. */
  streak: number;
  bestStreak: number;
  /** Puntos que dejó el último tiro. */
  gained: number;
  made: number;
  missed: number;
  /** Los puntos del último tiro ya llegaron al marcador (el balón entró y el puntaje viajó). */
  landed: boolean;
  /** El balón ya llegó al aro: desde aquí se ve si la canasta fue buena (antes se adelantaría el resultado). */
  revealed: boolean;
  /** Se muestra el marcador final en lugar de la cancha. */
  finished: boolean;
}

/** Lo que recibe `onResult` al terminar cada tiro. */
export interface GameResult {
  result: boolean;
  options: Option[];
  /** Puntos del partido después del tiro. */
  score: number;
  /** Puntos que dejó este tiro (0 si falló). */
  gained: number;
  /** Racha de canastas después del tiro. */
  streak: number;
  made: number;
  missed: number;
}

// Define la interfaz para el contexto de actividad
export interface RadioBasketActivityContextType extends InitialState {
  addRadiosValues: (option: Option) => void;
  handleValidation: () => void;
  handleReset: () => void;
  addRadioElementsId: (uid: string) => void;
  openFinal: () => void;

  canAnimate: boolean;
  levelRef: React.RefObject<HTMLDivElement>;
  fxRef: React.RefObject<HTMLDivElement>;
}

// Enumeración para los estados posibles
export enum States {
  SUCCESS = 'success',
  WRONG = 'wrong'
}
