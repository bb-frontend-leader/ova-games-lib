export type RadioStates = 'wrong' | 'success';

// Opción marcada (radio). `name` es el grupo (por pregunta) y `id` el input.
export interface Radio {
  id: string;
  state: RadioStates;
  name: string;
}

/** Estado de una parada (escena): su elección, si ya se comprobó y los tropiezos acumulados. */
export interface SceneState {
  /** Posición de la parada en el camino (0 = primera). */
  index: number;
  choice: Radio | null;
  status: 'idle' | 'correct' | 'wrong';
  /** Respuestas equivocadas en esta parada. */
  mistakes: number;
  /** Ids de las opciones descartadas (ya se probaron y eran incorrectas). */
  discarded: string[];
}

/** Última comprobación: la escena que la hizo la usa para animar y entregar `onResult`. */
export interface CheckEvent {
  tick: number;
  sceneId: string;
  correct: boolean;
  options: Radio[];
  mistakes: number;
  /** Con esta respuesta se completaron todas las paradas. */
  finished: boolean;
}

export interface StopGameContextType {
  questionCount: number;
  scenes: Record<string, SceneState>;
  lastCheck: CheckEvent | null;

  /** Índice (0-based) de la parada en la que espera el viajero; igual a `questionCount` al llegar a la meta. */
  currentStop: number;
  finished: boolean;
  /** Tropiezos de todo el viaje. */
  mistakesTotal: number;
  /** Avance (0-1) del viajero por la carretera: retrocede un tramo con cada tropiezo. */
  travelerT: number;

  registerScene: (id: string) => number;
  choose: (sceneId: string, index: number, radio: Radio) => void;
  check: (sceneId: string) => void;
  retry: (sceneId: string) => void;
}

/** Lo que una escena comparte con sus respuestas. */
export interface StopSceneContextType {
  id: string;
  index: number;
  /** La parada anterior aún no se completó: no se puede responder. */
  locked: boolean;
  status: SceneState['status'];
  choice: Radio | null;
  discarded: string[];
  choose: (radio: Radio) => void;
}

// Enumeración para los estados posibles
export enum States {
  SUCCESS = 'success',
  WRONG = 'wrong'
}
