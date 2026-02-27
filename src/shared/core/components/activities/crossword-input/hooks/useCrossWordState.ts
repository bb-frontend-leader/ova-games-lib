import { useEffect, useState } from 'react';

type Answer = {
  word: string;
  array: string[];
  answer?: string;
  isReady: boolean;
};

export type AnswersState = Record<string, Answer>;

/**
 * Generates the initial state for answers.
 * @param {number} totalQuestions - The total number of questions.
 * @returns {AnswersState} - An object with initial state for each question.
 */
const generateInitialState = (totalQuestions: number): AnswersState => {
  return Array.from({ length: totalQuestions }, (_, i) => `question${i + 1}`).reduce((acc, key) => {
    acc[key] = { word: '', array: [], isReady: false };
    return acc;
  }, {} as AnswersState);
};

/**
 * Custom hook to manage the crossword state.
 * @param {number} totalQuestions - The total number of questions (default is 5).
 * @returns {Object} - The state and handlers for the crossword.
 */
export const useCrossWordState = (totalQuestions: number = 5) => {
  const [answers, setAnswers] = useState<AnswersState>(generateInitialState(totalQuestions));
  const [showCrosswordInput, setShowCrosswordInput] = useState<boolean>(true);
  const [disabledButton, setDisabledButton] = useState({ button: true, reset: true });
  const [currentQuestionId, setCurrentQuestionId] = useState<number>(1);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [validation, setValidation] = useState<string[]>(Array(totalQuestions).fill(''));

  /**
   * Effect to update button states based on the current question's answer and validation state.
   */
  useEffect(() => {
    const currentQuestionKey = `question${currentQuestionId}` as keyof AnswersState;
    const currentAnswer = answers[currentQuestionKey]?.word || '';
    const currentValidation = validation[currentQuestionId - 1];
    const isReady = answers[currentQuestionKey]?.isReady;

    if (!currentAnswer) {
      return;
    }

    setDisabledButton((prev) => ({ ...prev, button: false, reset: true }));

    if (currentValidation === 'right') {
      setDisabledButton((prev) => ({ ...prev, button: true, reset: true }));
    } else if (currentValidation === 'wrong' && isReady) {
      setDisabledButton((prev) => ({ ...prev, button: true, reset: false }));
    }
  }, [answers, validation, currentQuestionId]);

 

  /**
   * Validates the crossword answer for a specific position.
   * @param {number} position - The index of the question being validated.
   * @returns {string} - The validation result ("right" or "wrong").
   */
  const validateCrossword = (position: number): string => {
    const nextValidation = Object.keys(answers).map((key) =>
      answers[key].word === answers[key].answer ? 'right' : 'wrong'
    );

    const result = nextValidation[position];

    setDisabledButton((prev) => ({
      ...prev,
      button: true,
      reset: result === 'right'
    }));

    setValidation(nextValidation);
    setChecked((prev) => ({
      ...prev,
      [`question${currentQuestionId}`]: true
    }));

    return result;
  };

  /**
   * Handles validation of the current crossword answer.
   * @param {number} position - The index of the question to validate.
   * @returns {string} - The validation result.
   */
  const handleValidation = (position: number): string => {
    setAnswers((prev) => ({
      ...prev,
      [`question${currentQuestionId}`]: {
        ...prev[`question${currentQuestionId}`],
        isReady: true
      }
    }));

    return validateCrossword(position);
  };

  /**
   * Resets incorrect answers while keeping correct ones.
   */
  const handleReset = () => {
    setAnswers((prev) => {
      const newAnswers = { ...prev };
      Object.keys(newAnswers).forEach((key, index) => {
        if (validation[index] === 'wrong') {
          newAnswers[key] = { word: '', array: [], isReady: false };
        }
      });
      return newAnswers;
    });

    setDisabledButton({ button: true, reset: true });

    setValidation((prev) => prev.map((status) => (status === 'wrong' ? '' : status)));

    setChecked((prev) => {
      const newChecked = { ...prev };
      Object.keys(newChecked).forEach((key, index) => {
        if (validation[index] === 'wrong') {
          newChecked[key] = false;
        }
      });
      return newChecked;
    });
  };

  /**
   * Handles the click event on a word to select a crossword question.
   * @param {React.MouseEvent<HTMLButtonElement>} event - The click event.
   * @param {number} questionId - The ID of the question to select.
   */
  const handleWordClick = (event: React.MouseEvent<HTMLButtonElement>, questionId: number) => {
    event.stopPropagation();
    setShowCrosswordInput(true);
    setCurrentQuestionId(questionId);
  };

  return {
    answers,
    showCrosswordInput,
    currentQuestionId,
    checked,
    validation,
    handleValidation,
    handleReset,
    handleWordClick,
    setAnswers,
    setShowCrosswordInput,
    setCurrentQuestionId,
    disabledButton
  };
};
