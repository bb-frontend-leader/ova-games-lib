import type { FC } from 'react';
import { useEffect, useId, useMemo } from 'react';

import { SOUNDS } from '@/constants';
import { usePlaySound } from '@/hooks';

import { useGameLegoContext } from './game-lego-context';
import { BRICK_COLORS } from './lib/constant';
import { parseLabel } from './lib/parse-label';

import type { RadioStates } from './types/types';

import css from './game-lego.module.css';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  addClass?: string;
  label: string;
  state: RadioStates;
  /** Lo pone `GameLego.Question` (posición de la pieza): decide su color. */
  brick?: number;
}

/** Una pieza con una respuesta: un ladrillo con sus tetones. Al comprobar, la elegida muestra si encaja. */
export const LegoRadio: FC<Props> = ({ id, addClass, state, label, name, brick = 0, ...props }) => {
  const reactId = useId();

  const { addOptionValues, addOptionElementsId, validation, options } = useGameLegoContext();
  const playSound = usePlaySound();

  const uid = id || reactId;
  const radioName = `radio-group-lego-${name}`;
  const color = brick % BRICK_COLORS;

  const { letter, text } = useMemo(() => parseLabel(label), [label]);

  const isSelected = useMemo(() => {
    return options?.some((opt) => opt.name === radioName && opt.id === uid);
  }, [options, radioName, uid]);

  const pieceState = validation
    ? isSelected
      ? state === 'success'
        ? 'correct'
        : 'wrong'
      : 'off'
    : isSelected
      ? 'picked'
      : 'idle';

  const handleChange = () => {
    playSound(SOUNDS.TICK);
    addOptionValues({ id: uid, name: radioName, state, label, color });
  };

  useEffect(() => {
    addOptionElementsId(uid);
  }, [uid, addOptionElementsId]);

  return (
    <div className={`${css.option} ${addClass ?? ''}`} data-lego-option data-color={color} data-state={pieceState}>
      <span className={css.studs} aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </span>

      <input
        {...props}
        type="radio"
        id={uid}
        value={uid}
        name={radioName}
        disabled={validation}
        className={css.radioOption}
        checked={isSelected}
        onChange={handleChange}
      />
      <label htmlFor={uid} className={css.button}>
        {letter && (
          <span className={css['circle']} data-id="letter">
            {letter}
          </span>
        )}
        <span dangerouslySetInnerHTML={{ __html: text }} />
      </label>
    </div>
  );
};
