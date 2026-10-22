import { useEffect, useId, useMemo } from 'react';

import { useGameContext } from './race-card-context';

import type { RadioStates } from './types/types';

import css from './svg-card.module.css';

interface PropsInputRadio extends React.InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  addClass?: string;
  label: string;
  state: RadioStates;
}

export const RaceCardInput: React.FC<PropsInputRadio> = ({ id, label, state, name, addClass, ...props }) => {
  const reactId = useId();

  const { addRadiosValues, addElementId, radios } = useGameContext();

  const radioID = id || reactId;
  const radioName = `game-race-group-${name}`;

  // ✅ seleccionado sale del CONTEXTO
  const isSelected = useMemo(() => {
    return radios?.some((opt) => opt.name === radioName && opt.id === radioID);
  }, [radios, radioName, radioID]);

  /**
   * Maneja el evento onChange.
   * Añade un valor de radio seleccionado al estado de la actividad.
   * @param {React.ChangeEvent<HTMLInputElement>} e - El evento onChange.
   */
  const handleChange = () => {
    addRadiosValues({ id: radioID, name: radioName, state });
  };

  /**
   * Agrega el ID del componente RadioElement al estado de la actividad.
   */
  useEffect(() => {
    addElementId(radioID);
  }, [radioID, addElementId]);

  return (
    <div className={`${css.radio__svg} ${addClass ?? ''}`} {...props}>
      <input
        id={radioID}
        type="radio"
        name={radioName}
        value={state}
        onChange={handleChange}
        checked={isSelected}
        data-input="svg"
        data-state={state}
      />
      <label htmlFor={radioID}>
        <span dangerouslySetInnerHTML={{ __html: label }} />
      </label>
    </div>
  );
};
