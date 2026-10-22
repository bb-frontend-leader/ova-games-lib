import { createContext } from 'books-ui';

import type { GameCastleContextType } from './types/game-castle-context';

export const [GameCastleProvider, useGameCastleContext] = createContext<GameCastleContextType>({
  name: 'GameCastleContext'
});
