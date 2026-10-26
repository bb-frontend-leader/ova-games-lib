import { useEffect, useRef, useState } from 'react';
import { Panel as PanelUI } from 'books-ui';

import { useLang } from '@/hooks';

import { ACCENTS, i18n } from './lib/constant';
import { LoteriaInitBg } from './loteria-init-bg';

import css from './game-loteria.module.css';

interface Props {
  /** Sección del panel a la que lleva «¡A jugar!» (por defecto la siguiente, donde está el juego). */
  section?: number;
  addClass?: string;
  title?: string;
  /** Frase de bienvenida bajo el título. */
  textInit?: string;
}

const SAMPLE = ['🌽', '🐓', '🌹', '🪁', '🎺', '🌵'];

/** Tabla de muestra: seis cartas con sus colores, dos de ellas ya con frijoles. */
const Preview: React.FC = () => (
  <div className={css['init-board']} aria-hidden="true">
    {SAMPLE.map((emoji, k) => (
      <span
        key={emoji}
        className={css['init-card']}
        style={{ '--accent': ACCENTS[k % ACCENTS.length] } as React.CSSProperties}
        data-marked={k === 1 || k === 4 ? '' : undefined}
      >
        <span className={css['init-num']}>{k + 1}</span>
        <span className={css['init-pic']}>{emoji}</span>
        {(k === 1 || k === 4) && (
          <span className={css.beans}>
            <i />
            <i />
            <i />
          </span>
        )}
      </span>
    ))}
  </div>
);

/**
 * Pantalla de inicio: una tabla de muestra, el título y «Jugar», que abre las reglas.
 * «¡A jugar!» pasa a la sección indicada del panel.
 */
export const LoteriaInit: React.FC<Props> = ({ section = 1, addClass, title, textInit }) => {
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
        <LoteriaInitBg />
        {step === 'welcome' ? (
          <div className={css['init-content']}>
            <h2 className={css['init-title']}>{title ?? t.title}</h2>
            {textInit && <p className={css['init-text']}>{textInit}</p>}

            <div className={css['init-field']}>
              <Preview />
            </div>

            <button ref={playRef} type="button" className={css.btn} onClick={() => goTo('rules')}>
              {t.play}
            </button>
          </div>
        ) : (
          <div className={css['init-content']}>
            <div className={css.rules} role="group" aria-labelledby="loteria-rules-title">
              <h2 id="loteria-rules-title" ref={rulesRef} tabIndex={-1} className={css['rules-title']}>
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
