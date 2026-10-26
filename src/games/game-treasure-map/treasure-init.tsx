import { useEffect, useRef, useState } from 'react';
import { Panel as PanelUI } from 'books-ui';

import { useLang } from '@/hooks';

import { i18n } from './lib/constant';
import { IslandArt, PortArt, ShipArt, TreasureArt } from './treasure-art';
import { TreasureInitBg } from './treasure-init-bg';

import css from './game-treasure-map.module.css';

interface Props {
  /** Sección del panel a la que lleva «¡Zarpar!» (por defecto la siguiente, donde está el juego). */
  section?: number;
  addClass?: string;
  title?: string;
  /** Frase de bienvenida bajo el título. */
  textInit?: string;
}

/** Mapa de muestra: el puerto, tres islas unidas por rutas con el barco en camino y la isla del tesoro. */
const Preview: React.FC = () => (
  <div className={css['init-map']} aria-hidden="true">
    <svg className={css['init-routes']} viewBox="0 0 100 60" preserveAspectRatio="none" focusable="false">
      <path d="M14 46Q26 30 38 34" className={css.route} data-state="sailed" />
      <path d="M38 34Q50 18 62 22" className={css.route} data-state="open" />
      <path d="M62 22Q74 14 86 14" className={css.route} data-state="faint" />
    </svg>
    <span className={css['init-place']} style={{ left: '12%', top: '78%' }}>
      <PortArt />
    </span>
    <span className={css['init-place']} data-kind="island" style={{ left: '38%', top: '56%' }}>
      <IslandArt kind="palm" visited />
    </span>
    <span className={css['init-place']} data-kind="island" style={{ left: '62%', top: '36%' }}>
      <IslandArt kind="hill" visited={false} />
    </span>
    <span className={css['init-place']} data-kind="big" style={{ left: '86%', top: '24%' }}>
      <TreasureArt />
    </span>
    <span className={css['init-ship']} style={{ left: '27%', top: '58%' }}>
      <ShipArt />
    </span>
  </div>
);

/**
 * Pantalla de inicio: un mapa de muestra, el título y «Jugar», que abre las reglas.
 * «¡Zarpar!» pasa a la sección indicada del panel.
 */
export const TreasureInit: React.FC<Props> = ({ section = 1, addClass, title, textInit }) => {
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
        <TreasureInitBg />
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
            <div className={css.rules} role="group" aria-labelledby="treasure-rules-title">
              <h2 id="treasure-rules-title" ref={rulesRef} tabIndex={-1} className={css['rules-title']}>
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
