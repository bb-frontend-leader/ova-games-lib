import { cloneElement } from 'react';

import { useStopGame } from './stop-card-context';

interface Props {
  type?: 'reset';
  sceneId: string;
  children: React.ReactElement;
}

export const StopCardButton: React.FC<Props> = ({ type, sceneId, children }) => {
  const { handleValidation, handleReset, game } = useStopGame();
  
  const validated = sceneId ? Boolean(game.validatedByScene?.[sceneId]) : false;
  const correct = sceneId ? Boolean(game.resultByScene?.[sceneId]) : false;

  const disabled =
    type !== 'reset'
      ? // Validar: solo se habilita si es la escena activa
        !sceneId || validated 
        ? true
        : game.button
      : // Reset: solo aplica si esta escena fue la validada más reciente
        !sceneId || !validated || correct
        ? true
        : game.validation
          ? game.result
          : true;

  return cloneElement(children, {
    ...children.props,
    disabled: disabled,
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
      if (children.props.onClick) {
        children.props.onClick(event);
      }
      (type === 'reset' ? handleReset : handleValidation)();
    }
  });
};
