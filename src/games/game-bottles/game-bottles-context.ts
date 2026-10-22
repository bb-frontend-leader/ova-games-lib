import { createContext } from 'books-ui';

import type { letterProp, spaceProp } from './types/types';

type GameBottleContextType = {
  targetWord: string;
  setTargetWord: (word: string) => void;
  words: letterProp[];
  spaces: (spaceProp | null)[];
  selectIndex: number;
  setSelectIndex: (index: number) => void;
  /** `source` es el botón de la botella: con movimiento permitido de ahí salen el corchazo y la letra en vuelo. */
  addLetter: (obj: letterProp, source?: HTMLButtonElement) => void;
  /** Quita la letra del espacio `index` (por defecto, el seleccionado). */
  removeLetter: (index?: number) => void;
  checkAnswer: () => void;
  reset: () => void;
  openModal: 'success' | 'wrong' | null;
  ALREADY_FILL: boolean;
  PARCIAL_WORD: string;
  containerRef: React.RefObject<HTMLElement>;
  /** Capa de efectos (burbujas, ondas, letra en vuelo) que dibuja `Parallax`. */
  fxRef: React.RefObject<HTMLDivElement>;
  /** Id del contenedor del juego: es el elemento que se muestra en pantalla completa. */
  rootId: string;
  /** false con "reducir movimiento" o "detener animaciones": no hay efectos de JS. */
  canAnimate: boolean;
  /** true un momento tras reintentar: las botellas reaparecen en cascada. */
  resetWave: boolean;
};

export const [GameBottleContextProvider, useGameBottleContext] = createContext<GameBottleContextType>({
  name: 'GameBottleContext'
});
