import { SOUND_SOURCES, type SoundName, SOUNDS } from '@/constants';

import { isSoundEnabled } from './use-sound-enabled';

// Caché a nivel de módulo: evita crear un nuevo HTMLAudioElement por cada componente que reproduzca el mismo efecto.
const audioCache: Partial<Record<SoundName, HTMLAudioElement>> = {};

const getAudio = (name: SoundName): HTMLAudioElement => {
  let audio = audioCache[name];
  if (!audio) {
    audio = new Audio(SOUND_SOURCES[name]);
    audioCache[name] = audio;
  }
  return audio;
};

// Sonidos de resultado (acierto/error). Los del modal son largos y prevalecen sobre los cortos en línea: así una
// misma validación que abre un `ModalFeedback` y además actualiza un `ValidationStatus` suena una sola vez.
const RESULT_PRIORITY: Partial<Record<SoundName, number>> = {
  [SOUNDS.SUCCESS]: 1,
  [SOUNDS.ERROR]: 1,
  [SOUNDS.CORRECT]: 2,
  [SOUNDS.WRONG]: 2
};
const RESULT_WINDOW_MS = 600;

let lastResult: { name: SoundName; at: number } | null = null;

/** Reproduce un efecto de sonido de interacción, respetando la preferencia de sonido. */
export const playSoundEffect = (name: SoundName) => {
  if (!isSoundEnabled()) return;

  const priority = RESULT_PRIORITY[name];
  if (priority) {
    const now = performance.now();
    if (lastResult && now - lastResult.at < RESULT_WINDOW_MS) {
      // Ya sonó un resultado igual o más importante en esta misma validación.
      if ((RESULT_PRIORITY[lastResult.name] ?? 0) >= priority) return;
      // Este es más importante: reemplaza al anterior.
      audioCache[lastResult.name]?.pause();
    }
    lastResult = { name, at: now };
  }

  const audio = getAudio(name);
  audio.currentTime = 0;
  void audio.play().catch(() => {});
};

/** Hook para reproducir efectos de sonido de interacción. */
export const usePlaySound = () => playSoundEffect;
