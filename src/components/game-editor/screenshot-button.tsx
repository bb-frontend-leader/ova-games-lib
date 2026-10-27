import { useState } from 'react';
import { toPng } from 'html-to-image';

import { Button } from '@/components/ui';

import { inlineSvgStyles } from './inline-svg-styles';

import css from './game-editor.module.css';

interface Props {
  /** El marco del juego: lo que sale en la imagen. */
  targetRef: React.RefObject<HTMLElement>;
  /** Nombre del archivo, sin extensión. */
  filename: string;
}

/** Botón «Tomar captura» que descarga solo el juego tal como se ve en pantalla (sin la navegación del panel), para pegarlo en el material del docente. */
export const ScreenshotButton: React.FC<Props> = ({ targetRef, filename }) => {
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  const handleClick = async () => {
    const target = targetRef.current;
    if (!target || busy) return;

    setBusy(true);
    setFailed(false);

    const restoreSvgStyles = inlineSvgStyles(target);

    try {
      const dataUrl = await toPng(target, {
        pixelRatio: 2,
        // Solo el juego: sin la navegación de secciones del panel ni el borde y la sombra del marco.
        filter: (node) => !(node instanceof HTMLElement && node.hasAttribute('data-screenshot-ignore')),
        style: { border: 'none', borderRadius: '0', boxShadow: 'none' },
        backgroundColor: getComputedStyle(target).backgroundColor
      });

      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      setFailed(true);
    } finally {
      restoreSvgStyles();
      setBusy(false);
    }
  };

  return (
    <>
      <Button
        label={busy ? 'Tomando captura…' : 'Tomar captura'}
        variant="secondary"
        disabled={busy}
        onClick={handleClick}
      />
      {failed && (
        <span className={css.status} role="alert">
          No se pudo tomar la captura. Inténtalo de nuevo.
        </span>
      )}
    </>
  );
};
