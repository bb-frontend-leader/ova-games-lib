import { createContext } from 'books-ui';

import type { CardType } from './types/types';

export interface MemoryContextType {
  cards: CardType[];
  buttonsDisabled: boolean;
  isReset: boolean;
  lang: 'es' | 'en';
  /** Veces que se voltearon dos cartas. */
  moves: number;
  /** Se están devolviendo dos cartas que no coinciden: no se puede voltear otra. */
  locked: boolean;
  /** Todas las parejas están descubiertas. */
  done: boolean;
  /** Lo último que pasó en el tablero, dicho para lectores de pantalla. */
  message: string;
  boardRef: React.RefObject<HTMLDivElement>;
  fxRef: React.RefObject<HTMLDivElement>;
  handleCardClick: (index: number) => void;
  checkGameStatus: () => void;
  restartGame: () => void;
  registerCard: (card: Omit<CardType, 'flipped' | 'matched'>) => void;
}

export const [MemoryActivityProvider, useMemoryActivityContext] = createContext<MemoryContextType>({
  name: 'MemoryActivityContext'
});
