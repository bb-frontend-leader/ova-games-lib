import React, { useId, useRef, useState } from 'react';
import { Audio } from 'books-ui';

import { useOvaContext } from '@/context/ova-context';

import { ArrowBack, ArrowForward } from './icons/Icons';
import { i18n } from './const';

import css from './crossword-input.module.css';

interface CrosswordInputProps {
  onAnswer: (data: { word: string; answer: string; array: string[] }) => void;
  number: string;
  hasSpace?: boolean;
  length: number;
  rightAnswer: string;
  label: string;
  handleWordClick: (event: React.MouseEvent<HTMLButtonElement>, currentQuestionId: number) => void;
  currentQuestionId: number;
  audio?: string;
  arrayQuantity: number;
  addClass?: string;
  validation: string[];
}

export const CrosswordInput: React.FC<CrosswordInputProps> = ({
  onAnswer,
  number,
  hasSpace = false,
  length,
  rightAnswer,
  label,
  handleWordClick,
  currentQuestionId = 1,
  audio,
  arrayQuantity,
  addClass,

  validation
}) => {
  const { lang } = useOvaContext();
  const id = useId();
  const [answer, setAnswer] = useState<string>('');
  const [message, setMessage] = useState<string | undefined>();
  const refInput = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const answerToArray = answer
      .toUpperCase()
      .split('')
      .filter((element) => element !== ' ');
    onAnswer({
      word: answer.toUpperCase(),
      answer: rightAnswer.toUpperCase(),
      array: answerToArray
    });
    setMessage('');
    setTimeout(() => {
      setMessage('Respuesta agregada');
    }, 150);
  };

  const prevQuestion = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (currentQuestionId <= 1) return;
    handleWordClick(event, currentQuestionId - 1);
  };

  const nextQuestion = (event: React.MouseEvent<HTMLButtonElement>, lengthArray: number = arrayQuantity) => {
    if (currentQuestionId >= lengthArray) return;
    handleWordClick(event, currentQuestionId + 1);
  };

  const currentValidation = validation[currentQuestionId - 1];
  const isDisabled = currentValidation === 'right';

  return (
    <div className={`${css['crossword-question']} ${addClass} u-flow`}>
      {audio && <Audio src={audio} size="small" />}
      <div className={css['crossword-content']}>
        <p className={`u-text-center u-fs-400 ${css['crossword-title']}`}>{i18n[lang].pistas}</p>

        <div className={css['crossword-icons']}>
          <button disabled={currentQuestionId === 1} aria-label={`${i18n[lang].anterior} `} onClick={prevQuestion}>
            <ArrowBack styles={{ fill: currentQuestionId === 1 ? 'gray' : '#0f4f80' }} />
          </button>
          <p className={`u-text-center ${css['number-activity']} u-fs-500 `}>{number}</p>
          <button disabled={currentQuestionId === 16} aria-label={`${i18n[lang].siguiente} `} onClick={nextQuestion}>
            <ArrowForward styles={{ fill: currentQuestionId === arrayQuantity ? 'gray' : '#0f4f80' }} />
          </button>
        </div>
      </div>

      <form className="u-mt-2" onSubmit={handleSubmit}>
        <div className={css.clipPath}>
          <label htmlFor={`crossword${id}`}>{label}</label>
        </div>
        <div className={css['crossword-content']}>
          <div className={css.clipPath} data-input>
            <input
              id={`crossword${id}`}
              type="text"
              required
              minLength={length}
              maxLength={length}
              onChange={(event) => setAnswer(event.target.value)}
              value={answer}
              pattern={`([a-zA-Z${hasSpace ? ' ' : ''}]|[à-ü]|[À-Ü]){${length}}`}
              title={`${i18n[lang].requiere} ${hasSpace ? length - 1 : length} ${i18n[lang].letras}${
                hasSpace ? `. ${i18n[lang].titleInput}.` : '.'
              }`}
              ref={refInput}
              disabled={isDisabled}
            />
          </div>
          <div className="u-sr-only" role="status">
            {message}
          </div>
          <button disabled={isDisabled} className={`u-my-3 u-mx-auto ${css['button-added-answer']}`} type="submit">
            {' '}
            {i18n[lang].label}
          </button>
        </div>
      </form>
    </div>
  );
};
