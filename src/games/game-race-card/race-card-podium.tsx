import { useEffect, useId, useRef } from 'react';

import { SOUNDS } from '@/constants';
import { useLang, usePlaySound } from '@/hooks';

import { i18n } from './lib/constant';
import { useSvgUid } from './lib/use-svg-uid';
import { useGameContext } from './race-card-context';
import { MachineCar, PlayerCar, Sky, Tint } from './svg-parts';
import { DRIVER_CHEER_UP, DRIVER_SAD } from './svg-parts/base64-images';

import type { DriversType } from './types/types';

import p from './styles/race-podium.module.css';
import raceSvg from './styles/race-svg.module.css';

interface Props {
  drivers?: DriversType;
}

// Escenario (unidades del dibujo): dos escalones pegados, el del primer lugar a la derecha y más alto
const STAGE = { width: 777.6, height: 380, floor: 343 };
const STEP = { width: 230, second: { x: 158.8, top: 262 }, first: { x: 388.8, top: 226 } };
const CAR_SCALE = 0.62;

// Centro horizontal y base de cada auto en su dibujo original, para posarlos sobre el escalón
const PLAYER_CAR = { cx: 173.5, bottom: 402 };
const MACHINE_CAR = { cx: 152.5, bottom: 286 };

// Intensidad de los reflectores según la franja del día
const SPOT_OPACITY = { dawn: 0.2, day: 0.12, sunset: 0.28, night: 0.5 };

// Confeti: izquierda (%), retraso (s), duración (s), color, tamaño (rem) y giro (grados). Tabla fija.
const CONFETTI: [number, number, number, string, number, number][] = [
  [4, 0, 3.2, '#fcc13a', 0.6, 220],
  [10, 0.3, 3.6, '#e42d2c', 0.5, -300],
  [16, 0.1, 3, '#2ee66b', 0.55, 180],
  [22, 0.5, 3.8, '#41a9ff', 0.6, -200],
  [28, 0.2, 3.3, '#ff7ab6', 0.5, 340],
  [34, 0.7, 3.5, '#fcc13a', 0.65, -240],
  [40, 0.05, 3.1, '#8a45d6', 0.5, 260],
  [46, 0.45, 3.7, '#2ee66b', 0.6, -320],
  [52, 0.25, 3.4, '#e42d2c', 0.55, 200],
  [58, 0.6, 3, '#41a9ff', 0.5, -180],
  [64, 0.15, 3.6, '#fcc13a', 0.65, 300],
  [70, 0.4, 3.2, '#ff7ab6', 0.55, -260],
  [76, 0.75, 3.8, '#2ee66b', 0.5, 240],
  [82, 0.3, 3.3, '#8a45d6', 0.6, -340],
  [88, 0.55, 3.5, '#e42d2c', 0.55, 190],
  [94, 0.1, 3.1, '#fcc13a', 0.5, -210]
];

/**
 * Pone un auto sobre un escalón: centrado en `x` y con las ruedas apoyadas en `top`.
 */
const carAt = (x: number, top: number, car: { cx: number; bottom: number }) =>
  `translate(${x + STEP.width / 2} ${top}) scale(${CAR_SCALE}) translate(${-car.cx} ${-car.bottom})`;

const Trophy = () => (
  <svg viewBox="0 0 48 48" width="40" height="40" aria-hidden="true" focusable="false" className={p['banner-icon']}>
    <path
      d="M14 6h20v12a10 10 0 0 1-20 0V6z"
      fill="#fcc13a"
      stroke="#8a6a2a"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    <path
      d="M14 10H7c0 8 3 12 8 13M34 10h7c0 8-3 12-8 13"
      fill="none"
      stroke="#8a6a2a"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path d="M24 28v7M16 42h16l-2-7H18z" fill="#fcc13a" stroke="#8a6a2a" strokeWidth="2.5" strokeLinejoin="round" />
  </svg>
);

