import { useRef } from 'react';
import { useA11yAttribute, useReduceMotion } from '@core/hooks';

import { BG } from './const';

import css from './game-fish.module.css';

export const GameParallax = () => {
  const cancelAnimation = useReduceMotion();
  const { stopAnimations } = useA11yAttribute();

  const refDeph1 = useRef<HTMLImageElement>(null);
  const refDeph2 = useRef<HTMLImageElement>(null);
  const refDeph3 = useRef<HTMLImageElement>(null);
  const refDeph4 = useRef<HTMLImageElement>(null);

  const handleDepthMove: React.MouseEventHandler = (e) => {
    if (!cancelAnimation && !stopAnimations) {
      const offsetX = window.innerWidth / 2 - e.nativeEvent.clientX;
      const offsetY = window.innerHeight / 2 - e.nativeEvent.clientY;

      if (refDeph1.current) {
        refDeph1.current.style.left = offsetX / 25 + 'px';
        refDeph1.current.style.top = offsetY / 25 + 'px';
      }
      if (refDeph2.current) {
        refDeph2.current.style.left = offsetX / 100 + 'px';
        refDeph2.current.style.top = offsetY / 100 + 'px';
      }
      if (refDeph3.current) {
        refDeph3.current.style.left = offsetX / 150 + 'px';
        refDeph3.current.style.top = offsetY / 150 + 'px';
      }
      if (refDeph4.current) {
        refDeph4.current.style.left = offsetX / 100 + 'px';
        refDeph4.current.style.top = offsetY / 100 + 'px';
      }
    }
  };

  return (
    <div className={css.wrapper_depths} onMouseMove={handleDepthMove}>
      <img src={BG.mar} className={css.image_back} alt="" />
      <img src={BG.mar} className={css.image_depth} ref={refDeph4} alt="" />
      <img src={BG.algas} className={css.image_depth} ref={refDeph3} alt="" />
      <img src={BG.arena} className={css.image_depth} ref={refDeph2} alt="" />
      <img src={BG.suelo} className={css.image_depth} ref={refDeph1} alt="" />

      {/* 12 Burbujas con Delay Negativo para que aparezcan al instante */}
      {[...Array(12)].map((_, index) => {
        const randomLeft = Math.random() * 100;
        const randomDelay = Math.random() * -15; // Esto las activa de inmediato en distintas alturas
        const randomSize = 15 + Math.random() * 25;

        return (
          <img
            key={`bubble-${index}`}
            src={BG.burbuja}
            className={css.bubble}
            style={{
              left: `${randomLeft}%`,
              width: `${randomSize}px`,
              animationDelay: `${randomDelay}s`
            }}
            alt=""
          />
        );
      })}
    </div>
  );
};
