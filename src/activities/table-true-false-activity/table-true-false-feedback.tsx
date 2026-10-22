import { useId } from 'react';

import { useLang } from '@/hooks';

import { i18n } from './lib/constant';
import { useTableTrueFalseContext } from './table-true-false-context';

import css from './table-true-false.module.css';

interface Props {
  id: string;
  success: {
    feedback: string;
  };
  wrong: {
    feedback: string;
  };

  addClass?: string;
}

export const Feedback: React.FC<Props> = ({ id, success, wrong, addClass }) => {
  const lang = useLang();
  const { searchOptionResultById, validation } = useTableTrueFalseContext();

  const uid = useId();

  const result = searchOptionResultById(id);

  return (
    validation && (
      <div
        data-result={result}
        className={`${css['feedback']} u-mt-2 u-mb-3 ${addClass ?? ''}`}
        aria-live="polite"
        aria-labelledby={uid}
        role="status"
      >
        <div className={css.icon} aria-hidden="true">
          {result ? '✓' : '✕'}
        </div>
        <div className="u-flow">
          <p className={css['feedback__title']}>{i18n[lang][result ? 'success' : 'wrong']}</p>
          <p id={uid} dangerouslySetInnerHTML={{ __html: result ? success.feedback : wrong.feedback }}></p>
        </div>
      </div>
    )
  );
};
