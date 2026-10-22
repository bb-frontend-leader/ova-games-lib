import { ValidationStatus } from '@/components/ui';

import { useSelectGroupActivityContext } from './select-group-activity-context';

export const SelectGroupFeedback: React.FC = () => {
  const { validation, result } = useSelectGroupActivityContext();

  return <ValidationStatus validated={validation} correct={result} />;
};
