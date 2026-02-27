export type Option = {
    id: string;
    label: string;
    pair: number;
}

// Define el estado inicial
export interface InitialState {
    validation: boolean;
    button: boolean;
    result: boolean;
    selectedPairs: { id: string; label: string; pair: number }[];
    correctPairs: { id: string; label: string; pair: number, isIncorrect?: boolean }[];
}

// Define la interfaz para el contexto de actividad de selección
export interface RelationConceptActivityContextType {
    addSelectedPair: (pair: { id: string; label: string; pair: number }) => void;
    handleValidation: () => void;
    handleReset: () => void;
    selectedPairs: { id: string; label: string; pair: number }[];
    correctPairs: { id: string; label: string; pair: number, isIncorrect?: boolean }[];
    validation: boolean;
    button: boolean;
    result: boolean;
    pairs: Option[];
}

// Enumeración para los estados posibles
export enum States {
    SUCCESS = "success",
    WRONG = "wrong",
}
  
  