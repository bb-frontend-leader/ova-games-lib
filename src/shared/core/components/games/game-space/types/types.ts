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

export interface GameSpaceContextType {
  addOptionValues: (option: Option) => void;
  handleValidation: () => void;
  handleReset: () => void;
  addOptionElementsId: (uid: string) => void;

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
