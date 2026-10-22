import { createContext } from 'books-ui';

import type { StopGameContextType, StopSceneContextType } from './types/types';

export const [StopGameContextProvider, useStopGame] = createContext<StopGameContextType>({
  name: 'StopGameContext'
});

// Lo que cada parada (escena) comparte con sus respuestas
export const [StopSceneContextProvider, useStopScene] = createContext<StopSceneContextType>({
  name: 'StopSceneContext'
});
