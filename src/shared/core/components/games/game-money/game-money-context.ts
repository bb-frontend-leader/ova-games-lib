import { createContext } from 'books-ui';

import type { GameMoneyContextType } from './types/types';

export const [GameMoneyActivityProvider, useGameMoneyActivityContext] = createContext<GameMoneyContextType>({
  name: 'GameMoneyActivityContext'
});