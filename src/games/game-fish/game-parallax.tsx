import { memo, useMemo, useRef } from 'react';

import { useReduceMotion } from '@/hooks';

import { BG } from './lib/constant';

import css from './game-fish.module.css';

const BUBBLES = 12;

/** El fondo marino con parallax de ratón y burbujas que suben (estas solo con movimiento permitido, por CSS). */
export const GameParallax = memo(() => {
  const cancelAnimation = useReduceMotion();

  const refDeph1 = useRef<HTMLImageElement>(null);
  const refDeph2 = useRef<HTMLImageElement>(null);
  const refDeph3 = useRef<HTMLImageElement>(null);
  const refDeph4 = useRef<HTMLImageElement>(null);

  // Posición, tamaño y retardo de cada burbuja: se calculan una vez (antes cambiaban en cada render del juego)
  const bubbles = useMemo(
    () =>
      Array.from({ length: BUBBLES }, () => ({
        left: Math.random() * 100,
        delay: Math.random() * -15, // Negativo: aparecen al instante a distintas alturas
        size: 15 + Math.random() * 25
      })),
    []
  );

  const handleDepthMove: React.MouseEventHandler = (e) => {
    if (!cancelAnimation) {
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
    <div className={css.wrapper_depths} onMouseMove={handleDepthMove} aria-hidden="true">
      <img src={BG.mar} className={css.image_back} alt="" />
      <img src={BG.mar} className={css.image_depth} ref={refDeph4} alt="" />
      <img src={BG.algas} className={css.image_depth} ref={refDeph3} alt="" />
      <img src={BG.arena} className={css.image_depth} ref={refDeph2} alt="" />
      <img src={BG.suelo} className={css.image_depth} ref={refDeph1} alt="" />

      {bubbles.map((bubble, index) => (
        <img
          key={`bubble-${index}`}
          src={BG.burbuja}
          className={css.bubble}
          style={{ left: `${bubble.left}%`, width: `${bubble.size}px`, animationDelay: `${bubble.delay}s` }}
          alt=""
        />
      ))}
    </div>
  );
});

GameParallax.displayName = 'GameParallax';
