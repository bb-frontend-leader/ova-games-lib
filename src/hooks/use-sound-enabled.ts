import { useSyncExternalStore } from 'react';

const STORAGE_KEY = 'ova-games-lib:sound';
const listeners = new Set<() => void>();

const read = (): boolean => {
  try {
    return localStorage.getItem(STORAGE_KEY) !== 'off';
  } catch {
    return true;
  }
};

let enabled = read();

export const isSoundEnabled = () => enabled;

export const setSoundEnabled = (value: boolean) => {
  enabled = value;
  try {
    localStorage.setItem(STORAGE_KEY, value ? 'on' : 'off');
  } catch {
    // Sin almacenamiento disponible: la preferencia vale solo para esta visita.
  }
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

/** Preferencia de sonido del usuario (activo por defecto), recordada entre visitas. */
export const useSoundEnabled = () => useSyncExternalStore(subscribe, isSoundEnabled);
