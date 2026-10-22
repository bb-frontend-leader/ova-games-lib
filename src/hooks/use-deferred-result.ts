import { useCallback, useEffect, useRef } from 'react';

import { useCanAnimate } from './use-can-animate';

// Lo que dura la celebración (acierto) o el temblor (error) antes de entregar el resultado.
const RESULT_DELAY_MS = { success: 800, wrong: 550 } as const;

interface Pending {
  timer: ReturnType<typeof setTimeout>;
  run: () => void;
}

/**
 * Entrega el resultado de un juego al padre (`onResult`) un instante después de validar, para que se vea la
 * celebración o el temblor antes de que el padre abra su modal de retroalimentación. Sin movimiento permitido
 * (ver `useCanAnimate`) se entrega de inmediato.
 *
 * - `defer(deliver, success, delayMs?)`: programa la entrega (`delayMs` cambia la espera si la animación del juego dura más).
 * - `flush()`: entrega ya lo que esté en espera (p. ej. al reintentar de inmediato, para que no se pierda ni llegue tarde).
 * Al desmontar se cancela lo pendiente: el estudiante ya salió de la actividad.
 */
export const useDeferredResult = () => {
  const canAnimate = useCanAnimate();
  const pendingRef = useRef<Pending | null>(null);

  const defer = useCallback(
    (deliver: () => void, success: boolean, delayMs?: number) => {
      if (!canAnimate) {
        deliver();
        return;
      }

      const run = () => {
        pendingRef.current = null;
        deliver();
      };

      const delay = delayMs ?? (success ? RESULT_DELAY_MS.success : RESULT_DELAY_MS.wrong);

      pendingRef.current = { run, timer: setTimeout(run, delay) };
    },
    [canAnimate]
  );

  const flush = useCallback(() => {
    const pending = pendingRef.current;
    if (!pending) return;

    clearTimeout(pending.timer);
    pending.run();
  }, []);

  useEffect(
    () => () => {
      if (pendingRef.current) clearTimeout(pendingRef.current.timer);
    },
    []
  );

  return { defer, flush };
};
