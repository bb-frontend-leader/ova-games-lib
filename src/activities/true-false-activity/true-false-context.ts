import { createContext } from 'books-ui';

import type { TrueFalseContextType } from './types/types';

export const [TrueFalseContextProvider, useTrueFalseContext] = createContext<TrueFalseContextType>({
  name: 'TrueFalseContext'
});
