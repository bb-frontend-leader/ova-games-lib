import { createContext } from 'books-ui';

import type { GameLegoContextType } from './types/types';

export const [GameLegoProvider, useGameLegoContext] = createContext<GameLegoContextType>({
  name: 'GameLegoContext'
});
