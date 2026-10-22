import { createContext } from 'books-ui';

import type { GameQuestionCardContextType, GameQuestionContextType } from './types/types';

export const [GameQuestionProvider, useGameQuestionContext] = createContext<GameQuestionContextType>({
  name: 'GameQuestionContext'
});

export const [GameQuestionCardProvider, useGameQuestionCardContext] = createContext<GameQuestionCardContextType>({
  name: 'GameQuestionCardContext'
});
