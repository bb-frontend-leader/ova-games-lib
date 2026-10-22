import { useEffect, useRef, useState } from 'react';
import { Panel as PanelUI } from 'books-ui';

import { useLang } from '@/hooks';

import { GameCastleHero } from './game-castle-hero';
import { GameCastleScene } from './game-castle-scene';
import { i18n } from './lib/constant';

import css from './game-castle.module.css';

interface Props {
  /** Sección del panel a la que lleva «¡Al castillo!» (por defecto la siguiente, donde está el juego). */
  section?: number;
  addClass?: string;
  title?: string;
  /** Frase de bienvenida bajo el título */
  textInit?: string;
}

/**
 * Pantalla de inicio: el castillo con el héroe esperando, el título y «Jugar», que abre las reglas.
 * «¡Al castillo!» pasa a la sección indicada del panel.
 */
export const GameCastleInit: React.FC<Props> = ({ section = 1, addClass, title, textInit }) => {
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
    <div className={`${css.frame} ${addClass ?? ''}`}>
      <div className={`${css.stage} ${css['stage--init']}`}>
        <GameCastleScene />

        {step === 'welcome' ? (
          <div className={css['init-content']}>
            <h2 className={`${css.plaque} ${css['init-title']}`}>{title ?? t.title}</h2>
            {textInit && <p className={`${css.plaque} ${css['init-text']}`}>{textInit}</p>}

            <button ref={playRef} type="button" className={css['pixel-button']} onClick={() => goTo('rules')}>
              {t.play}
            </button>
          </div>
        ) : (
          <div className={css['init-content']}>
            <div className={`${css.plaque} ${css.rules}`} role="group" aria-labelledby="castle-rules-title">
              <h2 id="castle-rules-title" ref={rulesRef} tabIndex={-1} className={css['rules-title']}>
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
                  className={`${css['pixel-button']} ${css['pixel-button--ghost']}`}
                  onClick={() => goTo('welcome')}
                >
                  {t.back}
                </button>

                <PanelUI.Button section={section}>
                  <button type="button" className={css['pixel-button']}>
                    {t.start}
                  </button>
                </PanelUI.Button>
              </div>
            </div>
          </div>
        )}

        <GameCastleHero sprite={null} />
      </div>
    </div>
  );
};
