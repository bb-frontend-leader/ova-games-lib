import { useEffect, useRef, useState } from 'react';
import { Panel as PanelUI } from 'books-ui';

import { useLang } from '@/hooks';

import { JeopardyInitBg } from './jeopardy-init-bg';
import { i18n } from './lib/constant';

import css from './game-jeopardy.module.css';

interface Props {
  /** Sección del panel a la que lleva «¡Al tablero!» (por defecto la siguiente, donde está el juego). */
  section?: number;
  addClass?: string;
  title?: string;
  /** Frase de bienvenida bajo el título. */
  textInit?: string;
}

const MINI_COLUMNS = 4;
const MINI_ROWS = 3;

/**
 * Pantalla de inicio: un tablero de muestra, el título y «Jugar», que abre las reglas.
 * «¡Al tablero!» pasa a la sección indicada del panel.
 */
export const JeopardyInit: React.FC<Props> = ({ section = 1, addClass, title, textInit }) => {
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
        <JeopardyInitBg />
        {step === 'welcome' ? (
          <div className={css['init-content']}>
            <h2 className={css['init-title']}>{title ?? t.title}</h2>
            {textInit && <p className={css['init-text']}>{textInit}</p>}

            <div
              className={css['mini-board']}
              aria-hidden="true"
              style={{ '--cols': MINI_COLUMNS } as React.CSSProperties}
            >
              {Array.from({ length: MINI_COLUMNS }, (_, c) => (
                <div key={c} className={css['mini-column']}>
                  <span className={css['mini-header']} />
                  {Array.from({ length: MINI_ROWS }, (_, r) => (
                    <span key={r} className={css['mini-cell']} style={{ '--i': c + r } as React.CSSProperties}>
                      {(r + 1) * 100}
                    </span>
                  ))}
                </div>
              ))}
            </div>

            <button ref={playRef} type="button" className={css.btn} onClick={() => goTo('rules')}>
              {t.play}
            </button>
          </div>
        ) : (
          <div className={css['init-content']}>
            <div className={css.rules} role="group" aria-labelledby="jeopardy-rules-title">
              <h2 id="jeopardy-rules-title" ref={rulesRef} tabIndex={-1} className={css['rules-title']}>
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
