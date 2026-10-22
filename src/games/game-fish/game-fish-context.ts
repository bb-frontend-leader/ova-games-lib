import { createContext } from 'books-ui';

import type { GameFishContextType } from './types/types';

export const [GameFishActivityProvider, useGameFishActivityContext] = createContext<GameFishContextType>({
  name: 'GameFishActivityContext'
});
