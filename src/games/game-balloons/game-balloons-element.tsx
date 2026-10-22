import { useMemo, useRef } from 'react';
import gsap from 'gsap';

import { useGSAP } from '@gsap/react';

import { BALLONS } from './lib/constant';
import { colorsOf } from './lib/palette';

import css from './game-balloons.module.css';

/** Partes del globo que el nivel necesita medir para animar el vuelo de la palabra. */
export interface BalloonParts {
  button: HTMLButtonElement;
  art: HTMLImageElement;
  plate: HTMLSpanElement;
}

export interface GameBalloonsElementProps {
  balloonRole: number;
  letter: string;
  enable: boolean;
  canAnimate: boolean;
  /** Segundos que tarda en reaparecer el globo: escalona la ola al reintentar. */
  respawnDelay?: number;
  onPick: (parts: BalloonParts) => void;
}

export const GameBalloonsElement: React.FC<GameBalloonsElementProps> = ({
  balloonRole = 0,
  letter = 'A',
  enable = true,
  canAnimate,
  respawnDelay = 0,
  onPick
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const bodyRef = useRef<HTMLSpanElement>(null);
  const artRef = useRef<HTMLImageElement>(null);
  const plateRef = useRef<HTMLSpanElement>(null);
  const wasEnabled = useRef(enable);

  const balloonList = useMemo(() => Object.values(BALLONS), []); // Array de globos
  const balloonSrc = balloonList[balloonRole % balloonList.length]; // Selección de globo según role
  const [glow] = colorsOf(balloonRole);

  /**
   * Entrada: los globos suben desde abajo con rebote, uno tras otro.
   * (useGSAP revierte al desmontar, así que también es seguro con StrictMode.)
   */
  useGSAP(
    () => {
      if (!canAnimate || !enable || !bodyRef.current) return;

      gsap.from(bodyRef.current, {
        y: 70,
        scale: 0.4,
        opacity: 0,
        rotation: gsap.utils.random(-12, 12),
        duration: 0.9,
        delay: 0.1 + balloonRole * 0.08,
        ease: 'back.out(1.8)'
      });
    },
    { scope: buttonRef }
  );

  /**
   * Explota (se hincha un instante y desaparece) cuando se elige y reaparece con elasticidad al devolverse.
   * Sin animaciones, el CSS oculta el globo deshabilitado y aquí solo se limpian los estilos en línea.
   */
  useGSAP(
    () => {
      const body = bodyRef.current;
      if (!body) return;

      if (!canAnimate) {
        gsap.set(body, { clearProps: 'transform,opacity' });
        wasEnabled.current = enable;
        return;
      }

      if (enable === wasEnabled.current) return;
      wasEnabled.current = enable;

      if (enable) {
        gsap.fromTo(
          body,
          { scale: 0, opacity: 0, y: 30 },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 0.9,
            delay: respawnDelay,
            ease: 'elastic.out(1, 0.5)',
            overwrite: 'auto',
            clearProps: 'transform,opacity'
          }
        );
        return;
      }

      gsap
        .timeline({ defaults: { overwrite: 'auto' } })
        .to(body, { scale: 1.22, duration: 0.08, ease: 'power2.out' })
        .to(body, { scale: 0, opacity: 0, duration: 0.14, ease: 'power2.in' });
    },
    { scope: buttonRef, dependencies: [enable, canAnimate] }
  );

  const handleClick = () => {
    if (!buttonRef.current || !artRef.current || !plateRef.current) return;

    onPick({ button: buttonRef.current, art: artRef.current, plate: plateRef.current });
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      className={css.balloon}
      disabled={!enable}
      aria-hidden={enable ? undefined : true}
      onClick={handleClick}
      style={
        {
          '--delay': `${-balloonRole * 0.6}s`,
          '--dur': `${3.4 + (balloonRole % 3) * 0.45}s`,
          '--bob': `${14 + (balloonRole % 4) * 3}px`,
          '--tilt': `${1.5 + (balloonRole % 2)}deg`,
          '--glow': glow
        } as React.CSSProperties
      }
    >
      <span className={css.lift}>
        <span ref={bodyRef} className={css.body}>
          <img ref={artRef} className={css.art} src={balloonSrc} alt="" />
          <span className={css.string} aria-hidden="true" />
          <span ref={plateRef} className={css.plate}>
            {letter}
          </span>
        </span>
      </span>
    </button>
  );
};
