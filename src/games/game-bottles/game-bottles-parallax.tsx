import { useRef } from 'react';
import gsap from 'gsap';

import { FullScreenButton } from '@/components/ui';
import { useGSAP } from '@gsap/react';

import { useGameBottleContext } from './game-bottles-context';
import Crab from './game-bottles-crab';
import { IMAGENES_FONDO } from './lib/constant';
import { BUBBLES, DEPTH } from './lib/scene';

import css from './styles/level.module.css';

interface Props {
  children: React.ReactNode;
}

type Layer = keyof typeof DEPTH;

/**
 * Escena del juego: fondo marino en capas con paralaje, rayos de luz, burbujas y el cangrejo.
 * Todo el fondo es decorativo (`aria-hidden`). Las capas se mueven solo con `transform`: no fuerzan layout.
 */
export const Parallax: React.FC<Props> = ({ children }) => {
  const { fxRef, rootId, canAnimate } = useGameBottleContext();

  const sceneRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<Record<Layer, HTMLDivElement | null>>({
    sea: null,
    algae: null,
    sand: null,
    crab: null,
    front: null
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
    <div ref={sceneRef} className={`u-mt-3 ${css.scene}`} onPointerMove={handlePointerMove}>
      <div className={css.backdrop} aria-hidden="true">
        <div ref={setLayer('sea')} className={css.layer}>
          <img src={IMAGENES_FONDO.fondo_mar} className={css.image} alt="" />
        </div>

        <div className={css.rays}>
          <span className={css.ray} />
          <span className={`${css.ray} ${css.ray_late}`} />
        </div>

        <div ref={setLayer('algae')} className={css.layer}>
          <img src={IMAGENES_FONDO.fondo_algas_detras_de_la_arena} className={css.image} alt="" />
        </div>

        <div ref={setLayer('sand')} className={css.layer}>
          <img src={IMAGENES_FONDO.fondo_arena} className={css.image} alt="" />
        </div>

        <div className={css.bubbles}>
          {BUBBLES.map((bubble, i) => (
            <span
              key={i}
              className={css.bubble}
              style={
                {
                  '--x': bubble.x,
                  '--size': `${bubble.size}rem`,
                  '--dur': `${bubble.dur}s`,
                  '--delay': `${bubble.delay}s`,
                  '--drift': `${bubble.drift}px`
                } as React.CSSProperties
              }
            />
          ))}
        </div>

        <div ref={setLayer('crab')} className={css.layer}>
          <Crab />
        </div>

        <div ref={setLayer('front')} className={css.layer}>
          <img src={IMAGENES_FONDO.fondo_primer_plano} className={css.image} alt="" />
        </div>
      </div>

      <FullScreenButton elementId={rootId} addClass={css.fullScreen__button} />

      <div className={css.content}>{children}</div>

      {/* Capa de efectos: burbujas del corchazo, letra en vuelo, ondas y celebración */}
      <div ref={fxRef} className={css.fx} aria-hidden="true" />
    </div>
  );
};
