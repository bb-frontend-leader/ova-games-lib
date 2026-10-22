import { ValidationStatus } from '@/components/ui';

import { useCrosswordActivityContext } from './crossword-activity-context';

export const CrosswordFeedback: React.FC = () => {
  const { validation, result } = useCrosswordActivityContext();

  return <ValidationStatus validated={validation} correct={result} />;
};
