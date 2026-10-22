import { ValidationStatus } from '@/components/ui';

import { useRadioActivityContext } from './radio-activity-context';

export const RadioFeedback: React.FC = () => {
  const { validation, result } = useRadioActivityContext();

  return <ValidationStatus validated={validation} correct={result} />;
};
