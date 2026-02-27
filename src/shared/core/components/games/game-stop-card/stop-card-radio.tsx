import { useEffect, useId, useMemo } from 'react';

import { RadioStates } from './types/types';
import { useStopGame } from './stop-card-context';

import css from './stop-card.module.css';

interface PropsStopCardRadio extends React.InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  addClass?: string;
  label: string;
  state: RadioStates;
}

export const StopCardRadio: React.FC<PropsStopCardRadio> = ({ id, label, state, name, addClass, ...props }) => {
  const reactId = useId();

  const { addRadiosValues, adduuidList, game } = useStopGame();
  const radioID = id || reactId;
  
  const radioName = `game-stop-group-${name}`;

  // Seleccionar si el radio está seleccionado
  const isSelected = useMemo(() => {
    return game.options?.some((opt) => opt.name === radioName && opt.id === radioID);
  }, [game.options, radioName, radioID]);

/**
 * Maneja el evento onChange.
 * Agrega un valor de radio seleccionado al estado de la actividad.
 * @param {React.ChangeEvent<HTMLInputElement>} event - Evento de cambio de radio
 */
  const handleChange = () => {
    addRadiosValues({ id: radioID, name: radioName, state });
  };

  /**
   * Agrega el nombre del grupo de radios a la lista de UUIDs al montar el componente.
   */
  useEffect(() => {
    adduuidList(radioName);
  }, [radioName, adduuidList]);

  return (
    <div className={`${css['radio-input']} ${addClass ?? ''}`} {...props}>
      <label htmlFor={radioID}>
        <span dangerouslySetInnerHTML={{ __html: label }} />
      </label>
      <input
        id={radioID}
        type="radio"
        name={radioName}
        value={state}
        onChange={handleChange}
        checked={isSelected}
        data-state={state}
        data-input="svg"
      />
    </div>
  );
};
