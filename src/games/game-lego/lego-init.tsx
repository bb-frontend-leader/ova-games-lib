import { useEffect, useRef, useState } from 'react';
import { Panel as PanelUI } from 'books-ui';

import { useLang } from '@/hooks';

import { LegoModel } from './lego-model';
import { BACKGROUND, i18n } from './lib/constant';

import css from './game-lego.module.css';

interface Props {
  /** Sección del panel a la que lleva «¡A construir!» (por defecto la siguiente, donde está el juego). */
  section?: number;
  addClass?: string;
  title?: string;
  /** Frase de bienvenida bajo el título */
  textInit?: string;
}

/**
 * Pantalla de inicio: el modelo al que le falta una pieza, el título y «Jugar», que abre las reglas.
 * «¡A construir!» pasa a la sección indicada del panel.
 */
export const LegoInit: React.FC<Props> = ({ section = 1, addClass, title, textInit }) => {
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
      style={{ '--bg-image': `url(${BACKGROUND.replace(/\s/g, '')})` } as React.CSSProperties}
    >
      {step === 'welcome' ? (
        <div className={css['init-content']}>
          <h2 className={`${css.plate} ${css['init-title']}`}>{title ?? t.title}</h2>
          {textInit && <p className={css.plate}>{textInit}</p>}

          <div className={css['init-model']} aria-hidden="true">
            <LegoModel />
          </div>

          <button ref={playRef} type="button" className={css['brick-button']} onClick={() => goTo('rules')}>
            {t.play}
          </button>
        </div>
      ) : (
        <div className={css['init-content']}>
          <div className={`${css.plate} ${css.rules}`} role="group" aria-labelledby="lego-rules-title">
            <h2 id="lego-rules-title" ref={rulesRef} tabIndex={-1} className={css['rules-title']}>
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
                className={`${css['brick-button']} ${css['brick-button--ghost']}`}
                onClick={() => goTo('welcome')}
              >
                {t.back}
              </button>

              <PanelUI.Button section={section}>
                <button type="button" className={css['brick-button']}>
                  {t.start}
                </button>
              </PanelUI.Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
