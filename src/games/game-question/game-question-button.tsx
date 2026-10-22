import { cloneElement, useEffect, useId } from 'react';

import { useGameQuestionContext } from './game-question-context';

interface Props {
  type?: 'reset';
  children: React.ReactElement;
}

export const GameQuestionButton: React.FC<Props> = ({ type, children }) => {
  const { handleValidation, handleReset, button, validation, result } = useGameQuestionContext();
  const buttonId = useId();

  const failed = validation && !result;

  // Tras una respuesta incorrecta, «Comprobar» se desactiva: el foco pasa a «Reintentar» en vez de perderse
  useEffect(() => {
    if (type !== 'reset' || !failed) return;

    const frame = requestAnimationFrame(() => {
      const active = document.activeElement as HTMLElement | null;
      const lost = !active || active === document.body || active.dataset.questionButton === 'check';

      if (lost) document.querySelector<HTMLElement>(`[data-question-id="${buttonId}"]`)?.focus({ preventScroll: true });
    });

    return () => cancelAnimationFrame(frame);
  }, [type, failed, buttonId]);

  return cloneElement(children, {
    ...children.props,
    'data-question-button': type ?? 'check',
    'data-question-id': buttonId,
    disabled: type !== 'reset' ? button : validation ? result : true,
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
      if (children.props.onClick) {
        children.props.onClick(event);
      }
      (type === 'reset' ? handleReset : handleValidation)();
    }
  });
};
