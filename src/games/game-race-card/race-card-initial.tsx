import React, { useEffect, useId, useRef, useState } from 'react';

import { Panel } from '@/components/ui';
import { SOUNDS } from '@/constants';
import { useCanAnimate, useLang, usePlaySound } from '@/hooks';

import type { CarId } from './lib/cars';
import { CAR_SKINS, getSkin, skinVars } from './lib/cars';
import { i18n } from './lib/constant';
import { pickRandomName } from './lib/names';
import type { TimeOfDay } from './lib/time-of-day';
import { SKY } from './lib/time-of-day';
import { useSvgUid } from './lib/use-svg-uid';
import { useGameContext } from './race-card-context';
import { PlayerCar, Road, Sky, Tint } from './svg-parts';

import type { DriversType } from './types/types';

import s from './styles/race-start.module.css';
import raceSvg from './styles/race-svg.module.css';
import css from './svg-card.module.css';

interface Props {
  messageInitial?: string;
  section?: number;
  /** Los mismos nombres que se pasan a las escenas: así la vista previa del marcador coincide con el real */
  drivers?: DriversType;
}

const NAME_MAX_LENGTH = 12;
// Semáforo de salida: cada luz se enciende con este intervalo y, con la verde, el auto arranca poco después
const LIGHT_STEP_MS = 600;
const GO_DELAY_MS = 450;
const LIGHTS = ['red', 'amber', 'green'] as const;

/**
 * Icono de la franja del día (sol, sol a ras del horizonte o luna).
 */
const PhaseIcon = ({ phase }: { phase: TimeOfDay }) => (
  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false" className={s['phase-icon']}>
    {phase === 'night' ? (
      <path d="M16.5 3.5a9 9 0 1 0 4 16.2A8 8 0 0 1 16.5 3.5z" fill="currentColor" />
    ) : (
      <>
        <circle cx="12" cy={phase === 'day' ? 12 : 16} r="5" fill="currentColor" />
        <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path
            d={
              phase === 'day'
                ? 'M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1'
                : 'M12 5v3M3.5 9.5l2 2M20.5 9.5l-2 2M2 20h20'
            }
          />
        </g>
      </>
    )}
  </svg>
);

/**
 * Dado del botón de nombre al azar. `spin` lo hace girar cada vez que se pulsa (la `key` reinicia la animación).
 */
