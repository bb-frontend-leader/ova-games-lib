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

// Define la interfaz para el contexto de actividad
export interface ThisOrThatActivityContextType {
    addRadiosValues: (option: Option) => void;
    handleValidation: () => void;
    handleReset: () => void;
    validation: boolean;
    button: boolean;
    result: boolean;
    addElementsId: (uid: string) => void;
    selectedId: string | null;
    setSelectedId: React.Dispatch<React.SetStateAction<string | null>>;
    options: Option[];
}
  
// Enumeración para los estados posibles
export enum States {
    SUCCESS = 'success',
    WRONG = 'wrong'
}