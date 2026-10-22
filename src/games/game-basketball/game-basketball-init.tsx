import { useEffect, useRef, useState } from 'react';

import { Panel } from '@/components/ui';
import { useLang } from '@/hooks';

import { BACKGROUND, i18n, TITLE } from './lib/constant';

import css from './game-basketball.module.css';

interface Props {
  /** Sección del panel a la que lleva «¡A jugar!» (por defecto la siguiente, donde está el juego). */
  section?: number;
  addClass?: string;
  title?: string;
  /** Frase de bienvenida bajo el tablero */
  textInit?: string;
}

const safeSrc = (rawSrc: string): string => rawSrc.replace(/\s/g, ''); // Elimina espacios en blanco accidentales

/**
 * Pantalla de inicio: el tablero con la canasta y el balón, el título y «Jugar», que abre las reglas del partido.
 * «¡A jugar!» pasa a la sección indicada del panel.
 */
export const GameBasketballInit: React.FC<Props> = ({ section = 1, addClass, title, textInit }) => {
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
    <div
      className={`${css.init} ${addClass ?? ''}`}
      style={{ '--bg-image': `url("${safeSrc(BACKGROUND.cover)}")` } as React.CSSProperties}
    >
      {step === 'welcome' ? (
        <div className={css['init-content']}>
          <h2 className={css['init-title']}>{title ?? t.title}</h2>

          {/* Decorativo: el tablero ya está descrito por el título */}
          <img src={safeSrc(TITLE)} alt="" aria-hidden="true" className={css['init-board']} />

          {textInit && <p className={css['init-text']}>{textInit}</p>}

          <button ref={playRef} type="button" className={css['init-button']} onClick={() => goTo('rules')}>
            {t.play}
          </button>
        </div>
      ) : (
        <div className={css['init-content']}>
          <div className={css.rules} role="group" aria-labelledby="basketball-rules-title">
            <h2 id="basketball-rules-title" ref={rulesRef} tabIndex={-1} className={css['rules-title']}>
              {t.rulesTitle}
            </h2>

            <ol className={css['rules-list']}>
              {t.rules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ol>

            <div className={css['init-actions']}>
              <button
                type="button"
                className={`${css['init-button']} ${css['init-button--ghost']}`}
                onClick={() => goTo('welcome')}
              >
                {t.back}
              </button>

              <Panel.Button section={section}>
                <button type="button" className={css['init-button']}>
                  {t.start}
                </button>
              </Panel.Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
