import { createContext } from 'books-ui';

import type { ThisOrThatGameContextType } from './types/types';

export const [ThisOrThatGameProvider, useThisOrThatGameContext] = createContext<ThisOrThatGameContextType>({
  name: 'ThisOrThatGameContext'
});
