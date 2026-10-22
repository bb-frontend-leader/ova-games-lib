import { useEffect } from 'react';

import { useFullScreen, useLang } from '@/hooks';

import { FullscreenExitIcon, FullscreenIcon } from '../icons';

import css from './full-screen.module.css';

const i18n = {
  es: { enter: 'Ver en pantalla completa', exit: 'Salir de pantalla completa' },
  en: { enter: 'View in full screen', exit: 'Exit full screen' }
};

interface Props {
  /** `id` del elemento que pasa a pantalla completa. */
  elementId: string;
  addClass?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Al pasar a `true` alterna la pantalla completa sin que el usuario pulse el botón. */
  controlFullScreen?: boolean;
}

/** Botón para llevar un juego a pantalla completa; solo se muestra en pantallas pequeñas. */
export const FullScreenButton: React.FC<Props> = ({ elementId, addClass, controlFullScreen, onClick }) => {
  const lang = useLang();
  const [isFullScreen, toggleFullScreen] = useFullScreen(elementId);
  const label = isFullScreen ? i18n[lang].exit : i18n[lang].enter;

  useEffect(() => {
    if (controlFullScreen) toggleFullScreen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controlFullScreen]);

  return (
    <button
      type="button"
      className={`${css.button} ${addClass ?? ''}`}
      aria-label={label}
      aria-pressed={isFullScreen}
      title={label}
      disabled={!document.fullscreenEnabled}
      onClick={(event) => {
        onClick?.(event);
        toggleFullScreen();
      }}
    >
      {isFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
    </button>
  );
};
