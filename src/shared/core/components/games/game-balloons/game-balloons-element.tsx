import {  useEffect, useId, useMemo, useRef } from 'react';
import type { InputHTMLAttributes } from "react";
import gsap from 'gsap';

import type { SpaceResult } from "./types/types";
import { BALLONS } from './const';

import css from './game-balloons.module.css';

export interface GameBalloonsElementProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  balloonRole: number; // <- antes "role"
  letter: string;
  index: string;
  enable: boolean;
  onResult?: (result: SpaceResult) => void;

  // opcional: controlar selección desde fuera
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const GameBalloonsElement: React.FC<GameBalloonsElementProps> = ({
  balloonRole = 0,
  letter = 'A',
  index = 'hasdh767803h',
  enable = true,
  onResult,
  checked,
  onCheckedChange,
  ...props
}) => {
  const id = useId();
  const refWord = useRef<HTMLDivElement>(null);

  const balloonList = useMemo(() => Object.values(BALLONS), []); // Array de globos
  const balloonSrc = balloonList[balloonRole % balloonList.length]; // Selección de globo según role

  /**
   * Efecto que se encarga de animar
   * la entrada y salida de los globos.
   */
  useEffect(() => {
    if (!refWord.current) return;

    const animationProps = enable
      ? { y: 0, opacity: 1, duration: 1 }
      : { ease: 'power3.in', y: 90, opacity: 0, duration: 0.7 };

    gsap.to(refWord.current, {
      ...animationProps,
      onComplete: () => onResult?.({ index, letter })
    });
  }, [enable, index, letter, onResult]);

  return (
    <div className={css.container} style={{ animationDelay: `${balloonRole * 0.5}s` }}>
      {/* Checkbox real (accesible) */}
      <input
        {...props}
        id={id}
        type="checkbox"
        className={css.checkbox}
        disabled={!enable}
        checked={checked}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
        aria-label={letter}
      />

      {/* Label hace de “botón” visual */}
      <label htmlFor={id} className={css.container__responsive}>
        <img src={balloonSrc} alt="" />
        <div ref={refWord} className={css.letter}>
          <p>{letter}</p>
        </div>
      </label>
    </div>
  );
};
