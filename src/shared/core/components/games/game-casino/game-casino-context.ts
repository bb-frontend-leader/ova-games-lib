import { createContext } from 'books-ui';

import type { GameCasinoContextType } from './types/types';

// Esto crea el provider y el hook para usar el contexto
export const [GameCasinoProvider, useGameCasinoProvider] = createContext<GameCasinoContextType>({
  name: 'GameCasinoContext'
});
