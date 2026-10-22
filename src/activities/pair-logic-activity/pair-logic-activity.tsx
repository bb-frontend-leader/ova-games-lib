import type { FC } from 'react';
import { useEffect, useId, useReducer, useRef } from 'react';

import { SOUNDS } from '@/constants';
import { usePlaySound } from '@/hooks';

import { getInputId, getResetId, shuffleIds } from './lib/utils';
import { PairLogicActivityProvider } from './pair-logic-activity-context';
import { PairLogicBoard } from './pair-logic-board';
import { PairLogicButton } from './pair-logic-button';

import type { OnResultData, Pair, Side, State } from './types/types';

const createState = (pairs: Pair[], shuffle: boolean): State => {
  const ids = pairs.map(({ id }) => id);

  return { imageId: null, textId: null, verdict: null, matched: [], textOrder: shuffle ? shuffleIds(ids) : ids };
};

interface Props {
  children: React.ReactNode;
  /** Parejas de la actividad. Conviene que sea una constante: el orden de los textos se mezcla al montar. */
  pairs: Pair[];
  /** Se llama con cada comprobación. */
  onResult?: (data: OnResultData) => void;
  /** Mezcla el orden de los textos (por defecto sí). Sin mezclar se listan como llegan en `pairs`. */
  shuffle?: boolean;
}

type SubComponents = {
  Board: typeof PairLogicBoard;
  Button: typeof PairLogicButton;
};

/**
 * Empareja imágenes con textos de uno en uno: se elige una imagen y un texto y "Comprobar" da el veredicto de ese
 * intento (sin temporizadores). La pareja correcta queda resuelta y la incorrecta se puede corregir cambiando
 * cualquiera de las dos elecciones. Al resolverlas todas se habilita "Reiniciar".
 */
export const PairLogicActivity: FC<Props> & SubComponents = ({ children, pairs, onResult, shuffle = true }) => {
  const uid = useId();
  const playSound = usePlaySound();

  const [activity, updateActivity] = useReducer(
    (prev: State, next: Partial<State>) => ({ ...prev, ...next }),
    pairs,
    (initial) => createState(initial, shuffle)
  );

  // Elemento que recibe el foco tras comprobar o reiniciar: el botón pulsado se deshabilita y el foco se perdería.
  const focusTarget = useRef<string | null>(null);

  useEffect(() => {
    if (!focusTarget.current) return;

    document.getElementById(focusTarget.current)?.focus();
    focusTarget.current = null;
  }, [activity]);

  const total = pairs.length;
  const complete = total > 0 && activity.matched.length === total;
  const canCheck = Boolean(activity.imageId && activity.textId) && !activity.verdict && !complete;

  const texts = activity.textOrder.flatMap((id) => pairs.find((pair) => pair.id === id) ?? []);

  /**
   * Elige una tarjeta de su columna y la coloca en su recuadro. Cambiar la elección descarta el veredicto anterior.
   * @param side - Columna de la tarjeta.
   * @param id - Id de su pareja.
   */
  const select = (side: Side, id: string) => {
    playSound(SOUNDS.TICK);

    // Tras un acierto la pareja resuelta sigue a la vista en los recuadros: elegir otra tarjeta empieza un intento limpio.
    const fresh: Partial<State> = activity.verdict === 'right' ? { imageId: null, textId: null } : {};

    updateActivity({ ...fresh, ...(side === 'image' ? { imageId: id } : { textId: id }), verdict: null });
  };

  /**
   * Comprueba la imagen y el texto elegidos y llama a `onResult`.
   */
  const handleValidation = () => {
    const { imageId, textId, matched, verdict } = activity;

    if (!imageId || !textId || verdict) return;

    const result = imageId === textId;
    const nextMatched = result ? [...matched, imageId] : matched;
    const isComplete = nextMatched.length === total;
    const nextFree = pairs.find(({ id }) => !nextMatched.includes(id));

    playSound(result ? SOUNDS.SUCCESS : SOUNDS.ERROR);

    // Acierto: a la siguiente imagen libre (o a Reiniciar al terminar). Error: a la imagen elegida, para corregirla.
    if (!result) focusTarget.current = getInputId(uid, 'image', imageId);
    else focusTarget.current = isComplete || !nextFree ? getResetId(uid) : getInputId(uid, 'image', nextFree.id);

    updateActivity(result ? { verdict: 'right', matched: nextMatched } : { verdict: 'wrong' });

    onResult?.({ result, imageId, textId, matched: nextMatched.length, total, complete: isComplete });
  };

  /**
   * Reinicia la actividad con los textos mezclados de nuevo.
   */
  const handleReset = () => {
    focusTarget.current = pairs[0] ? getInputId(uid, 'image', pairs[0].id) : null;

    updateActivity(createState(pairs, shuffle));
  };

  return (
    <PairLogicActivityProvider
      value={{
        uid,
        pairs,
        texts,
        imageId: activity.imageId,
        textId: activity.textId,
        verdict: activity.verdict,
        matched: activity.matched,
        complete,
        canCheck,
        select,
        handleValidation,
        handleReset
      }}
    >
      {children}
    </PairLogicActivityProvider>
  );
};

PairLogicActivity.Board = PairLogicBoard;
PairLogicActivity.Button = PairLogicButton;
