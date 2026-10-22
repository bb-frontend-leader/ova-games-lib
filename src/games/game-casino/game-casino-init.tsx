import { useEffect, useRef, useState } from 'react';
import { Panel as PanelUI } from 'books-ui';

import { useLang } from '@/hooks';

import { ChipStack } from './game-casino-chips';
import { BET_CHIPS } from './lib/chips';
import { BG, i18n } from './lib/constant';

import css from './game-casino.module.css';

interface GameCasinoInitProps {
  className?: string;
  /** Sección del panel a la que lleva «Buena suerte» (por defecto la siguiente, donde está el juego). */
  section?: number;
  /** Frase de bienvenida bajo el letrero */
  textInit?: string;
}

const safeSrc = (rawSrc: string): string => rawSrc.replace(/\s/g, ''); // Elimina espacios en blanco accidentales

/**
 * Pantalla de inicio: el letrero del casino, las fichas de apuesta y «Jugar», que abre las reglas de la mesa.
 * «Buena suerte» pasa a la sección indicada del panel.
 */
export const GameCasinoInit: React.FC<GameCasinoInitProps> = ({ textInit, className, section = 1 }) => {
  const lang = useLang();
  const t = i18n[lang];

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
      className={`${css.init} ${className ?? ''}`}
      style={{ '--casino-bg': `url(${safeSrc(BG.background)})` } as React.CSSProperties}
    >
      {step === 'welcome' ? (
        <div className={css['init-content']}>
          <div className={css['init-sign']} style={{ '--sign': `url(${safeSrc(BG.casino14)})` } as React.CSSProperties}>
            <h2 className={css['init-title']}>{t.init.title}</h2>
          </div>

          {textInit && <p className={css['init-text']}>{textInit}</p>}

          <span className={css['init-chips']} aria-hidden="true">
            {BET_CHIPS.map((kind, i) => (
              <ChipStack key={kind.id} kind={kind} count={4 + i * 2} />
            ))}
          </span>

          <button ref={playRef} type="button" className={css['init-button']} onClick={() => goTo('rules')}>
            {t.play}
          </button>
        </div>
      ) : (
        <div className={css['init-content']}>
          <div className={css['init-rules']} role="group" aria-labelledby="casino-rules-title">
            <h2 id="casino-rules-title" ref={rulesRef} tabIndex={-1} className={css['init-rules-title']}>
              {t.init.rulesTitle}
            </h2>

            <ol className={css['init-rules-list']}>
              {t.init.rules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ol>

            <div className={css['init-actions']}>
              <button
                type="button"
                className={`${css['init-button']} ${css['init-button--ghost']}`}
                onClick={() => goTo('welcome')}
              >
                {t.init.back}
              </button>

              <PanelUI.Button section={section}>
                <button type="button" className={css['init-button']}>
                  ¡{t.goodLuck}!
                </button>
              </PanelUI.Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
