import { useRef } from 'react';
import { useA11yAttribute, useReduceMotion } from '@core/hooks';
import type {JSX}from 'react';

import { FullScreenAlert } from '../../ui';

import { ASTEROID, ASTRONAUT, ICON, UNIVERSE01, UNIVERSE02 } from './const';

import css from './game-space.module.css';

interface GalaxyProps {
  addClass?: string;
  question: string | JSX.Element;
  universeType?: '1' | '2';
  children: React.ReactNode | React.ReactNode[];
}

export const GameSpaceGalaxy: React.FC<GalaxyProps> = ({
  question,
  addClass,
  universeType = 2,
  children,
  ...props
}) => {
  const universeData = universeType === 1 ? UNIVERSE01 : UNIVERSE02; // Obtener los datos del universo

  const { stopAnimations } = useA11yAttribute(); // Obtener el estado de la propiedad de accesibilidad 'stopAnimations'
  const cancelAnimation = useReduceMotion(); // Obtener el estado de la propiedad de reducir la animación

  const safeSrc = (rawSrc: string): string => rawSrc.replace(/\s/g, '');
  const background = universeData.find((item) => item.cover)?.cover;

  const bg = safeSrc(background ?? '');

  const refAsteroid = useRef<HTMLImageElement>(null);

  /**
   * Maneja el movimiento del asteroide basado en la posición del mouse.
   * @param {React.MouseEvent} e - El evento del mouse.
   */
  const handleAsteroidMove: React.MouseEventHandler = (e) => {
    if (!cancelAnimation && !stopAnimations) {
      const offsetY = (window.innerHeight / 2 - e.nativeEvent.clientY) / 50;

      if (refAsteroid.current) refAsteroid.current.style.bottom = `${Math.min(Math.max(-50, offsetY), 50)}px`;
    } else {
      if (refAsteroid.current) refAsteroid.current.style.bottom = ' 0';
    }
  };

  return (
    <div className={` u-flow ${addClass ?? ''}`} {...props} role="group">
      <FullScreenAlert />
      <div
        className={`${css['space-container']}`}
        style={{ '--bg-image': `url("${bg}")` } as React.CSSProperties}
        onMouseMove={handleAsteroidMove}>
        {universeData.map((item, index) => {
          const [key, value] = Object.entries(item)[0];
          if (key === 'cover') return null;
          return <img key={index} src={value} alt={key} className={`${css[key]}`} />;
        })}
        <img
          src={safeSrc(ASTEROID)}
          alt="Asteroide"
          className={` ${css['image_depth']}`}
          ref={refAsteroid}
          aria-hidden="true"
        />
        <img src={safeSrc(ASTRONAUT)} alt="Astronauta" className={` ${css['astronaut']}`} />
        <div className={`${css['wrapper-container']}`}>
          <div className={`${css['question']}`} role="heading" aria-level={2}>
            <img src={safeSrc(ICON)} className={css['icon']} aria-hidden="true" />
            <h2>{question}</h2>
            <img src={safeSrc(ICON)} className={`${css['icon']} ${css['icon-reverse']}`} aria-hidden="true" />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};
