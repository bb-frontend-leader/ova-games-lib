import { createContext } from 'books-ui';

import type { RaceCardContextType } from './types/types';

export const [ContextGame, useGameContext] = createContext<RaceCardContextType>({
  name: 'RaceCardContext'
});
