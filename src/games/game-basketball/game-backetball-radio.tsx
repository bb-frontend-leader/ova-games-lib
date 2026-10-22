import { useEffect, useId, useMemo } from 'react';

import { SOUNDS } from '@/constants';
import { usePlaySound } from '@/hooks';

import { useRadioBasketActivityContext } from './game-basketball-context';
import { RED } from './lib/constant';

import type { RadioStates } from './types/types';

import css from './game-basketball.module.css';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  addClass?: string;
  label: string;
  state: RadioStates;
}

export const GameBasketballRadio: React.FC<Props> = ({ id, addClass, state, label, name, ...props }) => {
  const reactId = useId();
  const { validation, revealed, addRadioElementsId, addRadiosValues, options } = useRadioBasketActivityContext();
  const playSound = usePlaySound();

  const uid = id || reactId;
  const radioName = `radio-group-basket-${name}`;

  const safeSrc = (rawSrc: string): string => rawSrc.replace(/\s/g, ''); // Elimina espacios en blanco accidentales
  const letter = label.split('.')[0].toUpperCase();
  const option = label.split('.')[1].trim();

  // ✅ seleccionado sale del CONTEXTO
  const isSelected = useMemo(() => {
    return options?.some((opt) => opt.name === radioName && opt.id === uid);
  }, [options, radioName, uid]);

  /**
   * Maneja el evento onChange.
   */
  const handleChange = () => {
    playSound(SOUNDS.TICK);
    addRadiosValues({ id: uid, name: radioName, state, letter });
  };

  useEffect(() => {
    addRadioElementsId(uid); // Agrega este grupo de radios al contexto
  }, [uid, addRadioElementsId]);

  const getLabelClass = (state: 'success' | 'wrong') => {
    if (!validation || !revealed || !isSelected) return css.button;
    return `${css.button} ${state === 'success' ? css.success : css.wrong}`;
  };

  return (
    <div className={`${css.radio__option} ${validation ? css.disabled : ''} ${addClass ?? ''}`}>
      {/* El aro es decorativo: la opción la anuncia su radio. `data-hoop` es el blanco del tiro. */}
      <div className={css.radio_red} data-hoop={uid} data-aimed={isSelected || undefined}>
        <img src={safeSrc(RED)} alt="" className={css.net} />
        <span aria-hidden="true">{letter}</span>
      </div>
      <div className={css.radio_button}>
        <input
          id={uid}
          type="radio"
          name={radioName}
          value={uid}
          disabled={validation}
          className={css.radioButton}
          checked={isSelected}
          onChange={handleChange}
          {...props}
        />
        <label htmlFor={uid} className={getLabelClass(state)}>
          <span className={css['sr-only']}>{letter}. </span>
          <span dangerouslySetInnerHTML={{ __html: option }} />
        </label>
      </div>
    </div>
  );
};
