import { useEffect, useRef, useState } from 'react';
import { Panel as PanelUI } from 'books-ui';

import { useLang } from '@/hooks';

import { i18n } from './const/const';
import mainIcon from './public/assets/main_icon.webp';
import { PRIZE } from './utils/consts';
import { convertNumber } from './utils/convert-number';

import css from './game-millions.module.css';

interface GameMillionsInitProps {
  addClass?: string;
  title?: string;
  /** Frase de bienvenida bajo el título */
  textInit?: string;
}

/**
 * Pantalla de inicio: el logo del programa, el premio por respuesta y «Jugar», que abre las reglas.
 * «¡Empezar!» pasa a la sección siguiente del panel, donde está el juego.
 */
export const GameMillionsInit: React.FC<GameMillionsInitProps> = ({ addClass, title, textInit }) => {
  const lang = useLang();
  const text = i18n[lang];
  const t = text.Init;

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
    <div className={`${css.container} ${css.screen} ${addClass ?? ''}`}>
      {step === 'welcome' ? (
        <>
          <div className={css['logo-wrap']}>
            <img className={css.logo} src={mainIcon} alt={text.Logo} />
          </div>

          <div className={`${css.plaque} ${css['plaque--title']}`}>
            <span className={css.frame} aria-hidden="true" />
            <h2 className={css['plaque-text']}>{title ?? t.title}</h2>
          </div>

          {textInit && <p className={css['screen-text']}>{textInit}</p>}

          <p className={css['screen-text']}>
            <strong className={css.blank}>{t.prize(convertNumber(PRIZE))}</strong>
          </p>

          <div className={css['screen-actions']}>
            <button
              ref={playRef}
              type="button"
              className={`${css['nav-button']} ${css['nav-button--gold']}`}
              onClick={() => goTo('rules')}
            >
              <span className={css.halo} aria-hidden="true" />
              <span className={css.frame} aria-hidden="true" />
              <span className={css['nav-label']}>{t.play}</span>
            </button>
          </div>
        </>
      ) : (
        <div className={css['rules-wrap']} role="group" aria-labelledby="millions-rules-title">
          <div className={`${css.plaque} ${css['plaque--title']}`}>
            <span className={css.frame} aria-hidden="true" />
            <h2 id="millions-rules-title" ref={rulesRef} tabIndex={-1} className={css['plaque-text']}>
              {t.rulesTitle}
            </h2>
          </div>

          <ol className={css['rules-list']}>
            {t.rules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ol>

          <div className={css['screen-actions']}>
            <button type="button" className={css['nav-button']} onClick={() => goTo('welcome')}>
              <span className={css.halo} aria-hidden="true" />
              <span className={css.frame} aria-hidden="true" />
              <span className={css['nav-label']}>{t.back}</span>
            </button>

            <PanelUI.Button section={1}>
              <button type="button" className={`${css['nav-button']} ${css['nav-button--gold']}`}>
                <span className={css.halo} aria-hidden="true" />
                <span className={css.frame} aria-hidden="true" />
                <span className={css['nav-label']}>{t.start}</span>
              </button>
            </PanelUI.Button>
          </div>
        </div>
      )}
    </div>
  );
};
