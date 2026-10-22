/** Una pareja: la imagen y el texto que comparten el mismo `id` se corresponden. */
export type Pair = {
  id: string;
  image: {
    src: string;
    /** Texto alternativo: se anuncia con lectores de pantalla y es el nombre de la tarjeta. */
    alt: string;
  };
  text: string;
};

/** Columna de elección: se elige una imagen y un texto por intento. */
export type Side = 'image' | 'text';

/** Resultado del último intento: se mantiene hasta que cambia la elección. */
export type Verdict = 'right' | 'wrong';

/** Estado visual de una tarjeta o de su recuadro: elegida, incorrecta o ya resuelta. */
export type CardState = 'selected' | 'wrong' | 'matched';

export type OnResultData = {
  /** La imagen y el texto elegidos forman pareja. */
  result: boolean;
  imageId: string;
  textId: string;
  /** Parejas resueltas tras este intento. */
  matched: number;
  total: number;
  /** Este intento resolvió la última pareja que faltaba. */
  complete: boolean;
};

export interface State {
  /** Imagen y texto elegidos, los que muestran los recuadros. Tras un acierto se quedan hasta la siguiente elección. */
  imageId: string | null;
  textId: string | null;
  verdict: Verdict | null;
  /** Ids de las parejas resueltas, en el orden en que se resolvieron. */
  matched: string[];
  /** Orden en que se listan los textos. */
  textOrder: string[];
}

export interface PairLogicContextType {
  /** Prefijo de los ids del DOM (inputs y botón de reinicio). */
  uid: string;
  /** Parejas en el orden recibido (el de las imágenes). */
  pairs: Pair[];
  /** Parejas en el orden en que se listan los textos. */
  texts: Pair[];
  imageId: string | null;
  textId: string | null;
  verdict: Verdict | null;
  matched: string[];
  /** Todas las parejas están resueltas. */
  complete: boolean;
  /** Hay una imagen y un texto elegidos sin comprobar. */
  canCheck: boolean;
  select: (side: Side, id: string) => void;
  handleValidation: () => void;
  handleReset: () => void;
}
