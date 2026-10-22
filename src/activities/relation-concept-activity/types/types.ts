export type Option = {
  id: string;
  label: string;
  pair: number;
  /** Texto alternativo cuando `label` es una imagen (si se omite se anuncia un nombre genérico). */
  alt?: string;
};

/** Tarjeta devuelta en `onResult`: las de una pareja incorrecta llevan `isIncorrect`. */
export type ResolvedOption = Option & { isIncorrect?: boolean };

/** Vínculo entre dos tarjetas. `correct` solo existe una vez comprobada la actividad. */
export type Link = {
  /** Posición del vínculo (1 = A, 2 = B…): se reutiliza el hueco libre más bajo al deshacer uno. */
  slot: number;
  first: Option;
  second: Option;
  correct?: boolean;
};

export type OnResultData = {
  result: boolean;
  options: ResolvedOption[];
  correctCount: number;
  total: number;
};

export interface InitialState {
  validation: boolean;
  result: boolean;
  /** Primera tarjeta de un vínculo a medio hacer. */
  pending: Option | null;
  links: Link[];
  /** Tarjetas de parejas correctas ya comprobadas: se conservan al reintentar. */
  locked: Option[];
  /** Mensaje para la región en vivo (lectores de pantalla). */
  announcement: string;
}

export interface RelationConceptActivityContextType {
  selectCard: (option: Option) => void;
  cancelSelection: () => void;
  handleValidation: () => void;
  handleReset: () => void;
  pending: Option | null;
  links: Link[];
  locked: Option[];
  validation: boolean;
  /** true = el botón Comprobar está deshabilitado. */
  button: boolean;
  result: boolean;
  announcement: string;
  pairs: Option[];
}
