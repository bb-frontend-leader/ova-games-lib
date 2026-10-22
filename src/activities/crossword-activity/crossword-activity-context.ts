import { createContext } from 'books-ui';

import type { CrosswordContextType } from './types/types';

export const [CrosswordActivityProvider, useCrosswordActivityContext] = createContext<CrosswordContextType>({
  name: 'CrosswordActivityContext'
});