const DiceIcon = ({ spin }: { spin: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    width="26"
    height="26"
    aria-hidden="true"
    focusable="false"
    className={s.dice}
    data-spin={spin}
  >
    <rect x="3" y="3" width="18" height="18" rx="4" fill="none" stroke="currentColor" strokeWidth="2.2" />
    <g fill="currentColor">
      <circle cx="8.5" cy="8.5" r="1.6" />
      <circle cx="15.5" cy="8.5" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="8.5" cy="15.5" r="1.6" />
      <circle cx="15.5" cy="15.5" r="1.6" />
    </g>
  </svg>
);

interface PreviewProps {
  carId: CarId;
  phase: TimeOfDay;
  uid: string;
  label: string;
}

/**
 * Vista previa del auto elegido sobre un trozo de pista con el cielo de la franja actual.
 */
const CarPreview = ({ carId, phase, uid, label }: PreviewProps) => {
  const palette = SKY[phase];
  const gradient = `${uid}-preview`;

  return (
    <svg
      className={`${raceSvg['race-svg']} ${s.preview}`}
      viewBox="0 268 346 142"
      role="img"
      aria-label={label}
      data-phase={phase}
    >
      <defs>
        <linearGradient id={gradient} x1={0} y1={0} x2={0} y2={1}>
          <stop offset={0} stopColor={palette.top} />
          <stop offset={0.7} stopColor={palette.bottom} />
        </linearGradient>
      </defs>
      <rect x={0} y={268} width={346} height={142} fill={`url(#${gradient})`} />
      <rect x={0} y={374} width={346} height={36} fill="#d6d5cd" />
      <rect x={0} y={370} width={346} height={6} fill="#e42d2c" />
      <path d="M0 373h346" stroke="#fdfdfd" strokeWidth={6} strokeDasharray="22 22" />
      <g key={carId} className={s['preview-car']}>
        <PlayerCar skin={carId} />
      </g>
      <Tint phase={phase} />
    </svg>
  );
};

export const RaceCardInitial: React.FC<Props> = ({ messageInitial, section = 1, drivers }) => {
  const lang = useLang();
  const text = i18n[lang];

  const { game, updateGame, timeOfDay } = useGameContext();
  const canAnimate = useCanAnimate();
  const playSound = usePlaySound();
  const uid = useSvgUid();
  const baseId = useId();

  const [step, setStep] = useState<1 | 2>(1);
  const [lights, setLights] = useState(0); // 0 = apagado; 1..3 = luces encendidas
  const [rolls, setRolls] = useState(0); // veces que se pidió un nombre al azar
  const [announce, setAnnounce] = useState('');
  const headingRef = useRef<HTMLHeadingElement>(null);
  const goRef = useRef<HTMLButtonElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  const launching = lights > 0;
  const skin = getSkin(game.carId);
  const name = game.playerName.trim();

  /**
   * Al cambiar de paso el foco pasa al título del nuevo paso: el botón que se pulsó desaparece y el teclado
   * o el lector de pantalla no deben quedarse sin lugar.
   */
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    headingRef.current?.focus();
  }, [step]);

  /**
   * Semáforo: enciende una luz cada `LIGHT_STEP_MS`; con la verde espera un momento y pulsa el botón oculto que
   * lleva a la primera pregunta.
   */
  useEffect(() => {
    if (!launching) return;

    if (lights < LIGHTS.length) {
      playSound(SOUNDS.TICK);
      const next = setTimeout(() => setLights(lights + 1), LIGHT_STEP_MS);

      return () => clearTimeout(next);
    }

    playSound(SOUNDS.WHOOSH);
    const go = setTimeout(() => {
      goRef.current?.click();
      // Si el jugador vuelve a esta sección, el semáforo está apagado y puede arrancar de nuevo
      setLights(0);
    }, GO_DELAY_MS);

    return () => clearTimeout(go);
  }, [launching, lights, playSound]);

  const handleName = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateGame({ playerName: event.target.value.slice(0, NAME_MAX_LENGTH) });
  };

  const handleRandomName = () => {
    const next = pickRandomName(lang, game.playerName);

    playSound(SOUNDS.FLIP);
    updateGame({ playerName: next });
    setRolls((count) => count + 1);
    // El foco se queda en el botón: el cambio del campo se avisa aparte, sin mover al usuario
    setAnnounce(`${text['random-name-done']} ${next}`);
  };

  const goTo = (target: 1 | 2) => {
    playSound(SOUNDS.BUTTON);
    setStep(target);
  };

  const handleStart = (event: React.FormEvent) => {
    event.preventDefault();
    updateGame({ playerName: name });

    if (!canAnimate) {
      goRef.current?.click();
      return;
    }

    setLights(1);
    // El botón que se pulsó queda deshabilitado: el foco se queda en el semáforo
    requestAnimationFrame(() => statusRef.current?.focus());
  };

  const lightText = [text['start-message'], text['lights-ready'], text['lights-set'], text['lights-go']][lights];
  const headingId = `${baseId}-heading`;

  return (
    <div className={`${css['game']} ${s.start}`} data-phase={timeOfDay}>
      {/* Fondo decorativo: el mismo cielo y la misma pista de las preguntas, a la hora de la franja actual */}
      <svg
        className={`${raceSvg['race-svg']} ${s.backdrop}`}
        viewBox="0 0 777.6 500"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        focusable="false"
        style={{ '--track-move-time': '9s' } as React.CSSProperties}
      >
        <Sky phase={timeOfDay} uid={uid} />
        <Road />
        <Tint phase={timeOfDay} />
      </svg>

      <div className={s.card}>
        <div className={s.flag} aria-hidden="true" />

        <div className={s.body}>
          <div className={s.top}>
            <p className={s.chip}>
              <PhaseIcon phase={timeOfDay} />
              <span>
                {text['phase-label']} <strong>{text[`phase-${timeOfDay}`]}</strong>
              </span>
            </p>
            <h3 className={s.title}>{text['start-title']}</h3>
            {messageInitial && step === 1 && (
              <p className={s.message} dangerouslySetInnerHTML={{ __html: messageInitial }} />
            )}
          </div>

          {step === 1 ? (
            <form
              className={s.step}
              aria-labelledby={headingId}
              onSubmit={(event) => {
                event.preventDefault();
                goTo(2);
              }}
            >
              <p className={s.eyebrow}>{text['step-name']}</p>
              <h4 id={headingId} ref={headingRef} tabIndex={-1} className={s.heading}>
                {text['name-title']}
              </h4>

              <div className={s.field}>
                <label htmlFor={`${baseId}-name`} className={s.label}>
                  {text['name-label']}
                </label>
                <div className={s['input-row']}>
                  <input
                    id={`${baseId}-name`}
                    className={s.input}
                    type="text"
                    value={game.playerName}
                    maxLength={NAME_MAX_LENGTH}
                    autoComplete="nickname"
                    enterKeyHint="next"
                    aria-describedby={`${baseId}-hint`}
                    onChange={handleName}
                  />
                  {/* Solo se ve el dado: el texto es el nombre accesible y el `title` da el tooltip al pasar el mouse */}
                  <button
                    type="button"
                    className={`${s.button} ${s['button--ghost']} ${s['button--dice']}`}
                    title={text['random-name']}
                    onClick={handleRandomName}
                  >
                    <DiceIcon key={rolls} spin={rolls > 0} />
                    <span className={s['sr-only']}>{text['random-name']}</span>
                  </button>
                </div>
                <p role="status" className={s['sr-only']}>
                  {announce}
                </p>
                <p id={`${baseId}-hint`} className={s.hint}>
                  {text['name-hint']}
                </p>
              </div>

              {/* Así se verá en el marcador (la etiqueta ya se lee en el campo, esto es solo la vista previa) */}
              <p key={rolls} className={s.plate} data-rolled={rolls > 0} aria-hidden="true">
                <span className={s['plate-name']}>{name || drivers?.player || text['racing-driver-user']}</span>
                <span className={s['plate-vs']}>VS</span>
                <span className={s['plate-name']}>{drivers?.machine || text['racing-driver-bot']}</span>
              </p>

              <div className={s.actions}>
                <button type="submit" className={`${s.button} ${s['button--primary']}`}>
                  {text['next-button']}
                </button>
              </div>
            </form>
          ) : (
            <form className={s.step} aria-labelledby={headingId} onSubmit={handleStart}>
              <p className={s.eyebrow}>{text['step-car']}</p>
              <h4 id={headingId} ref={headingRef} tabIndex={-1} className={s.heading}>
                {text['car-title']}
              </h4>
              <p className={s.hint}>{text['car-hint']}</p>

              <CarPreview
                carId={game.carId}
                phase={timeOfDay}
                uid={uid}
                label={`${text['preview-label']}: ${text[`car-${skin.id}`]}`}
              />

              <div role="radiogroup" aria-labelledby={headingId} className={s.cars}>
                {CAR_SKINS.map((option) => (
                  <label key={option.id} className={s.option}>
                    <input
                      className={s['option-input']}
                      type="radio"
                      name={`${baseId}-car`}
                      value={option.id}
                      checked={game.carId === option.id}
                      disabled={launching}
                      onChange={() => {
                        playSound(SOUNDS.POP);
                        updateGame({ carId: option.id });
                      }}
                    />
                    <span className={s.swatch} style={skinVars(option.id)} aria-hidden="true" />
                    <span>{text[`car-${option.id}`]}</span>
                  </label>
                ))}
              </div>

              {launching ? (
                <div ref={statusRef} tabIndex={-1} className={s.lights} aria-label={text['lights-label']}>
                  <div className={s.lamps} aria-hidden="true">
                    {LIGHTS.map((color, index) => (
                      <span key={color} className={s.lamp} data-color={color} data-on={lights === index + 1} />
                    ))}
                  </div>
                  <p role="status" className={s['lights-text']}>
                    {lightText}
                  </p>
                </div>
              ) : (
                <div className={s.actions}>
                  <button type="button" className={`${s.button} ${s['button--ghost']}`} onClick={() => goTo(1)}>
                    {text['back-button']}
                  </button>
                  <button type="submit" className={`${s.button} ${s['button--primary']}`}>
                    {text['start-button']}
                  </button>
                </div>
              )}
            </form>
          )}
        </div>
      </div>

      {/* Lleva a la primera pregunta cuando termina el semáforo (o al instante si no hay animaciones) */}
      <Panel.Button section={section}>
        <button ref={goRef} type="button" hidden tabIndex={-1} aria-hidden="true">
          {text['start-button']}
        </button>
      </Panel.Button>
    </div>
  );
};
