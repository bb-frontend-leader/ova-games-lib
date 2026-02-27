import { createContext } from 'books-ui';

import type { TrueFalseContextType } from './tyes/types';

export const [TrueFalseContextProvider, useTrueFalseContext] = createContext<TrueFalseContextType>({
  name: 'TrueFalseContext'
});
