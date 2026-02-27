import { createContext } from 'books-ui';

import type { RelationConceptActivityContextType } from './types/types';

export const [RelationConceptActivityProvider, useRelationConceptActivityContext] = createContext<RelationConceptActivityContextType>({
  name: 'RelationConceptActivityContext'
});
