import { useId } from 'react';

import { SOUNDS } from '@/constants';
import { useLang, usePlaySound } from '@/hooks';

import { i18n } from './lib/constant';
import { useTableTrueFalseContext } from './table-true-false-context';

import css from './table-true-false.module.css';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  addClass?: string;
  label: string;
  correct: boolean;
  variant?: 'yesno' | 'truefalse';
}

const ANSWERS = [true, false] as const;

export const TrueFalseOption: React.FC<Props> = ({ id, addClass, correct, label, variant = 'truefalse', ...props }) => {
  const reactId = useId();
  const uid = id || reactId;

  const lang = useLang();
  const playSound = usePlaySound();
  const { addOptionValues, validation, selectedIds } = useTableTrueFalseContext();

  const selectOption = (answer: boolean) => {
    playSound(SOUNDS.TICK);
    addOptionValues(id, answer);
  };

  /**
   * Estado visual del interruptor, el mismo `data-state` que usa TrueFalseActivity: solo la respuesta
   * elegida se marca (correcta o incorrecta) y solo después de validar.
   * @param {boolean} answer - la respuesta que representa el interruptor.
   */
  const getState = (answer: boolean) => {
    if (!validation || selectedIds[id] !== answer) return undefined;

    return correct === answer ? 'right' : 'wrong';
  };

  return (
    <div className={`${css.optionContainer} ${addClass ?? ''}`}>
      <p id={`question-${uid}`} className={css.list}>
        <span>{id}.</span>
        {label}
      </p>

      <div className={css.buttons} role="radiogroup" aria-labelledby={`question-${uid}`}>
        {ANSWERS.map((answer) => {
          const inputId = `${uid}-${answer}`;

          return (
            <div key={inputId} className={css.answer}>
              <span className={css.answer__dot} aria-hidden="true" />
              <label className={css.answer__label} htmlFor={inputId}>
                {i18n[lang as keyof typeof i18n][variant][answer ? 'true' : 'false']}
              </label>
              <input
                type="radio"
                id={inputId}
                name={`option-${id}`}
                data-state={getState(answer)}
                disabled={validation}
                checked={selectedIds[id] === answer}
                onChange={() => selectOption(answer)}
                {...props}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
