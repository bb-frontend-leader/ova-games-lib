import { useEffect, useRef, useState } from 'react';
import { Panel as PanelUI } from 'books-ui';

import { useLang } from '@/hooks';

import { LanesCar } from './lanes-car';
import { LanesInitBg } from './lanes-init-bg';
import { i18n, PLAYER_COLOR } from './lib/constant';

import css from './game-lane-race.module.css';

interface Props {
  /** Sección del panel a la que lleva «¡A correr!» (por defecto la siguiente, donde está el juego). */
  section?: number;
  addClass?: string;
  title?: string;
  /** Frase de bienvenida bajo el título. */
  textInit?: string;
}

/** Pista de muestra: tres carriles con su puerta (cartel de respuesta) y una línea de meta a cuadros. */
const Preview: React.FC = () => (
  <svg className={css.preview} viewBox="0 0 300 138" aria-hidden="true" focusable="false">
    <rect width="300" height="138" rx="10" fill="#2b3340" />
    <g stroke="#ffffff" strokeWidth="2.500" strokeDasharray="12 10" opacity="0.7">
      <line x1="0" y1="46" x2="300" y2="46" />
      <line x1="0" y1="92" x2="300" y2="92" />
    </g>
    {['A', 'B', 'C'].map((letter, k) => (
      <g key={letter} transform={`translate(188 ${k * 46 + 7})`}>
        <rect width="104" height="32" rx="8" fill="#fff8e6" stroke="#ffc933" strokeWidth="2.500" />
        <circle cx="18" cy="16" r="10" fill="#8a3f14" />
        <text x="18" y="21" textAnchor="middle" fontSize="13" fontWeight="800" fill="#ffffff">
          {letter}
        </text>
        <rect x="36" y="11" width="56" height="4" rx="2" fill="#2a170c" opacity="0.7" />
        <rect x="36" y="19" width="38" height="4" rx="2" fill="#2a170c" opacity="0.4" />
      </g>
    ))}
    {Array.from({ length: 12 }, (_, k) => (
      <rect key={k} x="176" y={k * 11.5} width="9" height="5.75" fill={k % 2 ? '#ffffff' : '#e5383b'} />
    ))}
  </svg>
);

/**
 * Pantalla de inicio: una pista de muestra con el coche, el título y «Jugar», que abre las reglas.
 * «¡A correr!» pasa a la sección indicada del panel.
 */
export const LanesInit: React.FC<Props> = ({ section = 1, addClass, title, textInit }) => {
  const lang = useLang();
  const t = i18n[lang].init;

  const [step, setStep] = useState<'welcome' | 'rules'>('welcome');
  const playRef = useRef<HTMLButtonElement>(null);
  const rulesRef = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false); // El foco solo se mueve si el usuario cambió de paso

  useEffect(() => {
    if (!moved.current) return;

    (step === 'rules' ? rulesRef : playRef).current?.focus({ preventScroll: true });
  }, [step]);

  const goTo = (next: 'welcome' | 'rules') => {
    moved.current = true;
    setStep(next);
  };

  return (
    <div className={css['init-frame']}>
      <div className={`${css.init} ${addClass ?? ''}`}>
        <LanesInitBg />
        {step === 'welcome' ? (
          <div className={css['init-content']}>
            <h2 className={css['init-title']}>{title ?? t.title}</h2>
            {textInit && <p className={css['init-text']}>{textInit}</p>}

            <div className={css['init-field']}>
              <Preview />
              <LanesCar className={css['init-car']} color={PLAYER_COLOR} />
            </div>

            <button ref={playRef} type="button" className={css.btn} onClick={() => goTo('rules')}>
              {t.play}
            </button>
          </div>
        ) : (
          <div className={css['init-content']}>
            <div className={css.rules} role="group" aria-labelledby="lanes-rules-title">
              <h2 id="lanes-rules-title" ref={rulesRef} tabIndex={-1} className={css['rules-title']}>
                {t.rulesTitle}
              </h2>

              <ol className={css['rules-list']}>
                {t.rules.map((rule) => (
                  <li key={rule}>{rule}</li>
                ))}
              </ol>

              <div className={css.actions}>
                <button type="button" className={css.btn} data-variant="ghost" onClick={() => goTo('welcome')}>
                  {t.back}
                </button>

                <PanelUI.Button section={section}>
                  <button type="button" className={css.btn}>
                    {t.start}
                  </button>
                </PanelUI.Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
