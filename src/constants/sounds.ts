/**
 * Efectos de sonido de interacción. Se referencian siempre vía `SOUNDS.XXX`.
 * Para agregar uno: copie el archivo a `public/assets/sound`, añada su clave en `SOUNDS` y su ruta en `SOUND_SOURCES`.
 */
export const SOUNDS = {
  BUTTON: 'button',
  CORRECT: 'correct',
  WRONG: 'wrong',
  /** Acierto en línea (sin modal): campanita corta. */
  SUCCESS: 'success',
  /** Error en línea (sin modal): dos notas graves descendentes. */
  ERROR: 'error',
  /** Marcar o seleccionar una opción. */
  TICK: 'tick',
  /** Soltar o encajar un elemento arrastrado. */
  DROP: 'drop',
  /** Voltear una carta. */
  FLIP: 'flip',
  /** Estallido (globos, burbujas). */
  POP: 'pop',
  /** Barrido de aire. */
  WHOOSH: 'whoosh',
  /** Se desbloquea algo nuevo. */
  UNLOCK: 'unlock',
  /** Fin de un nivel o juego. */
  LEVEL_COMPLETE: 'level-complete'
} as const;

export type SoundName = (typeof SOUNDS)[keyof typeof SOUNDS];

/** Rutas relativas a `public/`. */
export const SOUND_SOURCES: Record<SoundName, string> = {
  [SOUNDS.BUTTON]: 'assets/sound/button.mp3',
  [SOUNDS.CORRECT]: 'assets/sound/correct.mp3',
  [SOUNDS.WRONG]: 'assets/sound/wrong.mp3',
  [SOUNDS.SUCCESS]: 'assets/sound/success.mp3',
  [SOUNDS.ERROR]: 'assets/sound/error.mp3',
  [SOUNDS.TICK]: 'assets/sound/tick.mp3',
  [SOUNDS.DROP]: 'assets/sound/drop.mp3',
  [SOUNDS.FLIP]: 'assets/sound/flip.mp3',
  [SOUNDS.POP]: 'assets/sound/pop.mp3',
  [SOUNDS.WHOOSH]: 'assets/sound/whoosh.mp3',
  [SOUNDS.UNLOCK]: 'assets/sound/unlock.mp3',
  [SOUNDS.LEVEL_COMPLETE]: 'assets/sound/level-complete.mp3'
};
