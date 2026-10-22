export interface gameMilionAnswer {
  id: string;
  name: string;
  state: 'wrong' | 'success';
  label: string;
}

export interface InitialState {
  validation: boolean;
  button: boolean;
  result: boolean;
  options: gameMilionAnswer[];
  level: number;
  money: number;
  selects: string[];
  isVerify: boolean;
  selectedLabel: string;
}

export interface GameMillionsContextType {
  handleStateClass: (id: string, state: 'success' | 'wrong') => string;
  handleChange: (event: React.FormEvent<HTMLInputElement>) => void;
  handleVerify: () => void;
  handleReset: () => void;
  verifySelect: () => boolean;
  addRadiosValues: (option: gameMilionAnswer) => void;
  addRadioElementsId: (uid: string) => void;
  /** Deja la pregunta ya respondida bien (al volver a una pregunta resuelta). */
  restoreSolved: (option: gameMilionAnswer) => void;
  solved: boolean;

  activity: InitialState;
  points: number;
}
