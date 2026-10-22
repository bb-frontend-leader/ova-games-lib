import { useCallback, useMemo, useRef, useState } from 'react';

import { stopT } from './lib/road';
import { StopCardButton } from './stop-card-button';
import { StopGameContextProvider } from './stop-card-context';
import { StopCardInitial } from './stop-card-initial';
import { StopCardRadio } from './stop-card-radio';
import { StopCardScene } from './stop-card-scene';

import type { CheckEvent, Radio, SceneState } from './types/types';
import { States } from './types/types';

// Cuánto del tramo anterior retrocede el viajero con cada tropiezo (a los tres tropiezos vuelve a la parada anterior)
const RETREAT_PER_MISTAKE = 0.4;

interface StopCardProps {
  children: React.ReactNode;
  /** Número de paradas (preguntas) del camino. */
  questionCount: number;
}

type SubComponents = {
  Scene: typeof StopCardScene;
  Init: typeof StopCardInitial;
  Radio: typeof StopCardRadio;
  Button: typeof StopCardButton;
};

const emptyScene = (index: number): SceneState => ({ index, choice: null, status: 'idle', mistakes: 0, discarded: [] });

/**
 * Un camino con una parada por pregunta. El viajero espera en la parada actual: si la respuesta es correcta avanza
 * hasta la siguiente; si no, retrocede un tramo, la respuesta queda descartada y hay que volver a intentarlo. No se
 * puede responder una parada sin haber completado la anterior.
 */
const StopCard: React.FC<StopCardProps> & SubComponents = ({ children, questionCount }) => {
  const [scenes, setScenes] = useState<Record<string, SceneState>>({});
  const [lastCheck, setLastCheck] = useState<CheckEvent | null>(null);

  const scenesRef = useRef(scenes);
  const orderRef = useRef<string[]>([]);
  const tickRef = useRef(0);

  scenesRef.current = scenes;

  /**
   * Posición de la parada en el camino: el último número del `id` de la escena (stop-1, stop-2…) o, si no lo tiene,
   * el orden en que se montó.
   */
  const registerScene = useCallback((id: string) => {
    const match = id.match(/(\d+)$/);
    if (match) return Math.max(0, Number(match[1]) - 1);

    let position = orderRef.current.indexOf(id);
    if (position < 0) {
      orderRef.current.push(id);
      position = orderRef.current.length - 1;
    }

    return position;
  }, []);

  const choose = useCallback((sceneId: string, index: number, radio: Radio) => {
    setScenes((prev) => {
      const scene = prev[sceneId] ?? emptyScene(index);
      if (scene.status !== 'idle') return prev;

      return { ...prev, [sceneId]: { ...scene, choice: radio } };
    });
  }, []);

  /**
   * Comprueba la elección de una parada. Acierto: la parada queda completa. Fallo: suma un tropiezo y descarta esa
   * respuesta. En ambos casos publica el evento (`lastCheck`) para que la escena anime y entregue `onResult`.
   */
  const check = useCallback(
    (sceneId: string) => {
      const scene = scenesRef.current[sceneId];
      if (!scene?.choice || scene.status !== 'idle') return;

      const correct = scene.choice.state === States.SUCCESS;
      const next: SceneState = correct
        ? { ...scene, status: 'correct' }
        : { ...scene, status: 'wrong', mistakes: scene.mistakes + 1, discarded: [...scene.discarded, scene.choice.id] };

      const completed = Object.entries(scenesRef.current).filter(([id, s]) =>
        id === sceneId ? correct : s.status === 'correct'
      ).length;

      tickRef.current += 1;
      setScenes((prev) => ({ ...prev, [sceneId]: next }));
      setLastCheck({
        tick: tickRef.current,
        sceneId,
        correct,
        options: [scene.choice],
        mistakes: next.mistakes,
        finished: correct && completed >= questionCount
      });
    },
    [questionCount]
  );

  /** Tras un fallo: se limpia la elección (las descartadas siguen descartadas) y se puede volver a responder. */
  const retry = useCallback((sceneId: string) => {
    setScenes((prev) => {
      const scene = prev[sceneId];
      if (!scene || scene.status !== 'wrong') return prev;

      return { ...prev, [sceneId]: { ...scene, status: 'idle', choice: null } };
    });
  }, []);

  const progress = useMemo(() => {
    const list = Object.values(scenes);
    const done = new Set(list.filter((scene) => scene.status === 'correct').map((scene) => scene.index));

    // El camino es lineal: la parada actual es la primera sin completar
    let currentStop = 0;
    while (done.has(currentStop)) currentStop += 1;

    const finished = currentStop >= questionCount;
    const mistakesTotal = list.reduce((sum, scene) => sum + scene.mistakes, 0);
    const currentMistakes = list.find((scene) => scene.index === currentStop)?.mistakes ?? 0;

    const rest = stopT(currentStop, questionCount);
    const previous = currentStop === 0 ? 0 : stopT(currentStop - 1, questionCount);
    const retreat = Math.min(currentMistakes * RETREAT_PER_MISTAKE, 1) * (rest - previous);

    return { currentStop, finished, mistakesTotal, travelerT: finished ? 1 : rest - retreat };
  }, [scenes, questionCount]);

  return (
    <StopGameContextProvider
      value={{ questionCount, scenes, lastCheck, ...progress, registerScene, choose, check, retry }}
    >
      {children}
    </StopGameContextProvider>
  );
};

StopCard.Radio = StopCardRadio;
StopCard.Init = StopCardInitial;
StopCard.Scene = StopCardScene;
StopCard.Button = StopCardButton;

export { StopCard };
