import { cloneElement } from 'react';

import { getResetId } from './lib/utils';
import { usePairLogicActivityContext } from './pair-logic-activity-context';

interface Props {
  type?: 'reset';
  children: React.ReactElement;
}

export const PairLogicButton: React.FC<Props> = ({ type, children }) => {
  const { uid, canCheck, complete, handleValidation, handleReset } = usePairLogicActivityContext();
  const isReset = type === 'reset';

  return cloneElement(children, {
    // El id permite devolver el foco al botón de reinicio cuando la actividad termina.
    id: isReset ? (children.props.id ?? getResetId(uid)) : children.props.id,
    // Comprobar necesita una imagen y un texto; Reiniciar se habilita al resolver todas las parejas.
    disabled: isReset ? !complete : !canCheck,
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
      children.props.onClick?.(event);
      (isReset ? handleReset : handleValidation)();
    }
  });
};
