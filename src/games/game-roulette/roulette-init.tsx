import { useEffect, useMemo, useRef, useState } from 'react';
import { Panel as PanelUI } from 'books-ui';

import { useLang } from '@/hooks';

import { i18n, PALETTE, SPECIAL_COLORS } from './lib/constant';
import { RouletteInitBg } from './roulette-init-bg';
import { RouletteWheel } from './roulette-wheel';

import type { WedgeView } from './types/types';

import css from './game-roulette.module.css';

interface Props {
  /** Sección del panel a la que lleva «¡A girar!» (por defecto la siguiente, donde está el juego). */
  section?: number;
  addClass?: string;
  title?: string;
  /** Frase de bienvenida bajo el título. */
  textInit?: string;
}

/** Ruleta de muestra: seis casillas de pregunta y las dos especiales. */
const DEMO_KINDS = ['question', 'question', 'joker', 'question', 'question', 'double', 'question', 'question'] as const;

/**
 * Pantalla de inicio: la ruleta girando despacio, el título y «Jugar», que abre las reglas.
 * «¡A girar!» pasa a la sección indicada del panel.
 */
export const RouletteInit: React.FC<Props> = ({ section = 1, addClass, title, textInit }) => {
  const lang = useLang();
  const t = i18n[lang].init;

  const [step, setStep] = useState<'welcome' | 'rules'>('welcome');
  const playRef = useRef<HTMLButtonElement>(null);
  const rulesRef = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false); // El foco solo se mueve si el usuario cambió de paso

  const views = useMemo<WedgeView[]>(
    () =>
      DEMO_KINDS.map((kind, i) => ({
        id: `demo-${i}`,
        kind,
        state: 'pending',
        number: i + 1,
        ...(kind === 'question' ? PALETTE[i % PALETTE.length] : SPECIAL_COLORS[kind])
      })),
    []
  );

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
        <RouletteInitBg />
        {step === 'welcome' ? (
          <div className={css['init-content']}>
            <h2 className={css['init-title']}>{title ?? t.title}</h2>
            {textInit && <p className={css['init-text']}>{textInit}</p>}

            <div className={css['init-wheel']}>
              <RouletteWheel views={views} wheelClassName={css['spin-slow']} />
            </div>

            <button ref={playRef} type="button" className={css.btn} onClick={() => goTo('rules')}>
              {t.play}
            </button>
          </div>
        ) : (
          <div className={css['init-content']}>
            <div className={css.rules} role="group" aria-labelledby="roulette-rules-title">
              <h2 id="roulette-rules-title" ref={rulesRef} tabIndex={-1} className={css['rules-title']}>
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
