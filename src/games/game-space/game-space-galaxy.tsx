import { useId, useRef } from 'react';
import gsap from 'gsap';

import { FullScreenAlert, ValidationStatus } from '@/components/ui';
import { SOUNDS } from '@/constants';
import { burst, centerIn, ring } from '@/games/lib/fx';
import { useCanAnimate, useLang, usePlaySound } from '@/hooks';
import { useGSAP } from '@gsap/react';

import { useGameSpaceContext } from './game-space-context';
import { ASTEROID, ASTRONAUT, i18n, ICON, UNIVERSE01, UNIVERSE02 } from './lib/constant';

import css from './game-space.module.css';

interface GalaxyProps {
  addClass?: string;
  question: string | JSX.Element;
  universeType?: '1' | '2';
  children: JSX.Element | JSX.Element[];
}

const STARS = ['#ffd35a', '#ffffff', '#8fe3ff', '#ffe9a3'] as const;
const DUST = ['#6b5a85', '#9ba1c6', '#3a1d52', '#c9c2e0'] as const;
const SHARD_SHAPES = [
  'circle(50%)',
  'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)',
  'polygon(50% 0, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
];

export const GameSpaceGalaxy: React.FC<GalaxyProps> = ({
  question,
  addClass,
  universeType = '2',
  children,
  ...props
}) => {
  const universeData = universeType === '1' ? UNIVERSE01 : UNIVERSE02; // Obtener los datos del universo

  const { validation, result, options, rootRef, finished, attempts, handleRestart } = useGameSpaceContext();
  const lang = useLang();
  const t = i18n[lang];
  const canAnimate = useCanAnimate(); // Falso con "reducir movimiento" o "detener animaciones"
  const playSound = usePlaySound();
  const questionId = useId();
  const endId = useId();
  const againRef = useRef<HTMLButtonElement>(null);

  const safeSrc = (rawSrc: string): string => rawSrc.replace(/\s/g, '');
  const background = universeData.find((item) => item.cover)?.cover;

  const bg = safeSrc(background ?? '');

  const refAsteroid = useRef<HTMLImageElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const haloRef = useRef<HTMLSpanElement>(null);
  const fxRef = useRef<HTMLDivElement>(null);

  // Lo que el astronauta "piensa": a la espera, con una respuesta elegida, o con el resultado
  const mood = validation ? (result ? 'success' : 'wrong') : options.length ? 'picked' : 'idle';
  const speech = finished ? t.end.announce(attempts) : mood === 'idle' ? t.hello : t[mood];

  /**
   * Maneja el movimiento del asteroide basado en la posición del mouse.
   * @param {React.MouseEvent} e - El evento del mouse.
   */
  const handleAsteroidMove: React.MouseEventHandler = (e) => {
    if (!refAsteroid.current) return;

    if (canAnimate) {
      const offsetY = (window.innerHeight / 2 - e.nativeEvent.clientY) / 50;

      refAsteroid.current.style.bottom = `${Math.min(Math.max(-50, offsetY), 50)}px`;
    } else {
      refAsteroid.current.style.bottom = '0';
    }
  };

  /**
   * El astronauta reacciona al juego (solo con movimiento permitido): al elegir se inclina hacia las
   * respuestas; al acertar salta, gira en gravedad cero y suelta estrellas; al fallar se tambalea y suelta polvo.
   */
  useGSAP(
    () => {
      const body = bodyRef.current;
      const halo = haloRef.current;
      const fx = fxRef.current;
      const scene = sceneRef.current;

      if (!body || !halo || !fx || !scene) return;

      // Vuelve a su sitio (reintento o sin animaciones)
      gsap.set(body, { clearProps: 'transform' });
      if (!canAnimate || mood === 'idle') return;

      const at = () => centerIn(body.getBoundingClientRect(), fx.getBoundingClientRect());
      // Si el efecto se cancela a mitad (p. ej. el doble montaje de desarrollo) los fragmentos no se quedan en la capa
      const cleanup = () => fx.replaceChildren();

      gsap.fromTo(halo, { scale: 0.8, opacity: 0.4 }, { scale: 1, opacity: 1, duration: 0.7, ease: 'power2.out' });

      if (mood === 'picked') {
        gsap.fromTo(
          body,
          { rotation: -4, x: -8, y: 0 },
          { rotation: 0, x: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)', transformOrigin: '50% 90%' }
        );
        return;
      }

      if (mood === 'success') {
        gsap
          .timeline({ defaults: { transformOrigin: '50% 60%' } })
          .to(body, { scaleY: 0.92, duration: 0.14, ease: 'power2.in' })
          .call(() => {
            playSound(SOUNDS.WHOOSH);
            ring(fx, at(), css.ring, '#ffd35a');
            burst(fx, at(), {
              className: css.shard,
              colors: STARS,
              shapes: SHARD_SHAPES,
              count: 24,
              reach: [90, 210],
              size: [7, 15]
            });
          })
          .to(body, { scaleY: 1.04, y: -64, duration: 0.36, ease: 'power2.out' })
          .to(body, { rotation: 360, duration: 0.74, ease: 'power1.inOut' }, '<')
          .to(body, { y: 0, scaleY: 1, duration: 0.45, ease: 'bounce.out' }, '-=0.1')
          .set(body, { rotation: 0 });

        return cleanup;
      }

      // wrong
      playSound(SOUNDS.DROP);
      burst(fx, at(), {
        className: css.shard,
        colors: DUST,
        count: 9,
        reach: [40, 90],
        size: [6, 12],
        gravity: 20
      });
      gsap
        .timeline({ defaults: { transformOrigin: '50% 90%' } })
        .to(body, { x: -14, rotation: -8, duration: 0.08 })
        .to(body, { x: 12, rotation: 7, duration: 0.1 })
        .to(body, { x: -8, rotation: -4, duration: 0.1 })
        .to(body, { x: 0, rotation: 0, duration: 0.4, ease: 'elastic.out(1, 0.35)' });

      return cleanup;
    },
    { scope: sceneRef, dependencies: [mood, canAnimate, options] }
  );

  /**
   * Pantalla final: el foco pasa a «Jugar de nuevo» y, con movimiento permitido, la tarjeta suelta una onda,
   * estrellas y una lluvia de estrellas fugaces.
   */
  useGSAP(
    () => {
      const fx = fxRef.current;
      const card = againRef.current?.parentElement;

      if (!finished || !fx || !card) return;

      againRef.current?.focus({ preventScroll: true });
      if (!canAnimate) return;

      const layer = fx.getBoundingClientRect();
      const at = centerIn(card.getBoundingClientRect(), layer);

      ring(fx, at, css.ring, '#ffd35a');
      burst(fx, at, {
        className: css.shard,
        colors: STARS,
        shapes: SHARD_SHAPES,
        count: 20,
        reach: [90, 220],
        size: [7, 15]
      });

      // Estrellas que caen desde arriba por toda la escena
      for (let i = 0; i < 22; i++) {
        const star = document.createElement('span');
        const duration = gsap.utils.random(1, 1.6);
        const delay = i * 0.05;

        star.className = css.shard;
        star.style.width = star.style.height = `${gsap.utils.random(8, 15)}px`;
        star.style.clipPath = SHARD_SHAPES[2];
        star.style.setProperty('--fx-color', gsap.utils.random([...STARS]) as string);
        fx.appendChild(star);

        gsap.set(star, { x: gsap.utils.random(0, layer.width), y: -20, rotation: gsap.utils.random(0, 360) });
        gsap.to(star, {
          y: layer.height * gsap.utils.random(0.6, 1),
          rotation: `+=${gsap.utils.random(-200, 200)}`,
          duration,
          delay,
          ease: 'power1.in',
          onComplete: () => star.remove()
        });
        gsap.to(star, { opacity: 0, duration: 0.25, delay: delay + duration - 0.25 });
      }

      // Si el efecto se cancela a mitad (p. ej. el doble montaje de desarrollo) los fragmentos no se quedan en la capa
      return () => fx.replaceChildren();
    },
    { scope: sceneRef, dependencies: [finished, canAnimate] }
  );

  return (
    <div ref={rootRef} className={` u-flow ${addClass ?? ''}`} {...props}>
      <FullScreenAlert />
      <div
        ref={sceneRef}
        className={`${css['space-container']}`}
        style={{ '--bg-image': `url("${bg}")` } as React.CSSProperties}
        onMouseMove={handleAsteroidMove}
      >
        {universeData.map((item, index) => {
          const [key, value] = Object.entries(item)[0];
          if (key === 'cover') return null;
          return <img key={index} src={value} alt="" aria-hidden="true" className={`${css[key]}`} />;
        })}
        <img src={safeSrc(ASTEROID)} alt="" className={` ${css['image_depth']}`} ref={refAsteroid} aria-hidden="true" />

        {/* El astronauta es el guía: habla por el comunicador (globo) y reacciona a lo que pasa en el juego */}
        <div className={css.hero} data-mood={mood}>
          <p className={css.comm} role="status" data-mood={mood}>
            {speech}
          </p>
          <span ref={haloRef} className={css.halo} aria-hidden="true" />
          <div ref={bodyRef} className={css['astro-body']}>
            <img src={safeSrc(ASTRONAUT)} alt="" aria-hidden="true" className={` ${css['astronaut']}`} />
          </div>
        </div>

        <div className={`${css['wrapper-container']}`}>
          <div className={`${css['question']}`}>
            <img src={safeSrc(ICON)} className={css['icon']} alt="" aria-hidden="true" />
            <h2 id={questionId}>{question}</h2>
            <img src={safeSrc(ICON)} className={`${css['icon']} ${css['icon-reverse']}`} alt="" aria-hidden="true" />
          </div>
          <ValidationStatus validated={validation} correct={result} />
          <div className={css.options} role="radiogroup" aria-labelledby={questionId}>
            {children}
          </div>
        </div>

        {finished && (
          <div className={css.end} role="group" aria-labelledby={endId}>
            <div className={css['end-card']}>
              <h2 id={endId} className={css['end-title']}>
                {t.end.title}
              </h2>
              <p>{t.end.text}</p>
              <dl className={css['end-stats']}>
                <dt>{t.end.attemptsLabel}</dt>
                <dd>{t.end.attempts(attempts)}</dd>
              </dl>
              <button ref={againRef} type="button" className={css['space-button']} onClick={handleRestart}>
                {t.end.again}
              </button>
            </div>
          </div>
        )}

        {/* Capa de efectos: estrellas y polvo alrededor del astronauta */}
        <div ref={fxRef} className={css.fx} aria-hidden="true" />
      </div>
    </div>
  );
};
