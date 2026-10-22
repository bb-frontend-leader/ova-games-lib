import { ValidationStatus } from '@/components/ui';

import { useTrueFalseContext } from './true-false-context';

export const TrueFalseFeedback: React.FC = () => {
  const { validation, result } = useTrueFalseContext();

  return <ValidationStatus validated={validation} correct={result} />;
};
