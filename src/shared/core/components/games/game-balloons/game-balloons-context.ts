import { createContext } from 'books-ui';

import type { GameBalloonsContextType } from './types/types';

export const [GameBalloonsProvider, useGameBalloonsContext] = createContext<GameBalloonsContextType>({
  name: 'GameBallonsContext'
});