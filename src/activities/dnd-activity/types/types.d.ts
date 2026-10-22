// Define la interfaz InitialState que representa el estado inicial de la actividad
export interface InitialState {
  validation: boolean;
  button: boolean;
  result: boolean;
}

export interface DndActivityContextType extends InitialState {
  handleValidation: () => void;
  handleReset: () => void;
}
