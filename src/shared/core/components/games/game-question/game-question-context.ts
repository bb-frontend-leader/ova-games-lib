import { createContext } from 'books-ui';

import type { GameQuestionContextType } from './types/types';

export const [GameQuestionProvider, useGameQuestionContext] = createContext<GameQuestionContextType>({
  name: 'GameQuestionContext'
});
