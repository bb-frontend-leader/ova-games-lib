import { cloneElement } from 'react';

import { useGameContext } from './race-card-context';

interface Props {
  type?: 'reset';
  sceneId: string;
  children: React.ReactElement;
}

export const RaceCardButton: React.FC<Props> = ({ type, sceneId, children }) => {
  const { handleValidation, handleReset, button, validation, result, game } = useGameContext();

  const isThisSceneActive = game.activeSceneId === sceneId;
  const isThisSceneValidated = game.lastValidatedSceneId === sceneId;

  const disabled =
    type !== 'reset'
      ? // Validar: solo se habilita si es la escena activa
        !isThisSceneActive
        ? true
        : button
      : // Reset: solo aplica si esta escena fue la validada más reciente
        !isThisSceneValidated
        ? true
        : validation
          ? result
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
