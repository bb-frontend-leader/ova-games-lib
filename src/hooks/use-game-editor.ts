import { useCallback, useState } from 'react';

export interface GameEditor<T> {
  /** Lo que se está mostrando en el juego: el ejemplo o lo que escribió el docente. */
  content: T;
  /** El ejemplo con el que viene la página. */
  defaults: T;
  /** Cambia con cada «Ver en el juego»: sirve de `key` para que el juego arranque de cero con el contenido nuevo. */
  version: number;
  /** `true` si el docente ya reemplazó el ejemplo. */
  customized: boolean;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  apply: (next: T) => void;
  reset: () => void;
}

/** Estado del botón «Agregar preguntas»: el contenido de ejemplo, el que escribió el docente y si el editor está abierto. */
export function useGameEditor<T>(defaults: T): GameEditor<T> {
  const [custom, setCustom] = useState<T | null>(null);
  const [version, setVersion] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const apply = useCallback((next: T) => {
    setCustom(next);
    setVersion((current) => current + 1);
    setIsOpen(false);
  }, []);

  const reset = useCallback(() => {
    setCustom(null);
    setVersion((current) => current + 1);
    setIsOpen(false);
  }, []);

  return {
    content: custom ?? defaults,
    defaults,
    version,
    customized: custom !== null,
    isOpen,
    open,
    close,
    apply,
    reset
  };
}
