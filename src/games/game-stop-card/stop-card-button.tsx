import { cloneElement } from 'react';

import { useStopGame } from './stop-card-context';

interface Props {
  /** Sin `type` comprueba la respuesta; con `reset` permite volver a intentarlo tras un fallo. */
  type?: 'reset';
  /** La parada (el `id` de `StopCard.Scene`) a la que pertenece el botón. */
  sceneId: string;
  children: React.ReactElement;
}

/**
 * Envoltorio de los botones «Comprobar» y «Reintentar»: la página los coloca donde quiera y este componente les da
 * el estado (desactivado según la parada) y la acción. Respeta el `onClick` que ya traiga el botón.
 */
export const StopCardButton: React.FC<Props> = ({ type, sceneId, children }) => {
  const { scenes, currentStop, registerScene, check, retry } = useStopGame();

  const scene = scenes[sceneId];
  const status = scene?.status ?? 'idle';
  const locked = registerScene(sceneId) > currentStop;

  const disabled = type === 'reset' ? status !== 'wrong' : locked || !scene?.choice || status !== 'idle';

  return cloneElement(children, {
    disabled,
    'data-stop-for': sceneId,
    'data-stop-button': type ?? 'check',
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
      children.props.onClick?.(event);

      if (type === 'reset') retry(sceneId);
      else check(sceneId);
    }
  } as object);
};
