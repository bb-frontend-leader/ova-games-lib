import { useEffect, useRef, useState } from 'react';
import { Panel as PanelUI } from 'books-ui';

import { useLang } from '@/hooks';

import { ALT_STEP, i18n, INIT_POS, INIT_TOTAL } from './lib/constant';
import { MountainInitBg } from './mountain-init-bg';
import { MountainStage } from './mountain-stage';

import css from './game-mountain-climb.module.css';

interface Props {
  /** Sección del panel a la que lleva «¡A escalar!» (por defecto la siguiente, donde está el juego). */
  section?: number;
  addClass?: string;
  title?: string;
  /** Frase de bienvenida bajo el título. */
  textInit?: string;
}

/**
 * Pantalla de inicio: una montaña pequeña con el escalador a medio camino, el título y «Jugar», que abre las reglas.
 * «¡A escalar!» pasa a la sección indicada del panel.
 */
export const MountainInit: React.FC<Props> = ({ section = 1, addClass, title, textInit }) => {
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
        <MountainInitBg />
        {step === 'welcome' ? (
          <div className={css['init-content']}>
            <h2 className={css['init-title']}>{title ?? t.title}</h2>
            {textInit && <p className={css['init-text']}>{textInit}</p>}

            <div className={css['init-field']}>
              <MountainStage
                total={INIT_TOTAL}
                pos={INIT_POS}
                label={i18n[lang].stage(INIT_POS, INIT_TOTAL, INIT_POS * ALT_STEP)}
              />
            </div>

            <button ref={playRef} type="button" className={css.btn} onClick={() => goTo('rules')}>
              {t.play}
            </button>
          </div>
        ) : (
          <div className={css['init-content']}>
            <div className={css.rules} role="group" aria-labelledby="mountain-rules-title">
              <h2 id="mountain-rules-title" ref={rulesRef} tabIndex={-1} className={css['rules-title']}>
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
