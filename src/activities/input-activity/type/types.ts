// Campo registrado en la actividad
export type Input = {
  id: string;
  name: string;
  correctAnswer: string[];
  userAnswer: string;
};

// Estado de la actividad. Los botones no se guardan: se derivan de `validation`, `result` e `inputs`.
export interface InitialState {
  validation: boolean;
  result: boolean;
  inputs: Input[];
}

export type InputAction =
  | { type: 'register'; input: Omit<Input, 'userAnswer'> }
  | { type: 'unregister'; id: string }
  | { type: 'change'; id: string; userAnswer: string }
  | { type: 'validate'; result: boolean }
  | { type: 'reset' };

// Define la interfaz para el contexto de actividad
export interface InputActivityContextType {
  inputs: Input[];
  validation: boolean;
  canValidate: boolean;
  canReset: boolean;
  registerInput: (input: Omit<Input, 'userAnswer'>) => void;
  unregisterInput: (id: string) => void;
  changeInput: (id: string, userAnswer: string) => void;
  handleValidation: () => void;
  handleReset: () => void;
}
