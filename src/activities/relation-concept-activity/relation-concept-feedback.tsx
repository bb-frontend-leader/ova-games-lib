import { ValidationStatus } from '@/components/ui';

import { useRelationConceptActivityContext } from './relation-concept-activity-context';

export const RelationConceptFeedback: React.FC = () => {
  const { validation, result } = useRelationConceptActivityContext();

  return <ValidationStatus validated={validation} correct={result} />;
};
