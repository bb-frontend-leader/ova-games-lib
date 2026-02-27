import { createContext } from 'books-ui';

import type { ThisOrThatActivityContextType } from './types/types';

export const [ThisOrThatActivityProvider, useThisOrThatActivityContext] = createContext<ThisOrThatActivityContextType>({
  name: 'ThisOrThatActivityContext'
});