const Flag = () => (
  <svg viewBox="0 0 48 48" width="40" height="40" aria-hidden="true" focusable="false" className={p['banner-icon']}>
    <path d="M10 6v38" stroke="#4a3b2a" strokeWidth="3.5" strokeLinecap="round" />
    <path d="M12 8h26v20H12z" fill="#ffffff" stroke="#1d1d1b" strokeWidth="2.5" />
    <path
      d="M12 8h6.5v6.7H12zM25 8h6.5v6.7H25zM18.5 14.7H25v6.7h-6.5zM31.5 14.7H38v6.7h-6.5zM12 21.4h6.5v6.6H12zM25 21.4h6.5v6.6H25z"
      fill="#1d1d1b"
    />
  </svg>
);

export const RaceCardPodium: React.FC<Props> = ({ drivers }) => {
  const lang = useLang();
  const text = i18n[lang];

  const { game, isWinner, questionCount, timeOfDay } = useGameContext();
  const playSound = usePlaySound();
  const uid = useSvgUid();
  const headingId = useId();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const announced = useRef(false);

  const playerName = game.playerName || drivers?.player || text['racing-driver-user'];
  const machineName = drivers?.machine || text['racing-driver-bot'];

  /**
   * «Ver resultados» desapareció al abrir el podio: el foco se lleva al título y se suena el resultado una sola vez
   * (en desarrollo React monta dos veces). Todas las secciones del panel están montadas y cada una dibuja el podio:
   * solo la que está a la vista lo anuncia.
   */
  useEffect(() => {
    const heading = headingRef.current;

    if (!heading || heading.getClientRects().length === 0) return;

    heading.focus();

    if (announced.current) return;

    announced.current = true;
    playSound(isWinner ? SOUNDS.SUCCESS : SOUNDS.ERROR);
  }, [isWinner, playSound]);

  const racers = [
    { id: 'player', name: playerName, points: game.pointplayer1, mine: true },
    { id: 'machine', name: machineName, points: game.pointplayer2, mine: false }
  ];
  const [first, second] = isWinner ? racers : [racers[1], racers[0]];
  const results = [
    { ...first, place: 1 as const },
    { ...second, place: 2 as const }
  ];

  const spotlights = [
    { x: STEP.second.x + STEP.width / 2, top: STEP.second.top },
    { x: STEP.first.x + STEP.width / 2, top: STEP.first.top }
  ];

  const standOn = (racerId: string, place: 1 | 2) => {
    const step = place === 1 ? STEP.first : STEP.second;
    const racerCar = racerId === 'player' ? PLAYER_CAR : MACHINE_CAR;

    return carAt(step.x, step.top, racerCar);
  };

  return (
    <section
      className={p.podium}
      aria-labelledby={headingId}
      data-result={isWinner ? 'win' : 'lose'}
      data-phase={timeOfDay}
    >
      <svg
        className={`${raceSvg['race-svg']} ${p.stage}`}
        viewBox={`0 0 ${STAGE.width} ${STAGE.height}`}
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id={`${uid}-spot`} x1={0} y1={0} x2={0} y2={1}>
            <stop offset={0} stopColor="#ffffff" stopOpacity={0.9} />
            <stop offset={1} stopColor="#ffffff" stopOpacity={0} />
          </linearGradient>
        </defs>

        <Sky phase={timeOfDay} uid={uid} />

        {/* Colinas y pista de fondo */}
        <path d="M0 262Q150 218 330 252T777.6 238V380H0z" fill="#6D961F" />
        <path d="M0 288Q220 252 420 282T777.6 270V380H0z" fill="#76AC2B" />
        <rect y={STAGE.floor} width={STAGE.width} height={STAGE.height - STAGE.floor} fill="#d6d5cd" />
        <rect y={STAGE.floor - 8} width={STAGE.width} height={8} fill="#e42d2c" />
        <path d={`M0 ${STAGE.floor - 4}h${STAGE.width}`} stroke="#fdfdfd" strokeWidth={8} strokeDasharray="26 26" />

        {/* Escalones */}
        {[
          { step: STEP.second, place: 2 },
          { step: STEP.first, place: 1 }
        ].map(({ step, place }) => (
          <g key={place}>
            <rect x={step.x} y={step.top} width={STEP.width} height={STAGE.floor - step.top} fill="#555792" />
            <rect x={step.x} y={step.top} width={STEP.width} height={10} fill="#8587c8" />
            <circle
              cx={step.x + STEP.width / 2}
              cy={step.top + 46}
              r={25}
              fill={place === 1 ? '#fcc13a' : '#d9dde6'}
              stroke={place === 1 ? '#8a6a2a' : '#5b6170'}
              strokeWidth={3}
            />
            <text
              x={step.x + STEP.width / 2}
              y={step.top + 56}
              textAnchor="middle"
              fontSize={30}
              fontWeight={800}
              fill={place === 1 ? '#4a3200' : '#2b2f3a'}
            >
              {place}
            </text>
          </g>
        ))}

        {/* Los autos sobre su escalón: la carrera la define quién ganó */}
        {results.map(({ id, place }) => (
          <g key={id} transform={standOn(id, place)}>
            {/* El salto va en un grupo interno: una animación de transform pisaría la posición de arriba */}
            <g className={place === 1 ? p.winner : undefined}>
              {id === 'player' ? <PlayerCar skin={game.carId} parked /> : <MachineCar parked />}
            </g>
          </g>
        ))}

        <Tint phase={timeOfDay} />

        {/* Reflectores sobre cada escalón */}
        <g style={{ mixBlendMode: 'screen', pointerEvents: 'none' }} opacity={SPOT_OPACITY[timeOfDay]}>
          {spotlights.map(({ x, top }) => (
            <polygon
              key={x}
              points={`${x - 16},0 ${x + 16},0 ${x + 112},${top} ${x - 112},${top}`}
              fill={`url(#${uid}-spot)`}
            />
          ))}
        </g>
      </svg>

      {isWinner && (
        <div className={p.confetti} aria-hidden="true">
          {CONFETTI.map(([left, delay, duration, color, size, spin]) => (
            <span
              key={left}
              className={p.piece}
              style={
                {
                  left: `${left}%`,
                  width: `${size}rem`,
                  height: `${size * 1.6}rem`,
                  backgroundColor: color,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                  '--spin': `${spin}deg`
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      )}

      <div className={p.panel}>
        <div className={p.banner}>
          <img alt="" src={isWinner ? DRIVER_CHEER_UP : DRIVER_SAD} className={p.driver} />
          <div className={p['banner-text']}>
            <h3 id={headingId} ref={headingRef} tabIndex={-1} className={p.heading}>
              {isWinner ? <Trophy /> : <Flag />}
              <span>{isWinner ? text['win-title'] : text['lose-title']}</span>
            </h3>
            <p className={p.lead}>{isWinner ? text['win-text'] : text['lose-text']}</p>
          </div>
        </div>

        <ol className={p.results} aria-label={text['podium-title']}>
          {results.map(({ id, name, points, place, mine }) => (
            <li key={id} className={p.card} data-place={place} data-mine={mine}>
              <span className={p.medal} aria-hidden="true">
                {place}
              </span>
              <div className={p['card-text']}>
                <p className={p.place}>{place === 1 ? text['place-1'] : text['place-2']}</p>
                <p className={p.name}>
                  {name}
                  {mine && <span className={p.you}>{text['racing-driver-user']}</span>}
                </p>
                <p className={p.points}>
                  <strong>{points}</strong> {text.points}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <p className={p.stats}>
          {text['stats-correct']}:{' '}
          <strong>
            {game.rightAnswers} {text['stats-of']} {questionCount}
          </strong>
        </p>
      </div>
    </section>
  );
};
