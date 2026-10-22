import { useLang } from '@/hooks';

import { InfoIcon } from '../icons';

import css from './full-screen.module.css';

const i18n = {
  es: 'Para ver mejor el juego, pulsa el botón de "ver en pantalla completa" y gira tu dispositivo a posición horizontal.',
  en: 'For a better view, press the "View in full screen" button and rotate your device to horizontal position.'
};

interface Props {
  addClass?: string;
}

/** Aviso que solo se muestra en pantallas pequeñas en vertical, donde los juegos se ven mejor en horizontal. */
export const FullScreenAlert: React.FC<Props> = ({ addClass }) => {
  const lang = useLang();

  return (
    <div role="alert" aria-live="assertive" aria-atomic="true" className={`${css.alert} ${addClass ?? ''}`}>
      <InfoIcon className={css.alert__icon} />
      <p>{i18n[lang]}</p>
    </div>
  );
};
