import type { CarId } from '../lib/cars';
import type { TimeOfDay } from '../lib/time-of-day';

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

  // Lo que el jugador elige en la pantalla de inicio
  playerName: string;
  carId: CarId;

  // El jugador pidió ver el podio (solo posible cuando ya respondió todo)
  resultsOpen: boolean;
}

// Contexto completo del juego
export interface RaceCardContextType {
  // Acciones
  addRadiosValues: (radio: Radio) => void;
  addElementId: (id: string) => void;
  handleValidation: () => void;
  handleReset: () => void;
  openResults: () => void;

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

  // Ya se respondieron todas las preguntas (y la última sigue validada)
  finished: boolean;
  // El jugador alcanzó el porcentaje para ganar la carrera
  isWinner: boolean;
  // Franja del día que decide el fondo
  timeOfDay: TimeOfDay;
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
