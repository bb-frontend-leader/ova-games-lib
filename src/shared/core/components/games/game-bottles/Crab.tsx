import { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { useA11yAttribute, useReduceMotion } from '@core/hooks';
import { useGSAP } from '@gsap/react';

import { IMAGENES_CANGREJO } from './assets/images';

import css from './styles/crab.module.css';

export default function Crab() {
  const tl = useMemo(() => gsap.timeline(), []);
  const cancelAnimation = useReduceMotion();
  const { stopAnimations } = useA11yAttribute();

  const refContainer = useRef<HTMLDivElement>(null);
  const refPatDer = useRef<HTMLImageElement>(null);
  const refPatIzq = useRef<HTMLImageElement>(null);

  useGSAP(() => {
    tl.to(refPatIzq.current, { rotate: 30, duration: 0.5, repeat: -1, yoyo: true }, 0);
    tl.to(refPatDer.current, { rotate: -15, duration: 0.5, repeat: -1, yoyo: true }, 0);
    tl.to(refContainer.current, { x: 300, duration: 8, repeat: -1, yoyo: true, ease: 'power1.inOut' }, 0);
  }, []);

  useEffect(() => {
    tl.restart();
    if (cancelAnimation || stopAnimations) {
      tl.pause();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cancelAnimation, stopAnimations]);

  return (
    <div className={css.container} ref={refContainer}>
      <img
        src={IMAGENES_CANGREJO.cangrejo_1_pat_izq}
        className={css.pat_izq}
        ref={refPatIzq}
        alt="cangrejo izquierda"
      />
      <img src={IMAGENES_CANGREJO.Cangrejo1_torso} className={css.torso} alt="torso del cangrejo" />
      <img src={IMAGENES_CANGREJO.cangrejo_1_pat_der} className={css.pat_der} ref={refPatDer} alt="cangrejo derecha" />
      <img src={IMAGENES_CANGREJO.cangrejo_1_tenaza} className={css.tenaza_izq} alt="tenaza derecha" />
      <img src={IMAGENES_CANGREJO.cangrejo_1_tenaza} className={css.tenaza_der} alt="tenaza izquierda" />
      <img src={IMAGENES_CANGREJO.Cangrejos_sombras} className={css.shadow} alt="sombras del cangrego" />
    </div>
  );
}
