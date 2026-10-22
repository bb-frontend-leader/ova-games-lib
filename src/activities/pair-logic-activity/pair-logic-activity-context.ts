import { createContext } from 'books-ui';

import type { PairLogicContextType } from './types/types';

export const [PairLogicActivityProvider, usePairLogicActivityContext] = createContext<PairLogicContextType>({
  name: 'PairLogicActivityContext'
});
