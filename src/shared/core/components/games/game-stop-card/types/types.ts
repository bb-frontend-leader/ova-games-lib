export type RadioStates = 'wrong' | 'success';

// Opción marcada (radio). `name` es el grupo (por pregunta) y `id` el input.
export interface Radio {
  id: string;
  state: RadioStates;
  name: string;
}

export interface InitialState {
  validation: boolean;
  button: boolean;
  result: boolean;
  options: Radio[];

  activeSceneId: string | null;
  lastValidatedSceneId: string | null;
  validatedTick: number;

  validatedByScene: Record<string, boolean>;
  resultByScene: Record<string, boolean>;
}

export interface StopGameContextType {
  listStop: (string | null)[];
  updateListStop: (value: string) => void;
  adduuidList: (id: string) => void;

  // Acciones
  addRadiosValues: (radio: Radio) => void;
  handleValidation: () => void;
  handleReset: () => void;

  setActiveSceneId: (id: string) => void;

  questionCount: number;

  game: InitialState;
}

// Enumeración para los estados posibles
export enum States {
  SUCCESS = 'success',
  WRONG = 'wrong'
}
