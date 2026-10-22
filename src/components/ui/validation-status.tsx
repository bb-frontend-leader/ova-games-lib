import { useEffect, useRef } from 'react';

import { SOUNDS } from '@/constants';
import { useLang, usePlaySound } from '@/hooks';

interface Props {
  /** Si la actividad ya fue validada (mostrar mensaje) o no (región vacía). */
  validated: boolean;
  /** Si la respuesta validada es correcta. */
  correct: boolean;
  correctText?: string;
  wrongText?: string;
  addClass?: string;
}

const i18n = {
  es: { success: '¡Correcto!', wrong: '¡Incorrecto!' },
  en: { success: 'Correct!', wrong: 'Incorrect!' }
};

/**
 * Región `aria-live` invisible que anuncia el resultado de una validación a lectores de pantalla, como equivalente
 * textual de una retroalimentación que se comunica con color e íconos. Se monta siempre; solo cambia el texto.
 *
 * Al pasar a validada también reproduce el sonido de acierto o error. Si la página abre además un `ModalFeedback`,
 * prevalece el sonido del modal (ver `playSoundEffect`), así que la validación suena una sola vez.
 */
export const ValidationStatus: React.FC<Props> = ({ validated, correct, correctText, wrongText, addClass }) => {
  const lang = useLang();
  const playSound = usePlaySound();
  // Arranca con el valor actual: un componente que se monta ya validado no suena.
  const wasValidatedRef = useRef(validated);

  useEffect(() => {
    if (validated && !wasValidatedRef.current) playSound(correct ? SOUNDS.SUCCESS : SOUNDS.ERROR);
    wasValidatedRef.current = validated;
  }, [validated, correct, playSound]);

  return (
    <p className={`u-sr-only ${addClass ?? ''}`} role="status" aria-live="polite" aria-atomic="true">
      {validated ? (correct ? (correctText ?? i18n[lang].success) : (wrongText ?? i18n[lang].wrong)) : ''}
    </p>
  );
};
