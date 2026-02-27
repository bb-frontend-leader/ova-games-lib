import { createContext } from 'books-ui';

import type { RadioBasketActivityContextType } from './types/types';

export const [RadioBasketActivityProvider, useRadioBasketActivityContext] = createContext<RadioBasketActivityContextType>({
  name: 'RadioBasketActivityContext'
});
