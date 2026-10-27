import { useMemo } from 'react';
import { usePanelContext } from 'books-ui';

import { SOUNDS } from '@/constants';
import { useLang, usePlaySound } from '@/hooks';

import { ChevronLeftIcon, ChevronRightIcon } from '../icons';

import css from './panel.module.css';

const i18n = {
  es: {
    group: 'Secciones',
    section: 'Sección',
    of: 'de',
    previous: 'Atrás',
    next: 'Siguiente',
    goTo: 'Ir a la sección'
  },
  en: {
    group: 'Sections',
    section: 'Section',
    of: 'of',
    previous: 'Back',
    next: 'Next',
    goTo: 'Go to section'
  }
};

/** Navegación del panel: indica en qué sección está el usuario y permite moverse entre ellas. */
export const PanelNav = () => {
  const lang = useLang();
  const t = i18n[lang];
  const playSound = usePlaySound();
  const { isOpen, sectionsId, handleToggle } = usePanelContext();

  const current = useMemo(() => sectionsId.findIndex((uid) => uid === isOpen), [isOpen, sectionsId]);
  const total = sectionsId.length;

  if (total < 2) return null;

  const goTo = (index: number) => {
    playSound(SOUNDS.BUTTON);
    handleToggle(sectionsId[index]);
  };

  return (
    <nav className={css.nav} aria-label={t.group} data-screenshot-ignore>
      <p className={css.nav__status} aria-live="polite">
        {t.section} {current + 1} {t.of} {total}
      </p>

      <div className={css.nav__controls}>
        <button
          type="button"
          className={`js-panel-previous-button ${css.nav__button}`}
          disabled={current <= 0}
          onClick={() => goTo(current - 1)}
        >
          <ChevronLeftIcon />
          {t.previous}
        </button>

        <ol className={css.nav__dots}>
          {sectionsId.map((uid, index) => (
            <li key={uid}>
              <button
                type="button"
                className={css.nav__dot}
                aria-label={`${t.goTo} ${index + 1}`}
                aria-current={index === current ? 'step' : undefined}
                onClick={() => goTo(index)}
              />
            </li>
          ))}
        </ol>

        <button
          type="button"
          className={`js-panel-next-button ${css.nav__button}`}
          disabled={current >= total - 1}
          onClick={() => goTo(current + 1)}
        >
          {t.next}
          <ChevronRightIcon />
        </button>
      </div>
    </nav>
  );
};
