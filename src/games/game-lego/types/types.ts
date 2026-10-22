export type RadioStates = 'wrong' | 'success';

export type Option = {
  id: string;
  name: string;
  state: RadioStates;
  /** Texto de la opción (con la letra delante) y color de su pieza: los usa el espacio donde encaja. */
  label?: string;
  color?: number;
};

export interface InitialState {
  validation: boolean;
  button: boolean;
  result: boolean;
  options: Option[];
}

export interface GameLegoContextType {
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
