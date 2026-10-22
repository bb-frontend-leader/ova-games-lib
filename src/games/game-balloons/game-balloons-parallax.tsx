import { useRef } from 'react';
import gsap from 'gsap';

import { useCanAnimate } from '@/hooks';
import { useGSAP } from '@gsap/react';

import { BUSH, CLOUDS, MOUNTAINS, SKY } from './lib/constant';

import css from './game-balloons.module.css';

interface Props {
  children: JSX.Element[] | JSX.Element;
}

// Cuánto se desplaza (px) cada capa cuando el puntero llega al borde de la escena; más cerca = se mueve más.
const DEPTH = { sky: 6, far: 10, clouds: 14, near: 18, bush: 26 } as const;

type Layer = keyof typeof DEPTH;

const safeSrc = (rawSrc: string): string => rawSrc.replace(/\s/g, ''); // Elimina espacios en blanco accidentales

/**
 * Escena del juego: cielo con montañas, nubes y arbustos en capas con paralaje.
 * Todo es decorativo (`aria-hidden`). Las capas se mueven solo con `transform`: no fuerzan layout.
 */
export const GameBalloonsParallax: React.FC<Props> = ({ children }) => {
  const canAnimate = useCanAnimate();

  const sceneRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<Record<Layer, HTMLDivElement | null>>({
    sky: null,
    far: null,
    clouds: null,
    near: null,
    bush: null
  });
  const moveRef = useRef<((nx: number, ny: number) => void) | null>(null);

  /**
   * Prepara un `quickTo` (x, y) por capa.
   */
  useGSAP(
    () => {
      moveRef.current = null;
      if (!canAnimate) return;

      const movers = (Object.keys(DEPTH) as Layer[]).flatMap((name) => {
        const el = layerRefs.current[name];
        if (!el) return [];

        return [
          {
            depth: DEPTH[name],
            x: gsap.quickTo(el, 'x', { duration: 0.9, ease: 'power3' }),
            y: gsap.quickTo(el, 'y', { duration: 0.9, ease: 'power3' })
          }
        ];
      });

      moveRef.current = (nx, ny) => {
        movers.forEach(({ depth, x, y }) => {
          x(-nx * depth);
          y(-ny * depth * 0.5);
        });
      };
    },
    { scope: sceneRef, dependencies: [canAnimate] }
  );

  /**
   * Convierte la posición del puntero en un valor de -1 a 1 dentro de la escena y mueve las capas.
   * Solo con ratón: con dedo o lápiz no hay "hover" que seguir.
   */
  const handlePointerMove: React.PointerEventHandler<HTMLDivElement> = (event) => {
    if (event.pointerType !== 'mouse' || !moveRef.current || !sceneRef.current) return;

    const rect = sceneRef.current.getBoundingClientRect();
    moveRef.current(
      gsap.utils.clamp(-1, 1, ((event.clientX - rect.left) / rect.width - 0.5) * 2),
      gsap.utils.clamp(-1, 1, ((event.clientY - rect.top) / rect.height - 0.5) * 2)
    );
  };

  const setLayer = (name: Layer) => (el: HTMLDivElement | null) => {
    layerRefs.current[name] = el;
  };

  return (
    <div ref={sceneRef} className={css.scene} onPointerMove={handlePointerMove}>
      <div className={css.backdrop} aria-hidden="true">
        <div ref={setLayer('sky')} className={css.layer}>
          <img src={safeSrc(SKY)} className={`${css.image} ${css.image_sky}`} alt="" />
          <div className={css.sparkles} />
        </div>

        <div className={css.comet} />

        <div ref={setLayer('far')} className={css.layer}>
          <img src={safeSrc(MOUNTAINS.mountain2)} className={css.image} alt="" />
        </div>

        <div ref={setLayer('clouds')} className={css.layer}>
          <img src={safeSrc(CLOUDS)} className={css.cloud} alt="" />
          <img src={safeSrc(CLOUDS)} className={`${css.cloud} ${css.cloud_late}`} alt="" />
        </div>

        <div ref={setLayer('near')} className={css.layer}>
          <img src={safeSrc(MOUNTAINS.mountain1)} className={css.image} alt="" />
        </div>

        <div ref={setLayer('bush')} className={css.layer}>
          <img src={safeSrc(BUSH)} className={css.image} alt="" />
        </div>
      </div>

      {children}
    </div>
  );
};
