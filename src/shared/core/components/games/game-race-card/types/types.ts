export type RadioStates = 'wrong' | 'success';

// Opción marcada (radio). `name` es el grupo (por pregunta) y `id` el input.
export interface Radio {
  id: string;
  state: RadioStates;
  name: string;
}

// Estado del juego (score y progreso)
export interface RaceCardStateType {
  pointplayer1: number;
  pointplayer2: number;
  move1: number;
  move2: number;
  answeredCount: number;
  rightAnswers: number;

  validation: boolean;
  button: boolean;
  result: boolean;
  radios: Radio[];

  activeSceneId: string | null;
  lastValidatedSceneId: string | null;
}

// Contexto completo del juego
export interface RaceCardContextType {
  // Acciones
  addRadiosValues: (radio: Radio) => void;
  addElementId: (id: string) => void;
  handleValidation: () => void;
  handleReset: () => void;

  // Estado del juego (useReducer con Partial updates)
  game: RaceCardStateType;
  updateGame: React.Dispatch<Partial<RaceCardStateType>>;
  questionCount: number;

  // Flags usados por RaceCardInput y GameQuestionButton
  validation: boolean; // disabled de inputs
  button: boolean; // disabled del botón validar
  result: boolean; // última validación fue correcta (true) / incorrecta (false)

  // Radios elegidos (para checked controlado)
  radios: Radio[];
}

export interface ActivityOptions {
  validation?: boolean;
  button?: boolean;
  showFeedback?: boolean;
  lastFeedback?: boolean;
}

export interface DriversType {
  player?: string;
  machine?: string;
}

export type ModalName = 'correct' | 'incorrect' | 'final-success' | 'final-failure';
