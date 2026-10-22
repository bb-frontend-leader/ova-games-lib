import { createContext } from 'books-ui';

import type { GameMillionsContextType } from './types/types';

export const [GameMillionProvider, useGameMillionContext] = createContext<GameMillionsContextType>({
  name: 'GameMillionContext'
});
