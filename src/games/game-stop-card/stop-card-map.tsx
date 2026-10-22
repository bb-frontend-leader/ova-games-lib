import { memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';

import { burst, ring } from '@/games/lib/fx';
import { useCanAnimate, useLang } from '@/hooks';
import { useGSAP } from '@gsap/react';

import { background, FX_COLORS, i18n } from './lib/constant';
import { MAP_HEIGHT, MAP_WIDTH, ROAD_D, roadPointAt, stopT } from './lib/road';

import type { CheckEvent } from './types/types';

import css from './stop-card.module.css';

interface Props {
  /** Número de paradas del camino. */
  count: number;
  /** Paradas ya completadas (las anteriores a esta); la parada con este índice es la actual. */
  currentStop: number;
  finished: boolean;
  /** Avance (0-1) al que va el viajero. */
  travelerT: number;
  /** Comprobación hecha en la escena que dibuja este mapa (para los efectos); null en las demás. */
  event?: CheckEvent | null;
  /** Posición (0-based) de la parada de la escena, para colocar los destellos del acierto. */
  stopIndex?: number;
  /** El viajero sale desde el inicio hacia su parada la primera vez que el mapa se ve. */
  arrive?: boolean;
  /** Mapa fijo: el viajero espera en `travelerT` sin moverse ni mostrar paradas (pantalla de inicio). */
  decorative?: boolean;
}

const Traveler = () => (
  <g transform="translate(0 -5)">
    <ellipse cx="0" cy="13" rx="26" ry="4" fill="rgb(0 0 0 / 0.25)" />
    {/* Tabla de surf sobre el techo */}
    <ellipse cx="-3" cy="-27" rx="19" ry="3.4" fill="#12b5b0" stroke="#ffffff" strokeWidth="1" />
    <path d="M-17 -27h28" stroke="#ffffff" strokeWidth="1.4" />
    {/* Carrocería */}
    <path
      d="M-27 6v-18a4 4 0 0 1 4-4h5l4-9h24l8 9h9a4 4 0 0 1 4 4v18z"
      fill="#ec651a"
      stroke="#8c3a0e"
      strokeWidth="1.5"
    />
    <path d="M-14 -16l3-6h8v6zM1 -22h8l6 6H1z" fill="#cdeeff" stroke="#8c3a0e" strokeWidth="1" />
    <rect x="-27" y="-5" width="54" height="3.4" fill="#ffffff" opacity="0.85" />
    <circle cx="25" cy="-7" r="2.6" fill="#ffe36b" stroke="#8c3a0e" strokeWidth="0.8" />
    {/* Ruedas */}
    {[-15, 15].map((x) => (
      <g key={x}>
        <circle cx={x} cy="8" r="6.6" fill="#2b2b33" stroke="#ffffff" strokeWidth="1.2" />
        <circle cx={x} cy="8" r="2.6" fill="#d9dde3" />
      </g>
    ))}
  </g>
);

const Pin = ({ x, y, n, state }: { x: number; y: number; n: number; state: 'done' | 'here' | 'next' }) => (
  <g transform={`translate(${x} ${y})`} className={css.pin} data-state={state}>
    <g className={css['pin-inner']}>
      <ellipse cx="0" cy="0" rx="10" ry="3" fill="rgb(0 0 0 / 0.28)" />
      <path
        d="M0 0C-6 -11 -20 -24 -20 -40a20 20 0 0 1 40 0C20 -24 6 -11 0 0Z"
        className={css['pin-body']}
        strokeWidth="2.5"
      />
      <circle cx="0" cy="-40" r="12.5" fill="#ffffff" />
      {state === 'done' ? (
        <path
          d="M-6 -40l4.5 4.5L7 -45"
          fill="none"
          stroke="#2a7d3d"
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <text y="-34.5" textAnchor="middle" className={css['pin-number']}>
          {n}
        </text>
      )}
    </g>
  </g>
);

const FinishFlag = ({ x, y, reached }: { x: number; y: number; reached: boolean }) => (
  <g transform={`translate(${x} ${y})`} className={css.finish} data-reached={reached}>
    <ellipse cx="0" cy="0" rx="9" ry="3" fill="rgb(0 0 0 / 0.28)" />
    <path d="M0 0V-54" stroke="#4a3b2a" strokeWidth="3.2" strokeLinecap="round" />
    <g className={css['finish-flag']}>
      <rect x="1.5" y="-54" width="38" height="26" rx="2" fill="#ffffff" stroke="#1f1f2b" strokeWidth="1.6" />
      {[0, 1, 2, 3, 4].flatMap((col) =>
        [0, 1, 2].map((row) =>
          (col + row) % 2 === 0 ? (
            <rect
              key={`${col}-${row}`}
              x={3 + col * 7.1}
              y={-52.4 + row * 7.8}
              width="7.1"
              height="7.8"
              fill="#1f1f2b"
            />
          ) : null
        )
      )}
    </g>
  </g>
);

/**
 * El mapa del camino: la carretera con sus paradas (cuya numeración sale de `count`), la meta y el viajero. El
 * viajero va por la carretera hasta `travelerT`: avanza al acertar y retrocede al fallar. El tramo recorrido se
 * ilumina, las paradas completadas se marcan y los aciertos/fallos sueltan destellos.
 */
const RoadMap = ({ count, currentStop, finished, travelerT, event, stopIndex = 0, arrive, decorative }: Props) => {
  const lang = useLang();
  const t = i18n[lang];
  const canAnimate = useCanAnimate();

  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const fxRef = useRef<HTMLDivElement>(null);
  const travelerRef = useRef<SVGGElement>(null);
  const flipRef = useRef<SVGGElement>(null);
  const shakeRef = useRef<SVGGElement>(null);
  const trailRef = useRef<SVGPathElement>(null);

  // Si el mapa nace en pantalla (o sin movimiento) el viajero ya está en su sitio; si no, sale desde el inicio
  const [seen, setSeen] = useState(!arrive || decorative);
  const pos = useRef({ t: arrive && canAnimate && !decorative ? 0 : travelerT });
  const reached = useRef(pos.current.t);
  const facing = useRef<1 | -1>(1);
  const [bubble, setBubble] = useState<'ok' | 'ko' | null>(null);

  // Todo cuelga de la carretera: las paradas y la meta se miden una vez
  const pins = useMemo(
    () => Array.from({ length: decorative ? 0 : count }, (_, i) => ({ i, ...roadPointAt(stopT(i, count)) })),
    [count, decorative]
  );
  const goal = useMemo(() => roadPointAt(1), []);

  /** Coloca al viajero y la parte iluminada del camino según el avance `value`. */
  const paint = (value: number) => {
    const traveler = travelerRef.current;
    const flip = flipRef.current;
    const trail = trailRef.current;

    if (!traveler || !flip) return;

    const { x, y, dx } = roadPointAt(value);

    if (Math.abs(dx) > 1) facing.current = dx > 0 ? 1 : -1;
    reached.current = Math.max(reached.current, value);

    traveler.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
    flip.setAttribute('transform', `scale(${facing.current} 1)`);
    trail?.setAttribute('stroke-dashoffset', String(1 - reached.current));
  };

  useLayoutEffect(() => {
    paint(pos.current.t);
  }, []);

  // La primera vez que se ve la escena, el viajero sale hacia su parada
  useEffect(() => {
    const wrap = wrapRef.current;
    if (seen || !wrap || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) setSeen(true);
    });

    observer.observe(wrap);

    return () => observer.disconnect();
  }, [seen]);

  // El viaje: avanza con calma al acertar y se desliza hacia atrás al fallar. Sin movimiento, salta.
  useGSAP(
    () => {
      if (!seen) return;

      const point = pos.current;
      const shake = shakeRef.current;

      gsap.killTweensOf(point);

      const distance = Math.abs(travelerT - point.t);

      if (!canAnimate || decorative || distance < 0.0005) {
        point.t = travelerT;
        paint(point.t);
        return;
      }

      const forward = travelerT > point.t;
      const bob = shake ? gsap.to(shake, { y: -1.6, duration: 0.1, repeat: -1, yoyo: true, ease: 'sine.inOut' }) : null;

      gsap.to(point, {
        t: travelerT,
        duration: forward ? gsap.utils.clamp(1.1, 3.4, 5 * distance + 0.9) : 0.9,
        delay: forward ? 0.4 : 0.05,
        ease: forward ? 'power2.inOut' : 'power3.out',
        onUpdate: () => paint(point.t),
        onComplete: () => {
          bob?.kill();
          if (shake) gsap.set(shake, { y: 0 });
          paint(point.t);
        }
      });

      return () => {
        bob?.kill();
      };
    },
    { scope: wrapRef, dependencies: [travelerT, canAnimate, seen] }
  );

  // Destellos de una comprobación hecha en esta escena
  useEffect(() => {
    if (!event) return;

    setBubble(event.correct ? 'ok' : 'ko');

    const timer = setTimeout(() => setBubble(null), 1900);

    return () => clearTimeout(timer);
  }, [event]);

  useGSAP(
    () => {
      const fx = fxRef.current;
      const svg = svgRef.current;
      const shake = shakeRef.current;

      if (!event || !canAnimate || !fx || !svg) return;

      const scale = svg.getBoundingClientRect().width / MAP_WIDTH;
      const at = (x: number, y: number) => ({ x: x * scale, y: y * scale });
      const confetti = (point: { x: number; y: number }, count: number) =>
        burst(fx, point, {
          className: css.spark,
          colors: FX_COLORS.confetti,
          shapes: ['polygon(0 0, 100% 0, 100% 100%, 0 100%)', 'circle(50%)'],
          count,
          reach: [30, 90],
          size: [6, 11],
          gravity: 36
        });

      if (event.correct) {
        const pin = roadPointAt(stopT(stopIndex, count));

        ring(fx, at(pin.x, pin.y - 40), css.ring, '#ffd23f');
        confetti(at(pin.x, pin.y - 40), 14);

        if (event.finished) {
          // La meta se celebra cuando el viajero llega a ella
          gsap.delayedCall(2.3, () => {
            ring(fx, at(goal.x + 18, goal.y - 40), css.ring, '#ffffff');
            confetti(at(goal.x + 18, goal.y - 40), 28);
          });
        }
      } else {
        const van = roadPointAt(pos.current.t);

        burst(fx, at(van.x, van.y), {
          className: css.spark,
          colors: FX_COLORS.dust,
          count: 10,
          reach: [18, 46],
          size: [8, 15],
          gravity: -10
        });

        if (shake) gsap.fromTo(shake, { x: -4 }, { x: 0, duration: 0.55, ease: 'elastic.out(1, 0.25)' });
      }

      return () => fx.replaceChildren();
    },
    { scope: wrapRef, dependencies: [event, canAnimate] }
  );

  return (
    <div ref={wrapRef} className={css.map}>
      <svg
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        preserveAspectRatio={decorative ? 'xMinYMid slice' : undefined}
        role="img"
        aria-label={decorative ? undefined : t.map(Math.min(currentStop + 1, count), count, finished)}
        aria-hidden={decorative ? 'true' : undefined}
      >
        <image
          href={background}
          x="0"
          y="0"
          width={MAP_WIDTH}
          height={MAP_HEIGHT}
          preserveAspectRatio="xMidYMid meet"
        />

        {/* Tramo recorrido: se ilumina de la salida hasta donde llegó el viajero */}
        <path
          ref={trailRef}
          d={ROAD_D}
          pathLength="1"
          className={css.trail}
          strokeDasharray="1 1"
          strokeDashoffset="1"
        />

        {!decorative && <FinishFlag x={goal.x} y={goal.y} reached={finished} />}

        {pins.map((pin) => (
          <Pin
            key={pin.i}
            x={pin.x}
            y={pin.y}
            n={pin.i + 1}
            state={pin.i < currentStop ? 'done' : pin.i === currentStop ? 'here' : 'next'}
          />
        ))}

        <g ref={travelerRef} data-traveler>
          <g ref={flipRef}>
            <g ref={shakeRef}>
              <Traveler />
            </g>
          </g>

          {bubble && (
            <g className={css.bubble} data-kind={bubble} aria-hidden="true">
              <path d="M-26 -62h52a8 8 0 0 1 8 8v12a8 8 0 0 1-8 8H6l-6 9-6-9h-20a8 8 0 0 1-8-8v-12a8 8 0 0 1 8-8z" />
              <text y="-44" textAnchor="middle">
                {t.traveler[bubble]}
              </text>
            </g>
          )}
        </g>
      </svg>

      {/* Capa de efectos: confeti y polvo */}
      <div ref={fxRef} className={css.fx} aria-hidden="true" />
    </div>
  );
};

export const StopCardMap = memo(RoadMap);
