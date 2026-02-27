export type GameFishStates = 'wrong' | 'success';

export interface Option {
  id: string;
  state: GameFishStates;
  name: string;
  label: string; // - Añadido para capturar el texto del pez
}

export interface InitialState {
  validation: boolean;
  button: boolean;
  result: boolean;
  options: Option[];
  selectedLabel: string; // - Estado para el texto en la pregunta
}

export interface GameFishContextType extends InitialState {
  addSelectedOption: (option: Option) => void;
  handleValidation: () => void;
  handleReset: () => void;
}
