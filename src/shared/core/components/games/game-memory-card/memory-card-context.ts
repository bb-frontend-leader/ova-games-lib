import { createContext } from 'books-ui';

import { CardType } from './types';

export interface MemoryContextType {
  cards: CardType[];
  buttonsDisabled: boolean;
  isReset: boolean;
  lang: 'es' | 'en';
  handleCardClick: (index: number) => void;
  checkGameStatus: () => void;
  restartGame: () => void;
  registerCard: (card: Omit<CardType, 'flipped' | 'matched'>) => void;
}

export const [MemoryActivityProvider, useMemoryActivityContext] = createContext<MemoryContextType>({
  name: 'MemoryActivityContext'
});
