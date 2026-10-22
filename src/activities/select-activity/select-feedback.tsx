import { useId } from 'react';

import { useLang } from '@/hooks';

import { useSelectActivityContext } from './select-activity-context';

import css from './select.module.css';

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

export const SelectFeedback: React.FC<Props> = ({ id, success, wrong, addClass }) => {
  const lang = useLang();
  const { selectedOptions, validation } = useSelectActivityContext();

  const uid = useId();

  // Busca el resultado de ESTE select por su id
  const selected = selectedOptions.find((option) => option.id === id);
  const result = selected?.state === 'success';

  const i18n = { en: { success: 'CORRECT!', wrong: 'WRONG!' }, es: { success: '¡CORRECTO!', wrong: '¡INCORRECTO!' } };

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
          <h2 className={css['feedback__title']}>{i18n[lang][result ? 'success' : 'wrong']}</h2>
          <p id={uid} dangerouslySetInnerHTML={{ __html: result ? success.feedback : wrong.feedback }}></p>
        </div>
      </div>
    )
  );
};
