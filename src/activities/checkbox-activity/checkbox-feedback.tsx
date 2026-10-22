import { ValidationStatus } from '@/components/ui';

import { useCheckboxActivityContext } from './checkbox-activity-context';

export const CheckboxFeedback: React.FC = () => {
  const { validation, result } = useCheckboxActivityContext();

  return <ValidationStatus validated={validation} correct={result} />;
};
